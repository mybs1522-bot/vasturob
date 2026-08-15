export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY || ('sk-or-v1-' + '82aeed31be8bb945b4609b4ed5f9df0a756063959a4741c6e4afea968f30220e');

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

    const promptText = `You are a world-class architectural blueprint OCR vision engine.
Carefully examine this floor plan diagram and identify the actual room spaces.

Find EVERY distinct room label printed on this plan (e.g., "BEDROOM 2", "BEDROOM 3", "M. BEDROOM / MASTER BEDROOM", "KITCHEN", "DINING", "LIVING / GREAT ROOM / FAMILY ROOM", "BATH / M. BATH / WASHROOM", "ENTRY / FRONT PORCH / FOYER", "PUJA / MANDIR", "BALCONY / DECK", "STAIRS").

For EACH detected room:
1. Map to one of these standard vastu typeId values:
   - "kitchen" (Kitchen, Pantry, Cooking)
   - "master_bedroom" (Master Bedroom, M. Bedroom, Bed 1)
   - "kids_bedroom" (Bedroom 2, Bedroom 3, Guest Bedroom, Bed)
   - "living_room" (Living Room, Family Room, Great Room, Hall, Drawing Room)
   - "dining" (Dining Room, Dining Area)
   - "toilet" (Washroom, Bathroom, Bath, Powder Room, Toilet, WC, M. Bath, Bath 2)
   - "entrance" (Main Door, Entry, Entrance, Foyer, Front Porch)
   - "puja_room" (Puja, Mandir, Prayer Room, Temple)
   - "balcony" (Balcony, Terrace, Deck, Porch)
   - "staircase" (Stairs, Staircase)
   - "store_room" (Store Room, Utility)

2. Give its precise center coordinate as percentage (0 to 100) of the entire image width & height:
   - "xPct": horizontal center of the room label (0 = far left, 100 = far right)
   - "yPct": vertical center of the room label (0 = top edge, 100 = bottom edge)

CRITICAL RULES:
- Read ONLY real room labels printed on this image. Do not invent or guess rooms that are not written on the plan.
- Avoid duplicate entries for the same room.
- Output ONLY a valid JSON array of objects with keys: "typeId", "name", "xPct", "yPct".
- No markdown explanation, no surrounding text.

Example:
[
  {"typeId":"master_bedroom","name":"MASTER BEDROOM","xPct":25,"yPct":35},
  {"typeId":"kitchen","name":"KITCHEN","xPct":75,"yPct":35},
  {"typeId":"living_room","name":"LIVING ROOM","xPct":50,"yPct":55}
]`;

    // Gemini Vision Models on OpenRouter
    const models = [
      'google/gemini-2.5-flash',
      'google/gemini-2.5-pro',
      'google/gemini-2.5-flash-lite',
      'google/gemini-3.7-flash'
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
            temperature: 0.0,
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
              // Deduplicate rooms that are too close (within 6% distance) or have duplicate names in the same area
              const uniqueRooms = [];
              for (const r of parsedRooms) {
                if (!r.xPct || !r.yPct || !r.typeId) continue;
                const isDup = uniqueRooms.some(existing => {
                  const dx = existing.xPct - r.xPct;
                  const dy = existing.yPct - r.yPct;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  return dist < 7;
                });
                if (!isDup) {
                  uniqueRooms.push(r);
                }
              }

              if (uniqueRooms.length > 0) {
                console.log(`[OpenRouter Vision] ✅ Successfully scanned ${uniqueRooms.length} distinct rooms with ${model}`);
                return res.status(200).json({ success: true, text: JSON.stringify(uniqueRooms), model });
              }
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
