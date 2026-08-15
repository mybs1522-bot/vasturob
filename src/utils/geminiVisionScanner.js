import { createWorker } from 'tesseract.js';
import { ROOM_TYPES } from './vastuEngine';

/**
 * HIGH-PRECISION FLOOR PLAN SCANNER
 * Priority 1: OpenRouter Qwen3 VL 32B Vision AI (via /api/scan-floor-plan serverless endpoint)
 * Priority 2: Tesseract.js Client-Side OCR with binarization preprocessing
 * Priority 3: Default starter room placement
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

  // ──────────────────────────────────────────────
  // PRIORITY 1: OpenRouter Qwen3 VL 32B Vision AI
  // ──────────────────────────────────────────────
  try {
    console.log('[Scanner] 🚀 Calling OpenRouter Qwen3 VL 32B Vision AI...');

    // Extract base64 data from dataUrl
    let mimeType = 'image/jpeg';
    let base64Data = dataUrl;
    if (dataUrl.includes('data:')) {
      const parts = dataUrl.split(';base64,');
      mimeType = parts[0].replace('data:', '');
      base64Data = parts[1];
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

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
        }
      }
    } else {
      const errData = await res.json().catch(() => ({}));
      console.warn('[Scanner] OpenRouter API error:', errData?.error?.message || res.status);
    }
  } catch (err) {
    console.warn('[Scanner] OpenRouter API call failed:', err.message);
  }

  // ──────────────────────────────────────────────
  // PRIORITY 2: Tesseract.js Client-Side OCR
  // ──────────────────────────────────────────────
  let worker = null;
  try {
    console.log('[Scanner] 📖 Falling back to Tesseract.js client-side OCR...');
    const { processedUrl } = await preprocessImageForOCR(dataUrl);

    worker = await createWorker('eng');
    const { data } = await worker.recognize(processedUrl);
    await worker.terminate();
    worker = null;

    console.log('[Scanner] Tesseract recognized text:\n', data.text);

    const detectedRooms = [];
    const itemsToScan = [];
    if (Array.isArray(data.lines)) {
      for (const line of data.lines) {
        if (line.text && line.bbox) itemsToScan.push({ text: line.text, bbox: line.bbox });
      }
    }
    if (Array.isArray(data.words)) {
      for (const word of data.words) {
        if (word.text && word.bbox) itemsToScan.push({ text: word.text, bbox: word.bbox });
      }
    }

    for (const item of itemsToScan) {
      const cleanText = (item.text || '').toUpperCase().replace(/[^A-Z0-9\s]/g, ' ').trim();
      if (!cleanText || cleanText.includes('FLOOR PLAN') || cleanText.includes('MAIN FLOOR') || cleanText.length < 2) continue;

      for (const entry of KEYWORD_MAP) {
        if (entry.keywords.some(kw => cleanText.includes(kw)) && item.bbox) {
          const centerX = ((item.bbox.x0 + item.bbox.x1) / 2 / imgW) * 800;
          const centerY = ((item.bbox.y0 + item.bbox.y1) / 2 / imgH) * 600;
          const clampedX = Math.min(Math.max(60, Math.round(centerX)), 740);
          const clampedY = Math.min(Math.max(60, Math.round(centerY)), 540);

          const isDuplicate = detectedRooms.some(r => Math.abs(r.x - clampedX) < 50 && Math.abs(r.y - clampedY) < 50);
          if (!isDuplicate) {
            const matchedType = ROOM_TYPES.find(t => t.id === entry.typeId) || ROOM_TYPES[0];
            detectedRooms.push({
              id: `ocr_${Date.now()}_${detectedRooms.length}`,
              typeId: matchedType.id, name: entry.name,
              color: matchedType.color || '#d97706',
              x: clampedX, y: clampedY, isAutoDetected: true,
            });
          }
          break;
        }
      }
    }

    if (detectedRooms.length > 0) {
      console.log(`[Scanner] ✅ Tesseract OCR detected ${detectedRooms.length} rooms.`);
      return detectedRooms;
    }
  } catch (err) {
    console.error('[Scanner] Tesseract OCR error:', err);
    if (worker) { try { await worker.terminate(); } catch {} }
  }

  // ──────────────────────────────────────────────
  // PRIORITY 3: Default starter layout
  // ──────────────────────────────────────────────
  console.log('[Scanner] Using default starter room placement.');
  return DEFAULT_FALLBACK.map((r, i) => {
    const matchedType = ROOM_TYPES.find(t => t.id === r.typeId) || ROOM_TYPES[0];
    return {
      id: `fallback_${Date.now()}_${i}`, typeId: matchedType.id, name: r.name,
      color: matchedType.color || '#d97706', x: r.x, y: r.y, isAutoDetected: true,
    };
  });
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

function preprocessImageForOCR(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w < 1200 || h < 1200) {
        const scale = Math.max(1200 / w, 1200 / h);
        w = Math.round(w * scale); h = Math.round(h * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      try {
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          const b = gray < 135 ? 0 : 255;
          data[i] = b; data[i + 1] = b; data[i + 2] = b;
        }
        ctx.putImageData(imgData, 0, 0);
        resolve({ processedUrl: canvas.toDataURL('image/png'), origWidth: img.width, origHeight: img.height });
      } catch (e) {
        resolve({ processedUrl: dataUrl, origWidth: img.width, origHeight: img.height });
      }
    };
    img.onerror = () => resolve({ processedUrl: dataUrl, origWidth: 800, origHeight: 600 });
    img.src = dataUrl;
  });
}

function getImageDimensions(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => resolve({ width: 800, height: 600 });
    img.src = dataUrl;
  });
}

const KEYWORD_MAP = [
  { keywords: ['KITCHEN', 'KIT', 'COOKING', 'PANTRY'], typeId: 'kitchen', name: 'KITCHEN' },
  { keywords: ['MASTER', 'M.BED', 'BEDROOM 1', 'M.BEDROOM', 'MBED'], typeId: 'master_bedroom', name: 'MASTER BEDROOM' },
  { keywords: ['BEDROOM', 'BED', 'BEDROOM 2', 'BEDROOM 3', 'KIDS BED', 'GUEST'], typeId: 'kids_bedroom', name: 'BEDROOM' },
  { keywords: ['LIVING', 'HALL', 'DRAWING', 'SITTING', 'FAMILY', 'GREAT ROOM'], typeId: 'living_room', name: 'LIVING ROOM' },
  { keywords: ['DINING', 'EATING'], typeId: 'dining', name: 'DINING ROOM' },
  { keywords: ['TOILET', 'BATH', 'WASHROOM', 'WC', 'POWDER', 'BATHROOM'], typeId: 'toilet', name: 'WASHROOM' },
  { keywords: ['ENTRANCE', 'ENTRY', 'FOYER', 'PORCH', 'MAIN DOOR'], typeId: 'entrance', name: 'MAIN ENTRANCE' },
  { keywords: ['PUJA', 'POOJA', 'PRAYER', 'TEMPLE'], typeId: 'puja_room', name: 'PUJA ROOM' },
  { keywords: ['STORE', 'UTILITY'], typeId: 'store_room', name: 'STORE ROOM' },
  { keywords: ['BALCONY', 'TERRACE', 'DECK'], typeId: 'balcony', name: 'BALCONY' },
  { keywords: ['STAIRS', 'STAIRCASE', 'STAIR'], typeId: 'staircase', name: 'STAIRCASE' },
];

const DEFAULT_FALLBACK = [
  { typeId: 'kitchen', name: 'KITCHEN', x: 620, y: 220 },
  { typeId: 'master_bedroom', name: 'MASTER BEDROOM', x: 220, y: 220 },
  { typeId: 'living_room', name: 'LIVING ROOM', x: 320, y: 440 },
  { typeId: 'entrance', name: 'MAIN ENTRANCE', x: 600, y: 480 },
];
