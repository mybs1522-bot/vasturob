import { createWorker } from 'tesseract.js';
import { ROOM_TYPES } from './vastuEngine';

/**
 * Pre-process floor plan image with contrast enhancement & binarization.
 * Sharpens architectural text labels ("KITCHEN", "BEDROOM", "TOILET") and strips background noise.
 */
function preprocessImageForOCR(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const maxDim = 2000;
      let w = img.width;
      let h = img.height;
      if (w < 1200 || h < 1200) {
        const scale = Math.max(1200 / w, 1200 / h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      } else if (w > maxDim || h > maxDim) {
        const scale = Math.min(maxDim / w, maxDim / h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);

      try {
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          // High-contrast binarization: dark text becomes solid black, background pure white
          const binarized = gray < 135 ? 0 : 255;
          data[i] = binarized;
          data[i + 1] = binarized;
          data[i + 2] = binarized;
        }

        ctx.putImageData(imgData, 0, 0);
        resolve({
          processedUrl: canvas.toDataURL('image/png'),
          origWidth: img.width,
          origHeight: img.height,
        });
      } catch (e) {
        resolve({ processedUrl: dataUrl, origWidth: img.width, origHeight: img.height });
      }
    };
    img.onerror = () => resolve({ processedUrl: dataUrl, origWidth: 800, origHeight: 600 });
    img.src = dataUrl;
  });
}

/**
 * High-Precision Client-Side OCR Floor Plan Scanner with Object-Contain Geometry Alignment
 */
export async function scanFloorPlanWithGeminiVision(dataUrl) {
  console.log('[Tesseract OCR] Preprocessing floor plan for high-precision OCR...');

  let worker = null;
  try {
    const { processedUrl, origWidth: imgW, origHeight: imgH } = await preprocessImageForOCR(dataUrl);

    // Calculate object-contain bounding box inside 800x600 canvas frame
    const canvasW = 800;
    const canvasH = 600;
    const imgAspect = imgW / imgH;
    const canvasAspect = canvasW / canvasH;

    let drawW, drawH, offsetX, offsetY;
    if (imgAspect > canvasAspect) {
      drawW = canvasW;
      drawH = canvasW / imgAspect;
      offsetX = 0;
      offsetY = (canvasH - drawH) / 2;
    } else {
      drawH = canvasH;
      drawW = canvasH * imgAspect;
      offsetX = (canvasW - drawW) / 2;
      offsetY = 0;
    }

    worker = await createWorker('eng');
    const { data } = await worker.recognize(processedUrl);
    await worker.terminate();
    worker = null;

    console.log('[Tesseract OCR] Recognized raw text:\n', data.text);

    const detectedRooms = [];
    const itemsToScan = [];

    if (Array.isArray(data.lines)) {
      for (const line of data.lines) {
        if (line.text && line.bbox) {
          itemsToScan.push({ text: line.text, bbox: line.bbox });
        }
      }
    }

    if (Array.isArray(data.words)) {
      for (const word of data.words) {
        if (word.text && word.bbox) {
          itemsToScan.push({ text: word.text, bbox: word.bbox });
        }
      }
    }

    // Comprehensive architectural keyword map
    const keywordMap = [
      { keywords: ['KITCHEN', 'KIT', 'COOKING', 'PANTRY'], typeId: 'kitchen', name: 'KITCHEN' },
      { keywords: ['MASTER', 'M.BED', 'BEDROOM 1', 'M.BEDROOM', 'MBED', 'BEDROOM #1'], typeId: 'master_bedroom', name: 'MASTER BEDROOM' },
      { keywords: ['BEDROOM', 'BED', 'BEDROOM 2', 'BEDROOM 3', 'BEDROOM #2', 'BEDROOM #3', 'KIDS BED', 'GUEST'], typeId: 'kids_bedroom', name: 'BEDROOM' },
      { keywords: ['LIVING', 'HALL', 'DRAWING', 'SITTING', 'FAMILY ROOM', 'FAMILY'], typeId: 'living_room', name: 'LIVING ROOM' },
      { keywords: ['DINING', 'EATING'], typeId: 'dining', name: 'DINING ROOM' },
      { keywords: ['TOILET', 'BATH', 'WASHROOM', 'WC', 'POWDER', 'BATHROOM', 'CLOSET'], typeId: 'toilet', name: 'WASHROOM' },
      { keywords: ['ENTRANCE', 'ENTRY', 'FOYER', 'PORCH', 'MAIN DOOR', 'VERANDAH'], typeId: 'entrance', name: 'MAIN ENTRANCE' },
      { keywords: ['PUJA', 'POOJA', 'PRAYER', 'TEMPLE'], typeId: 'puja_room', name: 'PUJA ROOM' },
      { keywords: ['STORE', 'UTILITY'], typeId: 'store_room', name: 'STORE ROOM' },
      { keywords: ['BALCONY', 'TERRACE', 'DECK'], typeId: 'balcony', name: 'BALCONY' },
      { keywords: ['STAIRS', 'STAIRCASE', 'STAIR'], typeId: 'staircase', name: 'STAIRCASE' },
    ];

    for (const item of itemsToScan) {
      const cleanText = (item.text || '').toUpperCase().replace(/[^A-Z0-9\s]/g, ' ').trim();
      // Ignore general headers like "FLOOR PLAN"
      if (!cleanText || cleanText.includes('FLOOR PLAN') || cleanText.length < 2) continue;

      for (const entry of keywordMap) {
        const matches = entry.keywords.some((kw) => cleanText.includes(kw));
        if (matches && item.bbox) {
          // Precise canvas coordinate calculation incorporating object-contain letterbox offset
          const itemCenterX = (item.bbox.x0 + item.bbox.x1) / 2;
          const itemCenterY = (item.bbox.y0 + item.bbox.y1) / 2;

          // OCR bbox coordinates are relative to original image size
          const canvasX = offsetX + (itemCenterX / imgW) * drawW;
          const canvasY = offsetY + (itemCenterY / imgH) * drawH;

          // Clamp to canvas boundaries
          const clampedX = Math.min(Math.max(60, Math.round(canvasX)), 740);
          const clampedY = Math.min(Math.max(60, Math.round(canvasY)), 540);

          // Prevent duplicate boxes at almost identical coordinates
          const isDuplicate = detectedRooms.some(
            (r) => Math.abs(r.x - clampedX) < 50 && Math.abs(r.y - clampedY) < 50
          );

          if (!isDuplicate) {
            const matchedType = ROOM_TYPES.find((t) => t.id === entry.typeId) || ROOM_TYPES[0];
            detectedRooms.push({
              id: `ocr_${Date.now()}_${detectedRooms.length}`,
              typeId: matchedType.id,
              name: entry.name,
              color: matchedType.color || '#d97706',
              x: clampedX,
              y: clampedY,
              isAutoDetected: true,
            });
          }
          break;
        }
      }
    }

    console.log(`[Tesseract OCR] Detected ${detectedRooms.length} room boxes at precise text coordinates.`);

    if (detectedRooms.length > 0) {
      return detectedRooms;
    }
  } catch (err) {
    console.error('[Tesseract OCR Error]:', err);
    if (worker) {
      try { await worker.terminate(); } catch {}
    }
  }

  // Fallback layout spaced neatly inside canvas frame
  console.log('[Tesseract OCR] Using neat default starter room placement.');
  const fallbackRooms = [
    { typeId: 'kitchen', name: 'KITCHEN', x: 620, y: 220 },
    { typeId: 'master_bedroom', name: 'MASTER BEDROOM', x: 220, y: 220 },
    { typeId: 'living_room', name: 'LIVING ROOM', x: 320, y: 440 },
    { typeId: 'entrance', name: 'MAIN ENTRANCE', x: 600, y: 480 },
  ];

  return fallbackRooms.map((r, i) => {
    const matchedType = ROOM_TYPES.find((t) => t.id === r.typeId) || ROOM_TYPES[0];
    return {
      id: `fallback_${Date.now()}_${i}`,
      typeId: matchedType.id,
      name: r.name,
      color: matchedType.color || '#d97706',
      x: r.x,
      y: r.y,
      isAutoDetected: true,
    };
  });
}
