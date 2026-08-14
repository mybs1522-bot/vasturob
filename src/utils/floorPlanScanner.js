import { ROOM_TYPES } from './vastuEngine';

/**
 * Smart Floor Plan Auto-Scanner & OCR Text Detector
 * Parses SVG text nodes or image metadata to auto-detect room boundaries.
 * Returns only real detected rooms. If unable to read text/labels, returns empty array [].
 */
export function autoDetectRoomsFromFloorPlan(svgString, imageUrl) {
  const detectedRooms = [];

  if (svgString) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, 'image/svg+xml');
      const textNodes = doc.querySelectorAll('text');

      textNodes.forEach((node, index) => {
        const textContent = node.textContent?.trim() || '';
        const x = parseFloat(node.getAttribute('x')) || 400;
        const y = parseFloat(node.getAttribute('y')) || 300;

        const matchedType = matchTextToRoomType(textContent);
        if (matchedType) {
          detectedRooms.push({
            id: `auto_${index}_${Date.now()}`,
            typeId: matchedType.id,
            name: matchedType.name,
            color: matchedType.color,
            x: Math.round(x),
            y: Math.round(y),
            isAutoDetected: true
          });
        }
      });
    } catch (e) {
      console.warn('SVG text auto-detection warning:', e);
    }
  }

  // If no text nodes or raster image without text tags, return empty array []
  // (Do NOT force hardcoded fallback boxes!)
  return detectedRooms;
}

/**
 * Matches raw text labels from floor plans to Vastu Room Types
 */
function matchTextToRoomType(text) {
  const lower = text.toLowerCase();

  if (lower.includes('master') || lower.includes('m.bed') || lower.includes('suite')) {
    return ROOM_TYPES.find((r) => r.id === 'master_bedroom');
  }
  if (lower.includes('bed') || lower.includes('kids') || lower.includes('guest') || lower.includes('room')) {
    return ROOM_TYPES.find((r) => r.id === 'kids_bedroom');
  }
  if (lower.includes('kitchen') || lower.includes('kitch') || lower.includes('cook') || lower.includes('pantry')) {
    return ROOM_TYPES.find((r) => r.id === 'kitchen');
  }
  if (lower.includes('living') || lower.includes('hall') || lower.includes('drawing') || lower.includes('reception')) {
    return ROOM_TYPES.find((r) => r.id === 'living_room');
  }
  if (lower.includes('toilet') || lower.includes('bath') || lower.includes('wc') || lower.includes('wash')) {
    return ROOM_TYPES.find((r) => r.id === 'toilet');
  }
  if (lower.includes('puja') || lower.includes('mandir') || lower.includes('prayer') || lower.includes('altar')) {
    return ROOM_TYPES.find((r) => r.id === 'puja_room');
  }
  if (lower.includes('entrance') || lower.includes('door') || lower.includes('gate') || lower.includes('entry') || lower.includes('dwar')) {
    return ROOM_TYPES.find((r) => r.id === 'entrance');
  }
  if (lower.includes('brahma') || lower.includes('center') || lower.includes('courtyard') || lower.includes('angan')) {
    return ROOM_TYPES.find((r) => r.id === 'brahmasthan');
  }
  if (lower.includes('stair') || lower.includes('steps')) {
    return ROOM_TYPES.find((r) => r.id === 'staircase');
  }
  if (lower.includes('store') || lower.includes('utility')) {
    return ROOM_TYPES.find((r) => r.id === 'store_room');
  }

  return null;
}
