/**
 * Vastu Shastra Calculation Engine & Vedic Data Rules
 * Implements 16 MahaVastu Directional Zones, Vastu Purusha Mandala,
 * Devta Lords (Ashtadikpalaka), Lakshmi-Kuber Prosperity Index & Sacred Remedies.
 */

export const VASTU_ZONES_16 = [
  { id: 'N', name: 'North', degree: 0, minDeg: 348.75, maxDeg: 11.25, element: 'Water', color: '#2563eb', attribute: 'Money Flow & New Career Opportunities', lord: 'Lord Kuber (Wealth God)', mantra: 'Om Kuberaya Namah' },
  { id: 'NNE', name: 'North-North-East', degree: 22.5, minDeg: 11.25, maxDeg: 33.75, element: 'Water', color: '#0891b2', attribute: 'Health, Immunity & Healing Energy', lord: 'Dhanvantari (Divine Physician)', mantra: 'Om Dhanvantaraye Namah' },
  { id: 'NE', name: 'North-East (Ishanya)', degree: 45, minDeg: 33.75, maxDeg: 56.25, element: 'Water', color: '#0284c7', attribute: 'Vastu Purusha Head (Mind, Clarity & Divine Connection)', lord: 'Lord Shiva / Ishan Dev', mantra: 'Om Namah Shivaya' },
  { id: 'ENE', name: 'East-North-East', degree: 67.5, minDeg: 56.25, maxDeg: 78.75, element: 'Air', color: '#059669', attribute: 'Fun, Recreation, Joy & Contentment', lord: 'Indra Dev', mantra: 'Om Indraya Namah' },
  { id: 'E', name: 'East', degree: 90, minDeg: 78.75, maxDeg: 101.25, element: 'Air', color: '#16a34a', attribute: 'Social Connectivity, Government Support & Fame', lord: 'Surya Dev (Sun God)', mantra: 'Om Suryaya Namah' },
  { id: 'ESE', name: 'East-South-East', degree: 112.5, minDeg: 101.25, maxDeg: 123.75, element: 'Air', color: '#65a30d', attribute: 'Analytical Thinking, Churning & Anxiety', lord: 'Vayu Dev', mantra: 'Om Vayave Namah' },
  { id: 'SE', name: 'South-East (Agni)', degree: 135, minDeg: 123.75, maxDeg: 146.25, element: 'Fire', color: '#dc2626', attribute: 'Liquidity, Daily Cash Flow & Vitality', lord: 'Agni Dev (Fire God)', mantra: 'Om Agnaye Namah' },
  { id: 'SSE', name: 'South-South-East', degree: 157.5, minDeg: 146.25, maxDeg: 168.75, element: 'Fire', color: '#ea580c', attribute: 'Confidence, Strength & Zeal', lord: 'Mangal (Mars)', mantra: 'Om Angarakaya Namah' },
  { id: 'S', name: 'South', degree: 180, minDeg: 168.75, maxDeg: 191.25, element: 'Fire', color: '#b91c1c', attribute: 'Fame, Name, Sleep Quality & Peace', lord: 'Yama Dev', mantra: 'Om Yamaya Namah' },
  { id: 'SSW', name: 'South-South-West', degree: 202.5, minDeg: 191.25, maxDeg: 213.75, element: 'Earth', color: '#9333ea', attribute: 'Disposal, Waste & Expense Control', lord: 'Nirriti Dev', mantra: 'Om Nirritaye Namah' },
  { id: 'SW', name: 'South-West (Nairutya)', degree: 225, minDeg: 213.75, maxDeg: 236.25, element: 'Earth', color: '#b45309', attribute: 'Vastu Purusha Feet (Family Bonding, Skills & Stability)', lord: 'Pitru (Ancestral Blessings)', mantra: 'Om Pitrubhyo Namah' },
  { id: 'WSW', name: 'West-South-West', degree: 247.5, minDeg: 236.25, maxDeg: 258.75, element: 'Space', color: '#ca8a04', attribute: 'Savings, Fixed Assets & Children Study Focus', lord: 'Vishwakarma', mantra: 'Om Vishwakarmane Namah' },
  { id: 'W', name: 'West', degree: 270, minDeg: 258.75, maxDeg: 281.25, element: 'Space', color: '#4f46e5', attribute: 'Gains, Business Profits & Wish Fulfillment', lord: 'Varuna Dev (Water Lord)', mantra: 'Om Varunaya Namah' },
  { id: 'WNW', name: 'West-North-West', degree: 292.5, minDeg: 281.25, maxDeg: 303.75, element: 'Space', color: '#7c3aed', attribute: 'Detoxification, Emotional Release & Healing', lord: 'Rudra Dev', mantra: 'Om Rudraya Namah' },
  { id: 'NW', name: 'North-West (Vayavya)', degree: 315, minDeg: 303.75, maxDeg: 326.25, element: 'Space', color: '#db2777', attribute: 'Bank Credit, Loans, Support & Relationships', lord: 'Chandra / Vayu', mantra: 'Om Chandraya Namah' },
  { id: 'NNW', name: 'North-North-West', degree: 337.5, minDeg: 326.25, maxDeg: 348.75, element: 'Water', color: '#0284c7', attribute: 'Attraction, Marital Harmony & Joy', lord: 'Rati & Kama', mantra: 'Om Kamadevaya Namah' },
];

export const ROOM_TYPES = [
  { id: 'entrance', name: 'Main Door (Main Entrance)', category: 'entry', color: '#d97706' },
  { id: 'kitchen', name: 'Kitchen (Agni Kone)', category: 'fire', color: '#dc2626' },
  { id: 'master_bedroom', name: 'Master Bedroom (Owner)', category: 'living', color: '#b45309' },
  { id: 'puja_room', name: 'Puja / Prayer Room (Mandir)', category: 'spiritual', color: '#2563eb' },
  { id: 'toilet', name: 'Toilet / Bathroom', category: 'disposal', color: '#9333ea' },
  { id: 'living_room', name: 'Living / Dining Hall', category: 'living', color: '#16a34a' },
  { id: 'kids_bedroom', name: 'Children Bedroom', category: 'living', color: '#0891b2' },
  { id: 'staircase', name: 'Staircase (Heavy Load)', category: 'heavy', color: '#475569' },
  { id: 'overhead_tank', name: 'Overhead Water Tank', category: 'heavy_water', color: '#334155' },
  { id: 'underground_tank', name: 'Underground Water Tank / Sump', category: 'water', color: '#0284c7' },
  { id: 'store_room', name: 'Store Room', category: 'heavy', color: '#78350f' },
  { id: 'balcony', name: 'Balcony / Open Courtyard', category: 'open', color: '#ca8a04' },
  { id: 'brahmasthan', name: 'Brahmasthan (House Center)', category: 'center', color: '#eab308' },
];

const COMPATIBILITY_RULES = {
  entrance: {
    idealZones: ['N', 'E', 'NNE', 'ENE'],
    favorableZones: ['W', 'S', 'SSE', 'NW'],
    defectZones: ['ESE', 'WNW', 'SSW'],
    severeDoshaZones: ['NE', 'SW', 'SE'],
    descriptions: {
      ideal: 'Highly auspicious entrance! Invites Goddess Lakshmi, career growth, and positive prana.',
      favorable: 'Good entrance placement. Brings stability and social respect.',
      defect: 'Sub-optimal door placement. May cause minor financial leakage.',
      severeDosha: 'Critical Vastu Defect! Entrance in South-West or North-East creates heavy debt, relationship friction, or health issues.',
    },
    remedies: {
      severeDosha: 'Install a Brass / Copper threshold strip under door joint. Hang Panchmukhi Hanuman Ji idol or Brass Swastika outside front door.',
      defect: 'Keep entrance bright with warm yellow light and place a camphor diffuser near door.',
    }
  },
  kitchen: {
    idealZones: ['SE', 'SSE'],
    favorableZones: ['E', 'S', 'W'],
    defectZones: ['NW', 'ENE', 'WSW'],
    severeDoshaZones: ['NE', 'N', 'SW', 'SSW'],
    descriptions: {
      ideal: 'Perfect placement in Agni Kone (Fire Zone)! Ensures steady cash liquidity, good digestion & prosperity.',
      favorable: 'Acceptable kitchen location. Fire element is stable.',
      defect: 'Fire element misaligned. May cause stomach issues or unexpected bills.',
      severeDosha: 'Severe Agni Dosha! Kitchen in North-East destroys peace & clarity; in SW causes family conflicts.',
    },
    remedies: {
      severeDosha: 'Place a Green Baroda Marble slab beneath gas burner (if in NE/N) or Yellow Jaisalmer slab (if in SW).',
      defect: 'Keep a live money plant in green pot near kitchen window.',
    }
  },
  master_bedroom: {
    idealZones: ['SW'],
    favorableZones: ['S', 'W', 'SSW', 'WSW'],
    defectZones: ['NW', 'E', 'N'],
    severeDoshaZones: ['NE', 'SE', 'ESE'],
    descriptions: {
      ideal: 'Ideal Nairutya placement! Protects Vastu Purusha feet, bringing high stability, leadership authority & strong relationships.',
      favorable: 'Good bedroom placement for sound sleep.',
      defect: 'Unstable energy. May cause restless sleep.',
      severeDosha: 'Bedroom in SE causes marital arguments; in NE causes severe mental restlessness & headaches.',
    },
    remedies: {
      severeDosha: 'Always sleep with head pointing South or East. Keep Rose Quartz crystals near bed.',
      defect: 'Use warm ivory/beige bedsheets and avoid mirrors facing bed directly.',
    }
  },
  puja_room: {
    idealZones: ['NE', 'N', 'E', 'NNE'],
    favorableZones: ['ENE', 'W'],
    defectZones: ['NW', 'SE', 'S'],
    severeDoshaZones: ['SW', 'SSW', 'WNW'],
    descriptions: {
      ideal: 'Divine placement in Ishanya Kone (Vastu Purusha Head)! Brings immense spiritual grace, peace & intuition.',
      favorable: 'Favorable prayer area.',
      defect: 'Distracted spiritual energy.',
      severeDosha: 'Mandir in SW offends ancestral energy and creates financial blockages.',
    },
    remedies: {
      severeDosha: 'Relocate Mandir to North/East wall. Place Shree Yantra or Kuber Yantra on altar.',
      defect: 'Ensure idols face East or North during prayer.',
    }
  },
  toilet: {
    idealZones: ['SSW', 'WNW', 'ESE'],
    favorableZones: ['NW'],
    defectZones: ['S', 'W', 'E', 'N'],
    severeDoshaZones: ['NE', 'SW', 'SE'],
    descriptions: {
      ideal: 'Perfect placement in Disposal Zone! Safely flushes away negative energies.',
      favorable: 'Acceptable placement with basic containment.',
      defect: 'Disposal energy leaks into living area.',
      severeDosha: 'CRITICAL DOSHA! Toilet in NE completely destroys mental peace & health; in SW destroys family stability.',
    },
    remedies: {
      severeDosha: 'Install 4-sided Copper/Brass strip around commode base inside tile joint. Keep WC bowl closed & place sea salt bowl inside.',
      defect: 'Keep bathroom door closed and replace sea salt weekly.',
    }
  },
  living_room: {
    idealZones: ['N', 'E', 'NE', 'NW'],
    favorableZones: ['ENE', 'W', 'SE'],
    defectZones: ['SSW', 'WNW'],
    severeDoshaZones: ['SW'],
    descriptions: {
      ideal: 'Excellent living hall zone! Promotes warm social gatherings, networking, and welcoming guest vibes.',
      favorable: 'Good balance for entertainment.',
      defect: 'Living space feels underutilized.',
      severeDosha: 'Heavy furniture in SW should be reserved for Master Bedroom.',
    },
    remedies: {
      severeDosha: 'Keep North & East sides light and place heavy sofa sets against South & West walls.',
      defect: 'Hang a pleasant landscape painting on North/East wall.',
    }
  },
  kids_bedroom: {
    idealZones: ['WNW', 'NW', 'WSW', 'E'],
    favorableZones: ['N', 'NE', 'NNE'],
    defectZones: ['SE', 'SSW'],
    severeDoshaZones: ['SW'],
    descriptions: {
      ideal: 'Great study & sleep zone for kids! Enhances concentration, exam success, and academic focus.',
      favorable: 'Supports balanced studies.',
      defect: 'Child faces study distractions.',
      severeDosha: 'Kids sleeping in SW may develop stubborn behavior.',
    },
    remedies: {
      severeDosha: 'Place study desk facing East or North with a Saraswati crystal globe.',
      defect: 'Paint room in pastel green or light blue.',
    }
  },
  staircase: {
    idealZones: ['S', 'SW', 'W', 'NW'],
    favorableZones: ['SE', 'SSW'],
    defectZones: ['N', 'E'],
    severeDoshaZones: ['NE', 'BRAHMASTHAN'],
    descriptions: {
      ideal: 'Ideal heavy load placement! Solidifies house foundation & grounds heavy energy.',
      favorable: 'Acceptable staircase alignment.',
      defect: 'Heaviness in North/East blocks incoming opportunities.',
      severeDosha: 'CRITICAL DOSHA! Staircase in NE or Brahmasthan crushes the home\'s heart chakra.',
    },
    remedies: {
      severeDosha: 'Hang a convex Vastu mirror facing staircase top and place 3 brass pyramids under lowest step.',
      defect: 'Ensure staircase turns clockwise when going up.',
    }
  },
  brahmasthan: {
    idealZones: ['BRAHMASTHAN'],
    favorableZones: ['BRAHMASTHAN'],
    defectZones: ['N', 'E'],
    severeDoshaZones: ['S', 'SW'],
    descriptions: {
      ideal: 'Brahmasthan (House Center) is open and light! Ensures divine energy distribution.',
      favorable: 'Well balanced central space.',
      defect: 'Minor clutter in center.',
      severeDosha: 'Pillar or heavy toilet in center suffocates house prana.',
    },
    remedies: {
      severeDosha: 'Keep central 1/9th grid completely open and clean. Place a clear quartz crystal lotus at house center.',
      defect: 'Keep central floor light and well lit.',
    }
  }
};

export function calculateRoomZone(roomX, roomY, centerX, centerY, northAngle = 0) {
  const dx = roomX - centerX;
  const dy = roomY - centerY;

  let rawRad = Math.atan2(dy, dx);
  let rawDeg = (rawRad * 180) / Math.PI;

  let bearing = rawDeg + 90;
  if (bearing < 0) bearing += 360;

  let adjustedBearing = (bearing - northAngle + 360) % 360;

  for (const zone of VASTU_ZONES_16) {
    if (zone.id === 'N') {
      if (adjustedBearing >= 348.75 || adjustedBearing < 11.25) return zone;
    } else {
      if (adjustedBearing >= zone.minDeg && adjustedBearing < zone.maxDeg) return zone;
    }
  }
  return VASTU_ZONES_16[0];
}

export function evaluateVastu(placedRooms, northAngle, centerX, centerY) {
  if (!placedRooms || placedRooms.length === 0) {
    return {
      score: 0,
      rating: 'No Rooms Tagged',
      elementScores: { Water: 50, Air: 50, Fire: 50, Earth: 50, Space: 50 },
      roomResults: [],
      topStrengths: [],
      criticalDoshas: [],
      vedicInsights: {},
      summaryText: 'Please load a floor plan image or select a sample to generate your report.'
    };
  }

  let totalScoreWeight = 0;
  let accumulatedScore = 0;

  const elementCounts = {
    Water: { total: 0, favorable: 0 },
    Air: { total: 0, favorable: 0 },
    Fire: { total: 0, favorable: 0 },
    Earth: { total: 0, favorable: 0 },
    Space: { total: 0, favorable: 0 }
  };

  const roomResults = placedRooms.map((room) => {
    const isCenter = room.typeId === 'brahmasthan' || (Math.abs(room.x - centerX) < 30 && Math.abs(room.y - centerY) < 30);
    const assignedZone = isCenter
      ? { id: 'BRAHMASTHAN', name: 'Brahmasthan (Center)', element: 'Space', color: '#eab308', lord: 'Lord Brahma (Creator)', attribute: 'Vastu Purusha Heart & Lungs' }
      : calculateRoomZone(room.x, room.y, centerX, centerY, northAngle);

    const roomTypeInfo = ROOM_TYPES.find((r) => r.id === room.typeId) || { name: room.name || 'Room' };
    const rule = COMPATIBILITY_RULES[room.typeId] || COMPATIBILITY_RULES.living_room;

    let rating = 'neutral';
    let numericScore = 65;
    let description = 'Acceptable placement.';
    let remedy = 'Keep area clean and lit.';

    if (assignedZone.id === 'BRAHMASTHAN') {
      if (['brahmasthan', 'balcony', 'living_room'].includes(room.typeId)) {
        rating = 'ideal';
        numericScore = 100;
        description = rule.descriptions.ideal;
        remedy = 'Auspicious open center!';
      } else {
        rating = 'severeDosha';
        numericScore = 20;
        description = 'Critical Brahmasthan Defect! Heavy load in center chokes house vitality.';
        remedy = rule.remedies.severeDosha || 'Keep center 1/9th grid light and clean.';
      }
    } else {
      if (rule.idealZones.includes(assignedZone.id)) {
        rating = 'ideal';
        numericScore = 95;
        description = rule.descriptions.ideal;
        remedy = 'Auspicious alignment! No structural remedy needed.';
      } else if (rule.favorableZones.includes(assignedZone.id)) {
        rating = 'favorable';
        numericScore = 80;
        description = rule.descriptions.favorable;
        remedy = rule.remedies.defect || 'Enhance with light neutral colors.';
      } else if (rule.defectZones.includes(assignedZone.id)) {
        rating = 'defect';
        numericScore = 50;
        description = rule.descriptions.defect;
        remedy = rule.remedies.defect || 'Use metal strips or crystals to balance energy.';
      } else if (rule.severeDoshaZones.includes(assignedZone.id)) {
        rating = 'severeDosha';
        numericScore = 25;
        description = rule.descriptions.severeDosha;
        remedy = rule.remedies.severeDosha || 'Place Vastu Pyramids & element balancing strips.';
      }
    }

    let weight = 1;
    if (['entrance', 'kitchen', 'master_bedroom', 'toilet', 'puja_room'].includes(room.typeId)) weight = 2;

    totalScoreWeight += weight;
    accumulatedScore += numericScore * weight;

    const el = assignedZone.element || 'Space';
    if (elementCounts[el]) {
      elementCounts[el].total += 1;
      if (['ideal', 'favorable'].includes(rating)) elementCounts[el].favorable += 1;
    }

    return {
      id: room.id,
      name: room.name || roomTypeInfo.name,
      typeId: room.typeId,
      zone: assignedZone,
      rating,
      score: numericScore,
      description,
      remedy,
      x: room.x,
      y: room.y,
    };
  });

  const finalScore = Math.round(accumulatedScore / Math.max(1, totalScoreWeight));

  let ratingLabel = 'Harmonious Vastu';
  if (finalScore < 50) ratingLabel = 'Severe Vastu Imbalance';
  else if (finalScore < 70) ratingLabel = 'Moderate Vastu Dosha';
  else if (finalScore < 85) ratingLabel = 'Good Energy Balance';

  const elementScores = {};
  Object.keys(elementCounts).forEach((key) => {
    const { total, favorable } = elementCounts[key];
    elementScores[key] = total === 0 ? 75 : Math.round((favorable / total) * 100);
  });

  // Calculate Indian / Vedic Cultural Insights
  const northZoneRoom = roomResults.find((r) => r.zone.id === 'N' || r.zone.id === 'NE');
  const kitchenRoom = roomResults.find((r) => r.typeId === 'kitchen');
  const entranceRoom = roomResults.find((r) => r.typeId === 'entrance');

  const vedicInsights = {
    purushaStatus: 'Vastu Purusha Head (North-East) & Feet (South-West) are balanced.',
    financialLakshmiRating: kitchenRoom?.rating === 'ideal' ? 'High Cash Liquidity (Agni Kone Auspicious)' : 'Moderate Liquidity (Remedies Recommended)',
    recommendedYantras: [
      { name: 'Shree Yantra', direction: 'North-East (Ishanya)', benefit: 'Invites Goddess Lakshmi, divine peace & mental clarity.' },
      { name: 'Kuber Yantra', direction: 'North Wall', benefit: 'Enhances continuous cash flow, career growth & business wealth.' },
      { name: 'Brass Swastika / Panchmukhi Hanuman', direction: 'Main Entrance Door', benefit: 'Blocks evil eye (Nazar), negativity & financial obstacles.' },
    ],
    dailyHouseholdRituals: [
      '🔥 Light a Camphor (Kapoor) lamp or diffuser in the evening near living room center to burn negative prana.',
      '🪔 Light a Ghee Diya in North-East (Puja area) during morning sunrise for health & family harmony.',
      '🌿 Keep a live Tulsi (Holy Basil) plant in East or North-East balcony window.',
      '💧 Keep a small brass vessel filled with fresh water in North-East (change daily).'
    ]
  };

  const topStrengths = roomResults.filter((r) => r.rating === 'ideal' || r.rating === 'favorable');
  const criticalDoshas = roomResults.filter((r) => r.rating === 'severeDosha' || r.rating === 'defect');

  return {
    score: finalScore,
    rating: ratingLabel,
    elementScores,
    roomResults,
    topStrengths,
    criticalDoshas,
    vedicInsights,
    summaryText: `Your property scores ${finalScore}/100 in Vastu Alignment. Detected ${topStrengths.length} auspicious placements and ${criticalDoshas.length} areas with remedial solutions.`
  };
}

export const SAMPLE_FLOORPLANS = [
  {
    id: 'sample_2bhk',
    name: 'Modern 2BHK City Flat',
    description: 'Standard 2 Bedroom, Kitchen, Living, 2 Balconies & Bathrooms',
    svg: `<svg viewBox="0 0 800 600" width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" stroke-width="0.5" opacity="0.6"/>
        </pattern>
      </defs>
      <rect width="800" height="600" fill="#f8fafc"/>
      <rect width="800" height="600" fill="url(#gridPattern)"/>
      <rect x="100" y="80" width="600" height="440" fill="#ffffff" stroke="#475569" stroke-width="8" rx="6"/>
      <rect x="110" y="90" width="260" height="200" fill="#f1f5f9" stroke="#cbd5e1"/>
      <text x="240" y="180" fill="#334155" font-family="sans-serif" font-size="16" font-weight="600" text-anchor="middle">Master Bedroom</text>
      <rect x="440" y="90" width="250" height="200" fill="#f1f5f9" stroke="#cbd5e1"/>
      <text x="565" y="180" fill="#334155" font-family="sans-serif" font-size="16" font-weight="600" text-anchor="middle">Kids Bedroom</text>
      <rect x="460" y="340" width="230" height="170" fill="#fef2f2" stroke="#fca5a5"/>
      <text x="575" y="420" fill="#dc2626" font-family="sans-serif" font-size="16" font-weight="600" text-anchor="middle">Kitchen</text>
      <rect x="110" y="310" width="330" height="200" fill="#f0fdf4" stroke="#86efac"/>
      <text x="275" y="400" fill="#16a34a" font-family="sans-serif" font-size="18" font-weight="700" text-anchor="middle">Living &amp; Dining Hall</text>
      <circle cx="400" cy="300" r="40" fill="#fef3c7" stroke="#d97706" stroke-dasharray="4,4" stroke-width="2"/>
      <text x="400" y="305" fill="#b45309" font-family="sans-serif" font-size="11" text-anchor="middle" font-weight="bold">BRAHMASTHAN</text>
      <line x1="370" y1="90" x2="370" y2="290" stroke="#94a3b8" stroke-width="4"/>
      <line x1="440" y1="90" x2="440" y2="290" stroke="#94a3b8" stroke-width="4"/>
      <line x1="110" y1="290" x2="690" y2="290" stroke="#94a3b8" stroke-width="4"/>
      <line x1="450" y1="290" x2="450" y2="510" stroke="#94a3b8" stroke-width="4"/>
      <rect x="370" y="90" width="70" height="120" fill="#faf5ff" stroke="#d8b4fe"/>
      <text x="405" y="150" fill="#9333ea" font-family="sans-serif" font-size="11" text-anchor="middle">Toilet</text>
      <path d="M 280 520 L 330 520 A 50 50 0 0 0 280 470 Z" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <line x1="280" y1="520" x2="340" y2="520" stroke="#d97706" stroke-width="4"/>
      <text x="310" y="550" fill="#b45309" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">MAIN ENTRANCE</text>
      <rect x="445" y="295" width="50" height="40" fill="#eff6ff" stroke="#93c5fd" rx="4"/>
      <text x="470" y="320" fill="#2563eb" font-family="sans-serif" font-size="10" text-anchor="middle">Puja Room</text>
    </svg>`,
    defaultRooms: [
      { id: '1', typeId: 'master_bedroom', name: 'Master Bedroom', x: 240, y: 190 },
      { id: '2', typeId: 'kids_bedroom', name: 'Kids Bedroom', x: 565, y: 190 },
      { id: '3', typeId: 'kitchen', name: 'Kitchen (Agni)', x: 575, y: 420 },
      { id: '4', typeId: 'living_room', name: 'Living Room', x: 275, y: 400 },
      { id: '5', typeId: 'entrance', name: 'Main Door', x: 310, y: 510 },
      { id: '6', typeId: 'toilet', name: 'Toilet', x: 405, y: 150 },
      { id: '7', typeId: 'puja_room', name: 'Puja Room', x: 470, y: 315 },
      { id: '8', typeId: 'brahmasthan', name: 'Brahmasthan', x: 400, y: 300 },
    ]
  },
  {
    id: 'sample_villa',
    name: 'Luxury 3BHK Villa Plan',
    description: 'Spacious Villa with Central Courtyard & Corner Kitchen',
    svg: `<svg viewBox="0 0 800 600" width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#f8fafc"/>
      <rect x="80" y="60" width="640" height="480" fill="#ffffff" stroke="#2563eb" stroke-width="6" rx="8"/>
      <rect x="320" y="220" width="160" height="160" fill="#fef3c7" stroke="#d97706" stroke-dasharray="6,6" stroke-width="2"/>
      <text x="400" y="300" fill="#b45309" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">OPEN COURTYARD</text>
      <rect x="90" y="330" width="220" height="200" fill="#f1f5f9"/>
      <text x="200" y="430" fill="#334155" font-family="sans-serif" font-size="16" font-weight="600" text-anchor="middle">Master Suite</text>
      <rect x="490" y="330" width="220" height="200" fill="#fef2f2"/>
      <text x="600" y="430" fill="#dc2626" font-family="sans-serif" font-size="16" font-weight="600" text-anchor="middle">Kitchen</text>
      <rect x="90" y="70" width="220" height="200" fill="#f0fdf4"/>
      <text x="200" y="170" fill="#16a34a" font-family="sans-serif" font-size="16" font-weight="600" text-anchor="middle">Guest Bedroom</text>
      <rect x="490" y="70" width="220" height="200" fill="#eff6ff"/>
      <text x="600" y="150" fill="#2563eb" font-family="sans-serif" font-size="16" font-weight="600" text-anchor="middle">Puja Hall</text>
      <circle cx="400" cy="540" r="25" fill="#fef3c7"/>
      <text x="400" y="575" fill="#d97706" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">MAIN ENTRANCE</text>
    </svg>`,
    defaultRooms: [
      { id: '1', typeId: 'master_bedroom', name: 'Master Suite', x: 200, y: 430 },
      { id: '2', typeId: 'kitchen', name: 'Kitchen', x: 600, y: 430 },
      { id: '3', typeId: 'kids_bedroom', name: 'Guest Bedroom', x: 200, y: 170 },
      { id: '4', typeId: 'puja_room', name: 'Puja Hall', x: 600, y: 150 },
      { id: '5', typeId: 'entrance', name: 'Villa Entrance', x: 400, y: 535 },
      { id: '6', typeId: 'brahmasthan', name: 'Courtyard Center', x: 400, y: 300 },
    ]
  }
];
