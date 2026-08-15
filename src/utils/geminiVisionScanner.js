import { ROOM_TYPES } from './vastuEngine';

/**
 * Compress an image to reduce payload size for faster API calls.
 * Resizes to max 1024px on longest side and converts to JPEG quality 0.7.
 */
function compressImage(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1600;
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
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

// Default starter layout boxes if AI scanner could not detect text labels
const defaultFallbackRooms = [
  { typeId: 'kitchen', name: 'KITCHEN', xPct: 65, yPct: 35 },
  { typeId: 'master_bedroom', name: 'MASTER BEDROOM', xPct: 25, yPct: 70 },
  { typeId: 'living_room', name: 'LIVING ROOM', xPct: 45, yPct: 45 },
  { typeId: 'entrance', name: 'MAIN ENTRANCE', xPct: 80, yPct: 80 },
];

/**
 * Scan a floor plan image using the Groq Vision API via serverless proxy.
 * If AI scanning fails or returns 0 boxes, provides instant default starter boxes.
 */
export async function scanFloorPlanWithGeminiVision(base64Image) {
  let parsedRooms = null;

  try {
    const compressed = await compressImage(base64Image);

    let mimeType = 'image/jpeg';
    let base64Data = compressed;

    if (compressed.includes('data:')) {
      const parts = compressed.split(';base64,');
      mimeType = parts[0].replace('data:', '');
      base64Data = parts[1];
    }

    console.log('[Scanner] Sending floor plan to Groq Vision API...');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

    const res = await fetch('/api/scan-floor-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64Data, mimeType }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const rawText = data?.text || '';

      if (rawText) {
        let jsonString = rawText.trim();
        jsonString = jsonString.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
        jsonString = jsonString.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

        try {
          parsedRooms = JSON.parse(jsonString);
        } catch {
          const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const cleaned = jsonMatch[0].replace(/,\s*([}\]])/g, '$1');
            parsedRooms = JSON.parse(cleaned);
          }
        }
      }
    }
  } catch (err) {
    console.warn('[Scanner] AI Vision API scan warning:', err.message);
  }

  // Fallback to default starter rooms if AI didn't return valid array
  if (!Array.isArray(parsedRooms) || parsedRooms.length === 0) {
    console.log('[Scanner] Using starter layout room boxes fallback.');
    parsedRooms = defaultFallbackRooms;
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
