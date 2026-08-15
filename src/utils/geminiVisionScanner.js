import { ROOM_TYPES } from './vastuEngine';

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
 * Scan a floor plan image using the Groq Vision API via serverless proxy.
 * The API key stays server-side — never exposed in the browser.
 */
export async function scanFloorPlanWithGeminiVision(base64Image) {
  // Compress image for faster upload & processing
  const compressed = await compressImage(base64Image);

  let mimeType = 'image/jpeg';
  let base64Data = compressed;

  if (compressed.includes('data:')) {
    const parts = compressed.split(';base64,');
    mimeType = parts[0].replace('data:', '');
    base64Data = parts[1];
  }

  console.log('[Scanner] Sending floor plan to Groq Vision API...');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000); // 45s timeout

    const res = await fetch('/api/scan-floor-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64Data, mimeType }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Server returned ${res.status}`);
    }

    const data = await res.json();
    const rawText = data?.text || '';

    if (!rawText) {
      throw new Error('No response from vision model.');
    }

    console.log('[Scanner] ✅ Got response from', data.model);

    // Parse JSON from response
    let jsonString = rawText.trim();
    // Strip markdown code fences if present
    jsonString = jsonString.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    // Strip any thinking/reasoning blocks
    jsonString = jsonString.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    let parsedRooms;
    try {
      parsedRooms = JSON.parse(jsonString);
    } catch {
      try {
        const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const cleaned = jsonMatch[0].replace(/,\s*([}\]])/g, '$1');
          parsedRooms = JSON.parse(cleaned);
        }
      } catch {
        try {
          const fixedString = jsonString
            .replace(/,\s*([}\]])/g, '$1')
            .replace(/'/g, '"')
            .replace(/(\w+)\s*:/g, '"$1":');
          const jsonMatch2 = fixedString.match(/\[[\s\S]*\]/);
          if (jsonMatch2) parsedRooms = JSON.parse(jsonMatch2[0]);
        } catch {
          // All strategies failed
        }
      }
    }

    if (!Array.isArray(parsedRooms) || parsedRooms.length === 0) {
      console.error('[Scanner] Raw response:', rawText);
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
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Floor plan scan timed out. Please try again.');
    }
    throw err;
  }
}
