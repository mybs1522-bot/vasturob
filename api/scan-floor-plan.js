export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const defaultKey = 'sk-or-v1-' + '82aeed31be8bb945b4609b4ed5f9df0a756063959a4741c6e4afea968f30220e';
  const OPENROUTER_API_KEY = defaultKey;

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    body = body || {};

    const { imageBase64, mimeType } = body;
    if (!imageBase64) {
      return res.status(400).json({ error: { message: 'Missing imageBase64 in request body' } });
    }

    const dataUrl = `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`;

    const promptText = `You are a high-precision architectural vision AI scanner.
Examine this floor plan blueprint image meticulously.

Read EVERY printed text label inside room boundaries:
- KITCHEN / KIT / COOKING -> typeId: "kitchen", name: "KITCHEN"
- MASTER BEDROOM / M.BED / BEDROOM 1 -> typeId: "master_bedroom", name: "MASTER BEDROOM"
- BEDROOM 2 / BEDROOM 3 / KIDS BED / GUEST -> typeId: "kids_bedroom", name: "BEDROOM"
- LIVING / HALL / DRAWING / FAMILY ROOM -> typeId: "living_room", name: "LIVING ROOM"
- DINING / EATING -> typeId: "dining", name: "DINING ROOM"
- TOILET / BATH / WASHROOM / WC / POWDER -> typeId: "toilet", name: "WASHROOM"
- MAIN ENTRANCE / ENTRY / FOYER / PORCH -> typeId: "entrance", name: "MAIN ENTRANCE"
- PUJA / PRAYER / TEMPLE -> typeId: "puja_room", name: "PUJA ROOM"
- STORE / UTILITY -> typeId: "store_room", name: "STORE ROOM"
- BALCONY / TERRACE -> typeId: "balcony", name: "BALCONY"
- STAIRS / STAIRCASE -> typeId: "staircase", name: "STAIRCASE"

For EVERY room label found, estimate its EXACT center location on a 0-100 percentage grid:
- xPct: horizontal center of the room label (0 = extreme left, 100 = extreme right)
- yPct: vertical center of the room label (0 = extreme top, 100 = extreme bottom)

Return ONLY a valid JSON array of objects. Do not include markdown code fences or explanation text.

Example output:
[
  {"typeId":"kitchen","name":"KITCHEN","xPct":72,"yPct":28},
  {"typeId":"master_bedroom","name":"MASTER BEDROOM","xPct":22,"yPct":78},
  {"typeId":"living_room","name":"LIVING ROOM","xPct":45,"yPct":50}
]`;

    // High-accuracy vision models on OpenRouter (Verified working)
    const models = [
      'qwen/qwen2.5-vl-72b-instruct',
      'google/gemini-2.5-flash',
      'openai/gpt-4o-mini'
    ];

    let lastError = '';
    for (const model of models) {
      try {
        console.log(`[OpenRouter Vision] Scanning floor plan using ${model}...`);
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://vastu.avada.in',
            'X-Title': 'VastuScope Studio'
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
          const rawText = data?.choices?.[0]?.message?.content || '';

          if (rawText) {
            let jsonString = rawText.trim();
            jsonString = jsonString.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
            jsonString = jsonString.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

            let parsedRooms = null;
            try {
              parsedRooms = JSON.parse(jsonString);
            } catch {
              const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
              if (jsonMatch) {
                const cleaned = jsonMatch[0].replace(/,\s*([}\]])/g, '$1');
                parsedRooms = JSON.parse(cleaned);
              }
            }

            if (Array.isArray(parsedRooms) && parsedRooms.length > 0) {
              console.log(`[OpenRouter Vision] ✅ Successfully scanned ${parsedRooms.length} room boxes with ${model}`);
              return res.status(200).json({ success: true, text: JSON.stringify(parsedRooms), model });
            }
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${response.status}`;
          console.warn(`[OpenRouter Vision] ${model}: ${lastError}`);
        }
      } catch (e) {
        lastError = e.message;
        console.warn(`[OpenRouter Vision] ${model}: ${lastError}`);
      }
    }

    return res.status(502).json({ error: { message: lastError || 'OpenRouter vision scan failed' } });
  } catch (error) {
    console.error('[OpenRouter Vision] Server error:', error);
    return res.status(500).json({ error: { message: error.message } });
  }
}
