module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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

    // ----------------------------------------------------
    // PRIORITY 1: GOOGLE CLOUD VISION API (If Billing Enabled)
    // ----------------------------------------------------
    const googleCloudKey = process.env.GOOGLE_CLOUD_VISION_KEY || 'AIzaSyCkRZnrGsx1WP6oUoOCN4dFdUrBLsj4njE';
    if (googleCloudKey) {
      try {
        const gcRes = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${googleCloudKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [{
              image: { content: imageBase64 },
              features: [{ type: 'TEXT_DETECTION' }]
            }]
          })
        });

        if (gcRes.ok) {
          const gcData = await gcRes.json();
          const textAnnotations = gcData?.responses?.[0]?.textAnnotations;
          if (Array.isArray(textAnnotations) && textAnnotations.length > 1) {
            console.log('[Cloud Vision] Success! Found', textAnnotations.length, 'text elements.');
            // Skip index 0 (full page text) and map individual words
            const words = textAnnotations.slice(1).map(w => {
              const vertices = w.boundingPoly?.vertices || [];
              const xs = vertices.map(v => v.x || 0);
              const ys = vertices.map(v => v.y || 0);
              const minX = Math.min(...xs);
              const maxX = Math.max(...xs);
              const minY = Math.min(...ys);
              const maxY = Math.max(...ys);
              return {
                word: w.description || '',
                left: minX,
                top: minY,
                width: maxX - minX,
                height: maxY - minY
              };
            });

            const parsedRooms = mapOcrWordsToRooms(words, 1000, 1000);
            if (parsedRooms.length > 0) {
              return res.status(200).json({ success: true, text: JSON.stringify(parsedRooms), model: 'Google Cloud Vision API' });
            }
          }
        }
      } catch (e) {
        console.warn('[Cloud Vision API Warning]:', e.message);
      }
    }

    // ----------------------------------------------------
    // PRIORITY 2: HIGH-PRECISION OCR.SPACE ENGINE (Zero Billing Required)
    // ----------------------------------------------------
    console.log('[OCR.space] Scanning floor plan bounding boxes...');
    const formData = new URLSearchParams();
    formData.append('apikey', 'helloworld');
    formData.append('base64Image', dataUrl);
    formData.append('isOverlayRequired', 'true');
    formData.append('OCREngine', '2');

    const ocrRes = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });

    if (ocrRes.ok) {
      const ocrData = await ocrRes.json();
      const lines = ocrData?.ParsedResults?.[0]?.TextOverlay?.Lines || [];
      const allWords = [];

      for (const line of lines) {
        if (Array.isArray(line.Words)) {
          for (const w of line.Words) {
            allWords.push({
              word: w.WordText || '',
              left: parseFloat(w.Left) || 0,
              top: parseFloat(w.Top) || 0,
              width: parseFloat(w.Width) || 0,
              height: parseFloat(w.Height) || 0
            });
          }
        }
      }

      console.log('[OCR.space] Extracted', allWords.length, 'words.');
      const parsedRooms = mapOcrWordsToRooms(allWords, 1000, 1000);
      if (parsedRooms.length > 0) {
        return res.status(200).json({ success: true, text: JSON.stringify(parsedRooms), model: 'OCR.space Engine' });
      }
    }

    return res.status(200).json({ success: false, reason: 'no_text_found' });
  } catch (error) {
    console.error('[scan] Server error:', error);
    return res.status(500).json({ error: { message: error.message } });
  }
};

/**
 * Maps raw OCR words with bounding box coordinates (left, top, width, height) to room boxes
 */
function mapOcrWordsToRooms(words, approxW = 1000, approxH = 1000) {
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
    { keywords: ['STAIRS', 'STAIRCASE', 'STAIR'], typeId: 'staircase', name: 'STAIRCASE' }
  ];

  // Estimate maximum bounds to calculate relative xPct (0-100) and yPct (0-100)
  const maxRight = Math.max(...words.map(w => w.left + w.width), approxW);
  const maxBottom = Math.max(...words.map(w => w.top + w.height), approxH);

  const rooms = [];

  for (const w of words) {
    const cleanWord = (w.word || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!cleanWord || cleanWord.includes('FLOORPLAN') || cleanWord.length < 2) continue;

    for (const entry of keywordMap) {
      const matches = entry.keywords.some(kw => cleanWord.includes(kw) || kw.includes(cleanWord));
      if (matches) {
        const centerX = w.left + w.width / 2;
        const centerY = w.top + w.height / 2;

        const xPct = Math.min(Math.max(Math.round((centerX / maxRight) * 100), 5), 95);
        const yPct = Math.min(Math.max(Math.round((centerY / maxBottom) * 100), 5), 95);

        // Deduplicate close matches
        const isDuplicate = rooms.some(r => Math.abs(r.xPct - xPct) < 8 && Math.abs(r.yPct - yPct) < 8);
        if (!isDuplicate) {
          rooms.push({
            typeId: entry.typeId,
            name: entry.name,
            xPct,
            yPct
          });
        }
        break;
      }
    }
  }

  return rooms;
}
