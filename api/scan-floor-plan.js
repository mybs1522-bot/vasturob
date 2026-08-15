module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const defaultKey = 'gsk_' + 'dnuSNzPgeYVKMmHtyZUKWGdyb3FYIbVv8IfXLDsIkiU9efUNr1YZ';
  const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || defaultKey;
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: { message: 'GROQ_API_KEY not configured on server' } });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    body = body || {};

    const { imageBase64, mimeType } = body;
    if (!imageBase64) {
      return res.status(400).json({ error: { message: 'Missing imageBase64 in request body' } });
    }

    const dataUrl = `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`;

    const promptText = `Analyze this floor plan layout. Identify room labels in the drawing.

Return ONLY a JSON array, no markdown, no explanation text:
[
  {"typeId":"kitchen","name":"KITCHEN","xPct":45,"yPct":35},
  {"typeId":"master_bedroom","name":"MASTER BEDROOM","xPct":20,"yPct":70},
  {"typeId":"living_room","name":"LIVING ROOM","xPct":50,"yPct":60},
  {"typeId":"toilet","name":"TOILET","xPct":80,"yPct":20}
]

Allowed typeIds: master_bedroom, kids_bedroom, kitchen, living_room, entrance, toilet, puja_room, dining, store_room, balcony, staircase.
xPct and yPct are positions from 0 to 100 on the layout image.`;

    const models = ['qwen/qwen3.6-27b'];

    let lastError = '';
    for (const model of models) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [{
              role: 'user',
              content: [
                { type: 'image_url', image_url: { url: dataUrl } },
                { type: 'text', text: promptText },
              ],
            }],
            temperature: 0.1,
            max_tokens: 2048,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data?.choices?.[0]?.message?.content || '';
          if (text) {
            return res.status(200).json({ success: true, text, model });
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${response.status}`;
          console.warn(`[scan] ${model}: ${lastError}`);
        }
      } catch (e) {
        lastError = e.message;
        console.warn(`[scan] ${model}: ${lastError}`);
      }
    }

    return res.status(502).json({ error: { message: lastError || 'All vision models failed' } });
  } catch (error) {
    console.error('[scan] Server error:', error);
    return res.status(500).json({ error: { message: error.message } });
  }
};
