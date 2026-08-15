import { ROOM_TYPES } from './vastuEngine';

/**
 * HIGH-PRECISION FLOOR PLAN SCANNER
 * Strictly uses OpenRouter Qwen3 VL 32B Vision AI (via /api/scan-floor-plan serverless endpoint)
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

  console.log('[Scanner] 🚀 Calling OpenRouter Qwen3 VL 32B Vision AI exclusively...');

  // Extract base64 data from dataUrl
  let mimeType = 'image/jpeg';
  let base64Data = dataUrl;
  if (dataUrl.includes('data:')) {
    const parts = dataUrl.split(';base64,');
    mimeType = parts[0].replace('data:', '');
    base64Data = parts[1];
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout for AI

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
          console.log(`[Scanner] ✅ Qwen3 VL 32B detected ${parsedRooms.length} rooms! Model: ${data.model}`);
          return parsedRooms.map((r, i) => mapRoomToCanvas(r, i, offsetX, offsetY, drawW, drawH, 'ai'));
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
    // Rethrow to let the UI handle the error state (e.g. show manual placement)
    throw new Error("Failed to scan floor plan with Qwen AI: " + err.message);
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
