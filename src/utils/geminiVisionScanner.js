import { ROOM_TYPES } from './vastuEngine';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBl4SJsKLSSFSkgoLgp_x_JqZWEHX3hwr0';

/**
 * Compress an image to reduce payload size for faster API calls.
 * Resizes to max 1024px on longest side and converts to JPEG quality 0.7.
 */
function compressImage(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1024;
      let w = img.width;
      let h = img.height;
      if (w > MAX || h > MAX) {
        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
        else { w = Math.round(w * MAX / h); h = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => resolve(dataUrl); // fallback to original
    img.src = dataUrl;
  });
}

/**
 * Scan a floor plan image using Google Gemini Vision API.
 * Uses Vite dev proxy (/api/gemini) to bypass CORS.
 * Compresses image first for speed.
 */
export async function scanFloorPlanWithGeminiVision(base64Image, customApiKey = null) {
  const keyToUse = customApiKey || API_KEY;
  if (!keyToUse) {
    throw new Error('API Key missing.');
  }

  // Compress image for faster upload & processing
  const compressed = await compressImage(base64Image);

  let mimeType = 'image/jpeg';
  let base64Data = compressed;

  if (compressed.includes('data:')) {
    const parts = compressed.split(';base64,');
    mimeType = parts[0].replace('data:', '');
    base64Data = parts[1];
  }

  const promptText = `Analyze this floor plan image. Identify every room label you can read.

For each room, return:
- typeId: one of "master_bedroom", "kids_bedroom", "kitchen", "living_room", "entrance", "toilet", "puja_room", "brahmasthan"
- name: the exact text label from the image
- xPct: horizontal position as percentage (0=left, 100=right)
- yPct: vertical position as percentage (0=top, 100=bottom)

Map rooms: bedroom/master→master_bedroom, bedroom 2/3/guest→kids_bedroom, kitchen/pantry→kitchen, living/great/hall/dining→living_room, entry/foyer/porch/garage→entrance, bath/toilet/powder→toilet, puja/prayer→puja_room.

Return ONLY a JSON array, no markdown:
[{"typeId":"kitchen","name":"KITCHEN","xPct":50,"yPct":60}]`;

  const payload = {
    contents: [{
      parts: [
        { inlineData: { mimeType, data: base64Data } },
        { text: promptText },
      ],
    }],
    generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
  };

  // Try multiple model names for maximum compatibility
  const models = [
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-pro-vision',
  ];

  let rawResponseText = '';
  let lastError = '';

  for (const modelName of models) {
    // Use Vite proxy to bypass browser CORS — this is the key fix
    const proxyUrl = `/api/gemini/v1beta/models/${modelName}:generateContent?key=${keyToUse}`;
    // Direct URL as last-resort fallback
    const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${keyToUse}`;

    for (const url of [proxyUrl, directUrl]) {
      try {
        console.log(`Trying ${modelName} via ${url.startsWith('/api') ? 'proxy' : 'direct'}...`);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          rawResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (rawResponseText) {
            console.log(`✅ Scanned with ${modelName}`);
            break;
          }
        } else {
          const errBody = await res.json().catch(() => ({}));
          lastError = errBody?.error?.message || `HTTP ${res.status}`;
          console.warn(`${modelName}: ${lastError}`);
        }
      } catch (e) {
        if (e.name === 'AbortError') {
          lastError = `${modelName}: request timed out`;
        } else {
          lastError = e.message;
        }
        console.warn(`${modelName}: ${lastError}`);
      }
    }
    if (rawResponseText) break;
  }

  if (!rawResponseText) {
    throw new Error(lastError || 'Scanning failed. Please check your internet connection.');
  }

  // Parse JSON from response — try multiple strategies
  let jsonString = rawResponseText.trim();
  // Strip markdown code fences if present
  jsonString = jsonString.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

  let parsedRooms;
  try {
    // Strategy 1: Direct parse (response is clean JSON)
    parsedRooms = JSON.parse(jsonString);
  } catch {
    try {
      // Strategy 2: Extract JSON array via regex
      const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        // Fix trailing commas which are invalid JSON
        const cleaned = jsonMatch[0].replace(/,\s*([}\]])/g, '$1');
        parsedRooms = JSON.parse(cleaned);
      }
    } catch {
      // Strategy 3: Try to fix common issues
      try {
        const fixedString = jsonString
          .replace(/,\s*([}\]])/g, '$1')  // trailing commas
          .replace(/'/g, '"')              // single quotes
          .replace(/(\w+)\s*:/g, '"$1":'); // unquoted keys
        const jsonMatch2 = fixedString.match(/\[[\s\S]*\]/);
        if (jsonMatch2) parsedRooms = JSON.parse(jsonMatch2[0]);
      } catch {
        // All strategies failed
      }
    }
  }

  if (!Array.isArray(parsedRooms) || parsedRooms.length === 0) {
    console.error('Raw response:', rawResponseText);
    throw new Error('No rooms detected in the floor plan.');
  }

  return parsedRooms.map((r, index) => {
    const matchedType = ROOM_TYPES.find((t) => t.id === r.typeId) || ROOM_TYPES.find((t) => t.id === 'living_room');

    const xPct = Math.min(Math.max(r.xPct || 50, 5), 95);
    const yPct = Math.min(Math.max(r.yPct || 50, 5), 95);

    return {
      id: `scan_${index}_${Date.now()}`,
      typeId: matchedType.id,
      name: r.name || matchedType.name,
      color: matchedType.color || '#d97706',
      x: Math.round((xPct / 100) * 800),
      y: Math.round((yPct / 100) * 600),
      isAutoDetected: true,
    };
  });
}
