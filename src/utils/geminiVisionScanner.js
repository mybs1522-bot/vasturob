import { ROOM_TYPES } from './vastuEngine';

/**
 * HIGH-PRECISION FLOOR PLAN SCANNER
 * Uses OpenRouter Vision AI (GPT-4o / Gemini 2.5 Flash) via /api/scan-floor-plan
 */
export async function scanFloorPlanWithGeminiVision(dataUrl) {
  // Get image dimensions for coordinate mapping
  const imgDims = await getImageDimensions(dataUrl);
  const imgW = imgDims.width || 800;
  const imgH = imgDims.height || 600;

  // Calculate object-contain letterbox offsets
  const canvasW = 800, canvasH = 600;
  const imgAspect = imgW / imgH, canvasAspect = canvasW / canvasH;
  let drawW, drawH, offsetX, offsetY;
  if (imgAspect > canvasAspect) {
    drawW = canvasW; drawH = canvasW / imgAspect; offsetX = 0; offsetY = (canvasH - drawH) / 2;
  } else {
    drawH = canvasH; drawW = canvasH * imgAspect; offsetX = (canvasW - drawW) / 2; offsetY = 0;
  }

  console.log('[Scanner] 🚀 Calling OpenRouter Vision AI (GPT-4o / Gemini 2.5)...');

  // Compress and resize image to prevent 4.5MB Serverless Function limits
  const compressedDataUrl = await compressImage(dataUrl, 1600);
  let mimeType = 'image/jpeg';
  let base64Data = compressedDataUrl;
  if (compressedDataUrl.includes('data:')) {
    const parts = compressedDataUrl.split(';base64,');
    mimeType = parts[0].replace('data:', '');
    base64Data = parts[1];
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch('/api/scan-floor-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64Data, mimeType }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.text) {
        let parsedRooms;
        try {
          parsedRooms = JSON.parse(data.text);
        } catch {
          const jsonMatch = data.text.match(/\[[\s\S]*\]/);
          if (jsonMatch) parsedRooms = JSON.parse(jsonMatch[0].replace(/,\s*([}\]])/g, '$1'));
        }

        if (Array.isArray(parsedRooms) && parsedRooms.length > 0) {
          const modelDisplayName = (data.model || '').includes('gpt-4o')
            ? 'OpenAI GPT-4o Vision'
            : (data.model || '').includes('gemini')
            ? 'Gemini 2.5 Flash Vision'
            : 'AI Vision';

          console.log(`[Scanner] ✅ ${modelDisplayName} detected ${parsedRooms.length} rooms!`);
          const mapped = parsedRooms.map((r, i) => mapRoomToCanvas(r, i, offsetX, offsetY, drawW, drawH, 'ai'));
          mapped.modelName = modelDisplayName;
          return mapped;
        } else {
          throw new Error("AI returned empty or invalid room array.");
        }
      } else {
        throw new Error(data.error || "AI scanning failed.");
      }
    } else {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP ${res.status}`);
    }
  } catch (err) {
    clearTimeout(timeout);
    console.error('[Scanner] OpenRouter API call failed:', err.message);
    throw new Error("Failed to scan floor plan with Vision AI: " + err.message);
  }
}

// ── Helpers ────────────────────────────────────────

function mapRoomToCanvas(r, index, offsetX, offsetY, drawW, drawH, prefix) {
  const matchedType = ROOM_TYPES.find(t => t.id === r.typeId) || ROOM_TYPES.find(t => t.id === 'living_room');
  const xPct = Math.min(Math.max(r.xPct || 50, 5), 95);
  const yPct = Math.min(Math.max(r.yPct || 50, 5), 95);
  const canvasX = Math.round(offsetX + (xPct / 100) * drawW);
  const canvasY = Math.round(offsetY + (yPct / 100) * drawH);

  return {
    id: `${prefix}_${index}_${Date.now()}`,
    typeId: matchedType.id,
    name: r.name || matchedType.name,
    color: matchedType.color || '#d97706',
    x: Math.min(Math.max(60, canvasX), 740),
    y: Math.min(Math.max(60, canvasY), 540),
    isAutoDetected: true,
  };
}

function getImageDimensions(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => resolve({ width: 800, height: 600 });
    img.src = dataUrl;
  });
}

function compressImage(dataUrl, maxSize = 1600) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > maxSize || h > maxSize) {
        const scale = Math.min(maxSize / w, maxSize / h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
