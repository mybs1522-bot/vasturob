export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query;
  const targetPath = Array.isArray(path) ? path.join('/') : path || '';

  // Reconstruct query params (excluding 'path' which is the catch-all param)
  const url = new URL(req.url, `https://${req.headers.host}`);
  const params = new URLSearchParams(url.search);
  params.delete('path');

  const googleUrl = `https://generativelanguage.googleapis.com/${targetPath}?${params.toString()}`;

  try {
    const response = await fetch(googleUrl, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Gemini proxy error:', error);
    return res.status(502).json({ error: { message: error.message } });
  }
}
