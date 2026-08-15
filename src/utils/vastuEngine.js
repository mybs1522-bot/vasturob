/**
 * Vastu Shastra Calculation Engine & Vedic Data Rules
 * Implements 16 MahaVastu Directional Zones, Vastu Purusha Mandala,
 * Devta Lords (Ashtadikpalaka), Lakshmi-Kuber Prosperity Index & Sacred Remedies.
 * Bilingual (English & Hindi) Supported.
 */

export const VASTU_ZONES_16 = [
  { id: 'N', name: 'North', name_hi: 'उत्तर', degree: 0, minDeg: 348.75, maxDeg: 11.25, element: 'Water', color: '#2563eb', attribute: 'Money Flow & New Career Opportunities', attribute_hi: 'धन का निरंतर प्रवाह व नए करियर अवसर', lord: 'Lord Kuber (Wealth God)', lord_hi: 'भगवान कुबेर (धन के देवता)', mantra: 'Om Kuberaya Namah' },
  { id: 'NNE', name: 'North-North-East', name_hi: 'उत्तर-उत्तर-पूर्व', degree: 22.5, minDeg: 11.25, maxDeg: 33.75, element: 'Water', color: '#0891b2', attribute: 'Health, Immunity & Healing Energy', attribute_hi: 'स्वास्थ्य, रोग प्रतिरोधक क्षमता व आरोग्य', lord: 'Dhanvantari (Divine Physician)', lord_hi: 'भगवान धन्वंतरि (दिव्य चिकित्सक)', mantra: 'Om Dhanvantaraye Namah' },
  { id: 'NE', name: 'North-East (Ishanya)', name_hi: 'ईशान कोण', degree: 45, minDeg: 33.75, maxDeg: 56.25, element: 'Water', color: '#0284c7', attribute: 'Vastu Purusha Head (Mind, Clarity & Divine Connection)', attribute_hi: 'वास्तु पुरुष का मस्तक (मानसिक स्पष्टता व ईश्वरीय कृपा)', lord: 'Lord Shiva / Ishan Dev', lord_hi: 'भगवान शिव / ईशान देव', mantra: 'Om Namah Shivaya' },
  { id: 'ENE', name: 'East-North-East', name_hi: 'पूर्व-उत्तर-पूर्व', degree: 67.5, minDeg: 56.25, maxDeg: 78.75, element: 'Air', color: '#059669', attribute: 'Fun, Recreation, Joy & Contentment', attribute_hi: 'आनंद, मनोरंजन, उल्लास व संतुष्टि', lord: 'Indra Dev', lord_hi: 'इंद्र देव', mantra: 'Om Indraya Namah' },
  { id: 'E', name: 'East', name_hi: 'पूर्व', degree: 90, minDeg: 78.75, maxDeg: 101.25, element: 'Air', color: '#16a34a', attribute: 'Social Connectivity, Government Support & Fame', attribute_hi: 'सामाजिक संबंध, सरकारी सहयोग व प्रतिष्ठा', lord: 'Surya Dev (Sun God)', lord_hi: 'भगवान सूर्य देव', mantra: 'Om Suryaya Namah' },
  { id: 'ESE', name: 'East-South-East', name_hi: 'पूर्व-दक्षिण-पूर्व', degree: 112.5, minDeg: 101.25, maxDeg: 123.75, element: 'Air', color: '#65a30d', attribute: 'Analytical Thinking, Churning & Anxiety', attribute_hi: 'मंथन, गहन चिंतन व अनावश्यक चिंता', lord: 'Vayu Dev', lord_hi: 'वायु देव', mantra: 'Om Vayave Namah' },
  { id: 'SE', name: 'South-East (Agni)', name_hi: 'आग्नेय कोण', degree: 135, minDeg: 123.75, maxDeg: 146.25, element: 'Fire', color: '#dc2626', attribute: 'Liquidity, Daily Cash Flow & Vitality', attribute_hi: 'दैनिक नकदी प्रवाह, ऊर्जा व उत्साह', lord: 'Agni Dev (Fire God)', lord_hi: 'अग्नि देव', mantra: 'Om Agnaye Namah' },
  { id: 'SSE', name: 'South-South-East', name_hi: 'दक्षिण-दक्षिण-पूर्व', degree: 157.5, minDeg: 146.25, maxDeg: 168.75, element: 'Fire', color: '#ea580c', attribute: 'Confidence, Strength & Zeal', attribute_hi: 'आत्मविश्वास, शारीरिक बल व सुरक्षा', lord: 'Mangal (Mars)', lord_hi: 'मंगल देव', mantra: 'Om Angarakaya Namah' },
  { id: 'S', name: 'South', name_hi: 'दक्षिण', degree: 180, minDeg: 168.75, maxDeg: 191.25, element: 'Fire', color: '#b91c1c', attribute: 'Fame, Name, Sleep Quality & Peace', lord: 'Yama Dev', attribute_hi: 'यश, मान-सम्मान व गहरी शांतिपूर्ण नींद', lord_hi: 'यम देव', mantra: 'Om Yamaya Namah' },
  { id: 'SSW', name: 'South-South-West', name_hi: 'दक्षिण-दक्षिण-पश्चिम', degree: 202.5, minDeg: 191.25, maxDeg: 213.75, element: 'Earth', color: '#9333ea', attribute: 'Disposal, Waste & Expense Control', attribute_hi: 'विसर्जन, व्यर्थ खर्चे व अपशिष्ट नियंत्रण', lord: 'Nirriti Dev', lord_hi: 'निर्ऋति देव', mantra: 'Om Nirritaye Namah' },
  { id: 'SW', name: 'South-West (Nairutya)', name_hi: 'नैऋत्य कोण', degree: 225, minDeg: 213.75, maxDeg: 236.25, element: 'Earth', color: '#b45309', attribute: 'Vastu Purusha Feet (Family Bonding, Skills & Stability)', attribute_hi: 'वास्तु पुरुष के चरण (पारिवारिक स्थिरता, रिश्ते व कौशल)', lord: 'Pitru (Ancestral Blessings)', lord_hi: 'पितृ देव (पूर्वजों का आशीर्वाद)', mantra: 'Om Pitrubhyo Namah' },
  { id: 'WSW', name: 'West-South-West', name_hi: 'पश्चिम-दक्षिण-पश्चिम', degree: 247.5, minDeg: 236.25, maxDeg: 258.75, element: 'Space', color: '#ca8a04', attribute: 'Savings, Fixed Assets & Children Study Focus', attribute_hi: 'बचत, स्थाई संपत्ति व बच्चों की एकाग्रता', lord: 'Vishwakarma', lord_hi: 'भगवान विश्वकर्मा', mantra: 'Om Vishwakarmane Namah' },
  { id: 'W', name: 'West', name_hi: 'पश्चिम', degree: 270, minDeg: 258.75, maxDeg: 281.25, element: 'Space', color: '#4f46e5', attribute: 'Gains, Business Profits & Wish Fulfillment', attribute_hi: 'व्यापार में लाभ, मनोकामना पूर्ति व सफलता', lord: 'Varuna Dev (Water Lord)', lord_hi: 'वरुण देव', mantra: 'Om Varunaya Namah' },
  { id: 'WNW', name: 'West-North-West', name_hi: 'पश्चिम-उत्तर-पश्चिम', degree: 292.5, minDeg: 281.25, maxDeg: 303.75, element: 'Space', color: '#7c3aed', attribute: 'Detoxification, Emotional Release & Healing', attribute_hi: 'मानसिक तनाव मुक्ति, भावनात्मक संतुलन व विषाक्तता निवारण', lord: 'Rudra Dev', lord_hi: 'रुद्र देव', mantra: 'Om Rudraya Namah' },
  { id: 'NW', name: 'North-West (Vayavya)', name_hi: 'वायव्य कोण', degree: 315, minDeg: 303.75, maxDeg: 326.25, element: 'Space', color: '#db2777', attribute: 'Bank Credit, Loans, Support & Relationships', attribute_hi: 'बैंक लोन, बाहरी सहयोग, रिश्ते व सहायता', lord: 'Chandra / Vayu', lord_hi: 'चंद्र / वायु देव', mantra: 'Om Chandraya Namah' },
  { id: 'NNW', name: 'North-North-West', name_hi: 'उत्तर-उत्तर-पश्चिम', degree: 337.5, minDeg: 326.25, maxDeg: 348.75, element: 'Water', color: '#0284c7', attribute: 'Attraction, Marital Harmony & Joy', attribute_hi: 'आकर्षण, वैवाहिक मधुरता व दांपत्य सुख', lord: 'Rati & Kama', lord_hi: 'रति एवं कामदेव', mantra: 'Om Kamadevaya Namah' },
];

export const ROOM_TYPES = [
  { id: 'entrance', name: 'Main Door (Main Entrance)', name_hi: 'मुख्य द्वार (प्रवेश द्वार)', category: 'entry', color: '#d97706' },
  { id: 'kitchen', name: 'Kitchen (Agni Kone)', name_hi: 'रसोईघर (आग्नेय कोण)', category: 'fire', color: '#dc2626' },
  { id: 'master_bedroom', name: 'Master Bedroom (Owner)', name_hi: 'मास्टर बेडरूम (मुखिया का कमरा)', category: 'living', color: '#b45309' },
  { id: 'puja_room', name: 'Puja / Prayer Room (Mandir)', name_hi: 'पूजा घर / मंदिर (ईशान कोण)', category: 'spiritual', color: '#2563eb' },
  { id: 'toilet', name: 'Toilet / Bathroom', name_hi: 'शौचालय / बाथरूम', category: 'disposal', color: '#9333ea' },
  { id: 'living_room', name: 'Living / Dining Hall', name_hi: 'लिविंग रूम / डाइनिंग हॉल', category: 'living', color: '#16a34a' },
  { id: 'kids_bedroom', name: 'Children Bedroom', name_hi: 'बच्चों का शयनकक्ष', category: 'living', color: '#0891b2' },
  { id: 'staircase', name: 'Staircase (Heavy Load)', name_hi: 'सीढ़ियां (भारी निर्माण)', category: 'heavy', color: '#475569' },
  { id: 'overhead_tank', name: 'Overhead Water Tank', name_hi: 'छत की पानी की टंकी', category: 'heavy_water', color: '#334155' },
  { id: 'underground_tank', name: 'Underground Water Tank / Sump', name_hi: 'भूमिगत पानी का टैंक', category: 'water', color: '#0284c7' },
  { id: 'store_room', name: 'Store Room', name_hi: 'स्टोर रूम', category: 'heavy', color: '#78350f' },
  { id: 'balcony', name: 'Balcony / Open Courtyard', name_hi: 'बालकनी / खुला आंगन', category: 'open', color: '#ca8a04' },
  { id: 'brahmasthan', name: 'Brahmasthan (House Center)', name_hi: 'ब्रह्मस्थान (घर का केंद्र)', category: 'center', color: '#eab308' },
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
    descriptions_hi: {
      ideal: 'अत्यंत शुभ मुख्य द्वार! मां लक्ष्मी की कृपा, करियर में वृद्धि और सकारात्मक ऊर्जा को आमंत्रित करता है।',
      favorable: 'शुभ प्रवेश द्वार। घर में स्थिरता और सामाजिक मान-सम्मान लाता है।',
      defect: 'असंतुलित प्रवेश द्वार। इससे धन का थोड़ा व्यर्थ व्यय हो सकता है।',
      severeDosha: 'गंभीर वास्तु दोष! दक्षिण-पश्चिम (SW) या दक्षिण-पूर्व (SE) में मुख्य द्वार भारी कर्ज और पारिवारिक कलह पैदा करता है।',
    },
    remedies: {
      severeDosha: 'Install a Brass / Copper threshold strip under door joint. Hang Panchmukhi Hanuman Ji idol or Brass Swastika outside front door.',
      defect: 'Keep entrance bright with warm yellow light and place a camphor diffuser near door.',
    },
    remedies_hi: {
      severeDosha: 'चौखट के नीचे पीतल या तांबे की 3-इंच की धातु पट्टी लगाएं। मुख्य द्वार के बाहर पंचमुखी हनुमान जी या पीतल का स्वास्तिक लगाएं।',
      defect: 'प्रवेश द्वार पर तेज पीली रोशनी रखें और दरवाजे के पास कपूर दानी जलाएं।',
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
    descriptions_hi: {
      ideal: 'आग्नेय कोण (अग्नि तत्व) में श्रेष्ठ रसोईघर! यह निरंतर धन प्रवाह, उत्तम पाचन और सुख-समृद्धि सुनिश्चित करता है।',
      favorable: 'स्वीकार्य रसोई स्थान। अग्नि तत्व संतुलित है।',
      defect: 'अग्नि तत्व असंतुलित। पेट की समस्याएं या अचानक खर्चे आ सकते हैं।',
      severeDosha: 'गंभीर आग्नेय दोष! ईशान कोण में रसोई मानसिक अशांति पैदा करती है; दक्षिण-पश्चिम में कलह कराती है।',
    },
    remedies: {
      severeDosha: 'Place a Green Baroda Marble slab beneath gas burner (if in NE/N) or Yellow Jaisalmer slab (if in SW).',
      defect: 'Keep a live money plant in green pot near kitchen window.',
    },
    remedies_hi: {
      severeDosha: 'गैस चूल्हे के नीचे हरे बड़ौदा मार्बल की स्लैब रखें (यदि उत्तर/ईशान में हो) या पीला जैसलमेर पत्थर रखें (यदि SW में हो)।',
      defect: 'रसोई की खिड़की के पास हरे गमले में मनी प्लांट रखें।',
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
    descriptions_hi: {
      ideal: 'आदर्श नैऋत्य स्थान! यह वास्तु पुरुष के चरणों की रक्षा करता है, जिससे घर के मुखिया का प्रभाव, स्थिरता व रिश्ते मजबूत होते हैं।',
      favorable: 'गहरी व सुखद नींद के लिए उत्तम शयनकक्ष।',
      defect: 'अस्थिर ऊर्जा। नींद में रुकावट पैदा कर सकती है।',
      severeDosha: 'आग्नेय में बेडरूम से पति-पत्नी में विवाद होता है; ईशान में होने से मानसिक तनाव व अनिद्रा होती है।',
    },
    remedies: {
      severeDosha: 'Always sleep with head pointing South or East. Keep Rose Quartz crystals near bed.',
      defect: 'Use warm ivory/beige bedsheets and avoid mirrors facing bed directly.',
    },
    remedies_hi: {
      severeDosha: 'सोते समय सिर हमेशा दक्षिण या पूर्व दिशा में रखें। बिस्तर के पास रोज क्वार्ट्ज क्रिस्टल रखें।',
      defect: 'हल्के बादामी/क्रीम रंग की चादर का उपयोग करें और बिस्तर के सामने दर्पण न लगाएं।',
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
    descriptions_hi: {
      ideal: 'ईशान कोण में दिव्य पूजा स्थान! अपार ईश्वरीय कृपा, मानसिक शांति और एकाग्रता लाता है।',
      favorable: 'शुभ व सकारात्मक पूजा स्थल।',
      defect: 'पूजा में मन भटकने की संभावना।',
      severeDosha: 'नैऋत्य में मंदिर होने से पितृ दोष व आर्थिक रुकावटें पैदा होती हैं।',
    },
    remedies: {
      severeDosha: 'Relocate Mandir to North-East immediately or place an energised Copper Shree Yantra.',
      defect: 'Use pure brass bell and burn pure guggul/camphor dhoop.',
    },
    remedies_hi: {
      severeDosha: 'मंदिर को तुरंत उत्तर-पूर्व (ईशान) में स्थानांतरित करें या अभिमंत्रित तांबे का श्री यंत्र स्थापित करें।',
      defect: 'शुद्ध पीतल की घंटी का प्रयोग करें और नित्य शुद्ध कपूर-गूगल की धूप जलाएं।',
    }
  },
  toilet: {
    idealZones: ['SSW', 'WSW', 'WNW'],
    favorableZones: ['NW', 'ESE', 'S'],
    defectZones: ['W', 'E', 'SE'],
    severeDoshaZones: ['NE', 'N', 'SW', 'NNE'],
    descriptions: {
      ideal: 'Accurately located in disposal zones (SSW/WNW)! Flushes out negative toxicity safely without harming wealth.',
      favorable: 'Controlled toilet placement.',
      defect: 'Flushes away element energy.',
      severeDosha: 'Disastrous Vastu Dosha! Toilet in NE/N/SW drains wealth, health and family peace completely.',
    },
    descriptions_hi: {
      ideal: 'विसर्जन क्षेत्र (SSW/WNW) में सटीक शौचालय! बिना धन को नुकसान पहुंचाए नकारात्मक ऊर्जा को सुरक्षित बाहर निकालता है।',
      favorable: 'नियंत्रित शौचालय स्थान।',
      defect: 'सकारात्मक दिशा ऊर्जा को बहा देता है।',
      severeDosha: 'गंभीर महावास्तु दोष! ईशान, उत्तर या नैऋत्य में शौचालय धन, स्वास्थ्य और कुल की शांति को नष्ट कर देता है।',
    },
    remedies: {
      severeDosha: 'Apply 3-inch Elemental Color Tape (Blue in NE/N, Yellow in SW, Red in SE) around commode base and insert Brass/Copper wire in tile grout.',
      defect: 'Keep a bowl of Himalayan rock salt inside toilet and change weekly.',
    },
    remedies_hi: {
      severeDosha: 'कमोड के चारों ओर 3-इंच रंगीन वास्तु टेप (NE/N में नीली, SW में पीली, SE में लाल) लगाएं और टाइल के जोड़ में तांबे का तार डालें।',
      defect: 'शौचालय में कांच के बर्तन में साबुत समुद्री नमक (Rock Salt) रखें और हर हफ्ते बदलें।',
    }
  },
  living_room: {
    idealZones: ['E', 'N', 'NE', 'NW'],
    favorableZones: ['ENE', 'W', 'SE'],
    defectZones: ['SSW', 'WNW'],
    severeDoshaZones: ['SW'],
    descriptions: {
      ideal: 'Harmonious social living hall! Enhances family warmth and social networking.',
      favorable: 'Good living area.',
      defect: 'Lethargic gathering space.',
      severeDosha: 'Living room in SW weakens owner leadership.',
    },
    descriptions_hi: {
      ideal: 'सुखद और ऊर्जावान लिविंग हॉल! पारिवारिक सामंजस्य और सामाजिक संबंधों को प्रगाढ़ बनाता है।',
      favorable: 'उत्तम बैठक क्षेत्र।',
      defect: 'बैठने पर आलस्य महसूस होना।',
      severeDosha: 'SW में बैठक होने से घर के मुखिया के प्रभाव में कमी आती है।',
    },
    remedies: {
      severeDosha: 'Ensure sofa faces North or East. Place heavy brass decor in SW corner of hall.',
      defect: 'Keep living room brightly lit and place fresh flowers.',
    },
    remedies_hi: {
      severeDosha: 'सोफे पर बैठते समय मुख उत्तर या पूर्व की ओर रखें। हॉल के दक्षिण-पश्चिम कोने में भारी पीतल की वस्तु रखें।',
      defect: 'हॉल में पर्याप्त रोशनी रखें और ताजे सुगंधित फूल सजाएं।',
    }
  }
};

export function getZoneByAngle(angleDeg) {
  let normalized = ((angleDeg % 360) + 360) % 360;
  for (const zone of VASTU_ZONES_16) {
    if (zone.minDeg > zone.maxDeg) {
      if (normalized >= zone.minDeg || normalized < zone.maxDeg) {
        return zone;
      }
    } else {
      if (normalized >= zone.minDeg && normalized < zone.maxDeg) {
        return zone;
      }
    }
  }
  return VASTU_ZONES_16[0];
}

export function evaluateVastu(placedRooms = [], northAngle = 0, centerX = 400, centerY = 300, lang = 'en') {
  if (!placedRooms || placedRooms.length === 0) {
    return {
      score: 75,
      rating: lang === 'hi' ? 'मध्यम वास्तु ऊर्जा' : 'Moderate Vastu Energy',
      roomResults: [],
      topStrengths: [],
      criticalDoshas: [],
      vedicInsights: {},
      summaryText: lang === 'hi' ? 'कमरे जोड़कर वास्तु विश्लेषण देखें।' : 'Add room boxes to view Vastu evaluation.'
    };
  }

  let accumulatedScore = 0;
  let totalScoreWeight = 0;

  const roomResults = placedRooms.map((room) => {
    const dx = room.x - centerX;
    const dy = room.y - centerY;

    let mathAngleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    let compassDeg = (mathAngleDeg + 90 + 360) % 360;
    let relativeDeg = (compassDeg - northAngle + 360) % 360;

    const assignedZone = getZoneByAngle(relativeDeg);
    const roomTypeInfo = ROOM_TYPES.find((r) => r.id === room.typeId) || { name: room.name || 'Room', name_hi: room.name || 'कमरा' };
    const rule = COMPATIBILITY_RULES[room.typeId];

    let rating = 'favorable';
    let numericScore = 75;
    let description = lang === 'hi' ? 'कमरा सामान्य स्थान पर है।' : 'Room is in acceptable position.';
    let remedy = '';

    if (rule) {
      if (rule.idealZones.includes(assignedZone.id)) {
        rating = 'ideal';
        numericScore = 95;
        description = lang === 'hi' ? rule.descriptions_hi?.ideal || rule.descriptions.ideal : rule.descriptions.ideal;
      } else if (rule.favorableZones.includes(assignedZone.id)) {
        rating = 'favorable';
        numericScore = 80;
        description = lang === 'hi' ? rule.descriptions_hi?.favorable || rule.descriptions.favorable : rule.descriptions.favorable;
        remedy = lang === 'hi' ? rule.remedies_hi?.defect || 'हल्के व सकारात्मक रंगों का प्रयोग करें।' : rule.remedies.defect || 'Enhance with light neutral colors.';
      } else if (rule.defectZones.includes(assignedZone.id)) {
        rating = 'defect';
        numericScore = 50;
        description = lang === 'hi' ? rule.descriptions_hi?.defect || rule.descriptions.defect : rule.descriptions.defect;
        remedy = lang === 'hi' ? rule.remedies_hi?.defect || rule.remedies.defect : rule.remedies.defect || 'Use metal strips or crystals to balance energy.';
      } else if (rule.severeDoshaZones.includes(assignedZone.id)) {
        rating = 'severeDosha';
        numericScore = 25;
        description = lang === 'hi' ? rule.descriptions_hi?.severeDosha || rule.descriptions.severeDosha : rule.descriptions.severeDosha;
        remedy = lang === 'hi' ? rule.remedies_hi?.severeDosha || rule.remedies.severeDosha : rule.remedies.severeDosha || 'Place Vastu Pyramids & element balancing strips.';
      }
    }

    let weight = 1;
    if (['entrance', 'kitchen', 'master_bedroom', 'toilet', 'puja_room'].includes(room.typeId)) weight = 2;

    totalScoreWeight += weight;
    accumulatedScore += numericScore * weight;

    return {
      id: room.id,
      name: lang === 'hi' ? (roomTypeInfo.name_hi || room.name) : (roomTypeInfo.name || room.name),
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

  let ratingLabel = lang === 'hi' ? 'उत्तम वास्तु संतुलन' : 'Harmonious Vastu';
  if (finalScore < 50) ratingLabel = lang === 'hi' ? 'गंभीर वास्तु असंतुलन' : 'Severe Vastu Imbalance';
  else if (finalScore < 70) ratingLabel = lang === 'hi' ? 'मध्यम वास्तु दोष' : 'Moderate Vastu Dosha';
  else if (finalScore < 85) ratingLabel = lang === 'hi' ? 'सकारात्मक ऊर्जा संतुलन' : 'Good Energy Balance';

  const topStrengths = roomResults.filter((r) => r.rating === 'ideal' || r.rating === 'favorable');
  const criticalDoshas = roomResults.filter((r) => r.rating === 'severeDosha' || r.rating === 'defect');

  return {
    score: finalScore,
    rating: ratingLabel,
    roomResults,
    topStrengths,
    criticalDoshas,
    summaryText: lang === 'hi' 
      ? `आपकी संपत्ति का वास्तु स्कोर ${finalScore}/100 है। इसमें ${topStrengths.length} शुभ दिशाएं एवं ${criticalDoshas.length} निवारण योग्य स्थान पाए गए हैं।`
      : `Your property scores ${finalScore}/100 in Vastu Alignment. Detected ${topStrengths.length} auspicious placements and ${criticalDoshas.length} areas with remedial solutions.`
  };
}
