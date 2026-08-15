module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Extract path segments from catch-all route
    const pathSegments = req.query.path;
    const targetPath = Array.isArray(pathSegments) ? pathSegments.join('/') : (pathSegments || '');

    // Extract the API key from query params
    const apiKey = req.query.key || '';

    const googleUrl = `https://generativelanguage.googleapis.com/${targetPath}?key=${apiKey}`;

    console.log('[Gemini Proxy] Forwarding to:', googleUrl.replace(apiKey, 'REDACTED'));

    const fetchOptions = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (req.method === 'POST' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(googleUrl, fetchOptions);
    const data = await response.json();

    console.log('[Gemini Proxy] Google responded with status:', response.status);

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('[Gemini Proxy] Error:', error.message);
    return res.status(502).json({ error: { message: 'Proxy error: ' + error.message } });
  }
};
