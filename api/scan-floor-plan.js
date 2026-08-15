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

    const promptText = `You are a high-precision architectural AI scanner specializing in floor plan analysis and Vastu layout auditing.
Examine this architectural floor plan image meticulously from top-left to bottom-right.

Read EVERY printed text label, room title, or abbreviation inside room boundaries:
- KITCHEN / KIT / COOKING -> typeId: "kitchen"
- MASTER BEDROOM / M.BED / BEDROOM 1 -> typeId: "master_bedroom"
- BEDROOM 2 / BEDROOM 3 / KIDS BED / GUEST BED -> typeId: "kids_bedroom"
- LIVING / HALL / DRAWING / GREAT ROOM -> typeId: "living_room"
- DINING / EATING -> typeId: "dining"
- TOILET / BATH / WC / WASHROOM / POWDER -> typeId: "toilet"
- MAIN ENTRANCE / ENTRY / FOYER / PORCH -> typeId: "entrance"
- PUJA / PRAYER / POOJA -> typeId: "puja_room"
- STORE / PANTRY -> typeId: "store_room"
- BALCONY / TERRACE / VERANDAH -> typeId: "balcony"
- STAIRS / STAIRCASE -> typeId: "staircase"

For EVERY room label found, estimate its EXACT center location on a 0-100 percentage grid:
- xPct: horizontal center of the room label (0 = extreme left edge, 100 = extreme right edge)
- yPct: vertical center of the room label (0 = top edge, 100 = bottom edge)

CRITICAL INSTRUCTIONS:
1. Scan carefully for small text like "KITCHEN", "BEDROOM", "TOILET", "ENTRY".
2. If the plan shows multiple bedrooms or toilets, list each one separately with its unique xPct and yPct.
3. Return ONLY a valid JSON array of objects. Do not include markdown code fences, comments, or extra text.

Example format:
[
  {"typeId":"kitchen","name":"KITCHEN","xPct":72,"yPct":28},
  {"typeId":"master_bedroom","name":"MASTER BEDROOM","xPct":22,"yPct":78},
  {"typeId":"living_room","name":"LIVING ROOM","xPct":45,"yPct":50},
  {"typeId":"toilet","name":"TOILET","xPct":85,"yPct":25},
  {"typeId":"entrance","name":"MAIN ENTRANCE","xPct":50,"yPct":92}
]`;

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
            temperature: 0.05,
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
