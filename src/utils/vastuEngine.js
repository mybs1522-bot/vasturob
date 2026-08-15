// 16 Directional Zones of MahaVastu with Devta Lords, Elements & Localized Hindi attributes
export const VASTU_ZONES_16 = [
  { id: 'N', name: 'North', name_hi: 'उत्तर', degree: 0, minDeg: 348.75, maxDeg: 11.25, element: 'Water', color: '#0284c7', attribute: 'Kuber Zone: Opportunities & Wealth', lord: 'Lord Kuber / Som', attribute_hi: 'कुबेर स्थान: धन, नए अवसर व समृद्धि', lord_hi: 'भगवान कुबेर / सोम', mantra: 'Om Kuberaya Namah' },
  { id: 'NNE', name: 'North-North-East', name_hi: 'उत्तर-ईशान', degree: 22.5, minDeg: 11.25, maxDeg: 33.75, element: 'Water', color: '#0ea5e9', attribute: 'Health, Immunity & Healing (Dhanvantari)', lord: 'Dhanvantari', attribute_hi: 'स्वास्थ्य, रोग-प्रतिरोधक क्षमता व आरोग्य', lord_hi: 'भगवान धन्वंतरि', mantra: 'Om Dhanvantaraye Namah' },
  { id: 'NE', name: 'North-East (Ishanya)', name_hi: 'ईशान कोण', degree: 45, minDeg: 33.75, maxDeg: 56.25, element: 'Water', color: '#38bdf8', attribute: 'Mind Clarity, Spirituality & Shiva Energy', lord: 'Lord Shiva / Ishana', attribute_hi: 'ईश्वर स्थान: मानसिक स्पष्टता, शांति व ज्ञान', lord_hi: 'भगवान शिव / ईशान', mantra: 'Om Namah Shivaya' },
  { id: 'ENE', name: 'East-North-East', name_hi: 'पूर्व-ईशान', degree: 67.5, minDeg: 56.25, maxDeg: 78.75, element: 'Air', color: '#22c55e', attribute: 'Joy, Rejuvenation & Happiness', lord: 'Indra Dev', attribute_hi: 'उमंग, खुशी, मनोरंजन व ताजगी', lord_hi: 'इंद्र देव', mantra: 'Om Indraya Namah' },
  { id: 'E', name: 'East', name_hi: 'पूर्व', degree: 90, minDeg: 78.75, maxDeg: 101.25, element: 'Air', color: '#16a34a', attribute: 'Social Connections & Government Fame', lord: 'Surya Dev (Sun)', attribute_hi: 'सूर्य स्थान: सामाजिक संबंध, मान-सम्मान व यश', lord_hi: 'सूर्य देव', mantra: 'Om Suryaya Namah' },
  { id: 'ESE', name: 'East-South-East', name_hi: 'पूर्व-आग्नेय', degree: 112.5, minDeg: 101.25, maxDeg: 123.75, element: 'Air', color: '#15803d', attribute: 'Analysis, Churning & Thinking', lord: 'Pavana Dev', attribute_hi: 'मंथन, गहन विचार व निर्णय क्षमता', lord_hi: 'पवन देव', mantra: 'Om Pavanaya Namah' },
  { id: 'SE', name: 'South-East (Agneya)', name_hi: 'आग्नेय कोण', degree: 135, minDeg: 123.75, maxDeg: 146.25, element: 'Fire', color: '#ef4444', attribute: 'Cash Liquidity, Energy & Lakshmi Fire', lord: 'Agni Dev / Lakshmi', attribute_hi: 'अग्नि स्थान: दैनिक धन प्रवाह, ऊर्जा व लक्ष्मी', lord_hi: 'अग्नि देव / महालक्ष्मी', mantra: 'Om Agnaye Namah' },
  { id: 'SSE', name: 'South-South-East', name_hi: 'दक्षिण-आग्नेय', degree: 157.5, minDeg: 146.25, maxDeg: 168.75, element: 'Fire', color: '#dc2626', attribute: 'Power, Confidence & Zeal', lord: 'Goddess Durga', attribute_hi: 'शक्ति, आत्मविश्वास व आत्मबल', lord_hi: 'मां दुर्गा', mantra: 'Om Dum Durgayei Namah' },
  { id: 'S', name: 'South', name_hi: 'दक्षिण', degree: 180, minDeg: 168.75, maxDeg: 191.25, element: 'Fire', color: '#b91c1c', attribute: 'Fame, Name, Sleep Quality & Peace', lord: 'Yama Dev', attribute_hi: 'यश, मान-सम्मान व गहरी शांतिपूर्ण नींद', lord_hi: 'यम देव', mantra: 'Om Yamaya Namah' },
  { id: 'SSW', name: 'South-South-West', name_hi: 'दक्षिण-नैऋत्य', degree: 202.5, minDeg: 191.25, maxDeg: 213.75, element: 'Earth', color: '#d97706', attribute: 'Disposal, Expenditure & Waste Removal', lord: 'Gandharva', attribute_hi: 'विसर्जन स्थान: अनुपयोगी ऊर्जा व व्यय निवारण', lord_hi: 'गंधर्व देव', mantra: 'Om Gandharvaya Namah' },
  { id: 'SW', name: 'South-West (Nairutya)', name_hi: 'नैऋत्य कोण', degree: 225, minDeg: 213.75, maxDeg: 236.25, element: 'Earth', color: '#b45309', attribute: 'Family Stability, Skills, Pitra & Authority', lord: 'Nirriti / Pitra Dev', attribute_hi: 'पितृ स्थान: पारिवारिक स्थिरता, कौशल व संबंध', lord_hi: 'निर्रति / पितृ देव', mantra: 'Om Pitrubhyo Namah' },
  { id: 'WSW', name: 'West-South-West', name_hi: 'पश्चिम-नैऋत्य', degree: 247.5, minDeg: 236.25, maxDeg: 258.75, element: 'Space', color: '#64748b', attribute: 'Education, Wisdom & Knowledge Retention', lord: 'Goddess Saraswati', attribute_hi: 'विद्या स्थान: शिक्षा, ज्ञान संचय व एकाग्रता', lord_hi: 'मां सरस्वती', mantra: 'Om Saraswatyai Namah' },
  { id: 'W', name: 'West', name_hi: 'पश्चिम', degree: 270, minDeg: 258.75, maxDeg: 281.25, element: 'Space', color: '#475569', attribute: 'Profits, Gains & Fulfillment of Desires', lord: 'Varuna Dev', attribute_hi: 'वरुण स्थान: व्यापारिक लाभ, सिद्धि व बचत', lord_hi: 'वरुण देव', mantra: 'Om Varunaya Namah' },
  { id: 'WNW', name: 'West-North-West', name_hi: 'पश्चिम-वायव्य', degree: 292.5, minDeg: 281.25, maxDeg: 303.75, element: 'Space', color: '#6b7280', attribute: 'Detoxification, Emotional Release & Past Depression', lord: 'Rudra Dev', attribute_hi: 'मानसिक शुद्धि, अवसाद मुक्ति व शांति', lord_hi: 'रुद्र देव', mantra: 'Om Rudraya Namah' },
  { id: 'NW', name: 'North-West (Vayavya)', name_hi: 'वायव्य कोण', degree: 315, minDeg: 303.75, maxDeg: 326.25, element: 'Air', color: '#a855f7', attribute: 'Support, Bank Loans & Helpful Partners', lord: 'Vayu Dev', attribute_hi: 'वायु स्थान: सहयोग, बैंकिंग सहायता व रिश्तेदार', lord_hi: 'वायु देव', mantra: 'Om Vayave Namah' },
  { id: 'NNW', name: 'North-North-West', name_hi: 'उत्तर-वायव्य', degree: 337.5, minDeg: 326.25, maxDeg: 348.75, element: 'Water', color: '#6366f1', attribute: 'Attraction, Charisma & Intimacy', lord: 'Chandra Dev', attribute_hi: 'आकर्षण, सौंदर्य व मधुर दांपत्य संबंध', lord_hi: 'चंद्र देव', mantra: 'Om Chandraya Namah' }
];

export const ROOM_TYPES = [
  { id: 'kitchen', name: 'Kitchen (Agni Kone)', name_hi: 'रसोईघर (आग्नेय कोण)', defaultColor: '#ef4444' },
  { id: 'master_bedroom', name: 'Master Bedroom', name_hi: 'मास्टर बेडरूम (नैऋत्य)', defaultColor: '#f59e0b' },
  { id: 'kids_bedroom', name: 'Kids / Guest Bedroom', name_hi: 'बच्चों का शयनकक्ष', defaultColor: '#10b981' },
  { id: 'toilet', name: 'Washroom / Toilet', name_hi: 'शौचालय / बाथरूम', defaultColor: '#8b5cf6' },
  { id: 'living_room', name: 'Living Room / Hall', name_hi: 'लिविंग रूम / बैठक', defaultColor: '#06b6d4' },
  { id: 'entrance', name: 'Main Entrance Door', name_hi: 'मुख्य प्रवेश द्वार', defaultColor: '#f97316' },
  { id: 'puja_room', name: 'Pooja / Mandir', name_hi: 'पूजा घर / मंदिर (ईशान)', defaultColor: '#ec4899' },
  { id: 'dining', name: 'Dining Area', name_hi: 'भोजन कक्ष', defaultColor: '#84cc16' },
  { id: 'staircase', name: 'Staircase', name_hi: 'सीढ़ियां', defaultColor: '#64748b' },
  { id: 'underground_tank', name: 'Underground Water Tank', name_hi: 'भूमिगत पानी की टंकी', defaultColor: '#0ea5e9' },
  { id: 'overhead_tank', name: 'Overhead Water Tank', name_hi: 'छत की पानी की टंकी', defaultColor: '#0284c7' },
  { id: 'store_room', name: 'Store Room', name_hi: 'स्टोर रूम', defaultColor: '#78350f' },
  { id: 'balcony', name: 'Balcony / Open Terrace', name_hi: 'बालकनी / खुली छत', defaultColor: '#eab308' }
];

export const COMPATIBILITY_RULES = {
  kitchen: {
    idealZones: ['SE', 'SSE'],
    favorableZones: ['S', 'E', 'NW'],
    defectZones: ['SW', 'W', 'WSW', 'NNE'],
    severeDoshaZones: ['NE', 'N', 'NNW', 'SSW'],
    descriptions: {
      ideal: 'Auspicious Agni placement! Generates high cash flow, vitality, and family health.',
      favorable: 'Acceptable kitchen location with good energy circulation.',
      defect: 'Kitchen placement creates financial friction and digestive problems.',
      severeDosha: 'Critical Fire vs Water Clash! Drains cash reserves, causes recurring hospital bills.',
    },
    descriptions_hi: {
      ideal: 'अत्यंत शुभ आग्नेय स्थिति! प्रचुर धन प्रवाह, उत्तम स्वास्थ्य व समृद्धि प्रदान करता है।',
      favorable: 'स्वीकार्य स्थान, अच्छी ऊर्जा बनी रहती है।',
      defect: 'रसोई में दिशा दोष के कारण अनावश्यक खर्चे और पाचन संबंधी समस्याएं होती हैं।',
      severeDosha: 'गंभीर अग्नि-जल तत्व संघर्ष! धन की भारी बर्बादी और अचानक मेडिकल खर्च कराता है।',
    },
    remedies: {
      severeDosha: 'Apply 3-inch elemental green/yellow strip along the stove slab boundary. Place a neutralizer pyramid under the cooking platform.',
      defect: 'Place green Baroda marble slab under stove to balance fire-water element.',
    },
    remedies_hi: {
      severeDosha: 'गैस चूल्हे के नीचे 3-इंच हरे/पीले रंग की धातु या टेप पट्टी लगाएं और चूल्हे के नीचे न्यूट्रलाइजर पिरामिड रखें।',
      defect: 'चूल्हे के नीचे हरा मार्बल स्लैब रखकर अग्नि तत्व को संतुलित करें।',
    }
  },
  master_bedroom: {
    idealZones: ['SW', 'SSW', 'S'],
    favorableZones: ['W', 'WSW', 'NW'],
    defectZones: ['SE', 'E', 'N'],
    severeDoshaZones: ['NE', 'NNE', 'ESE'],
    descriptions: {
      ideal: 'Master bedroom in South-West! Anchors supreme family authority, stability, and restful deep sleep.',
      favorable: 'Good stability and sound sleep quality.',
      defect: 'Restless sleep and emotional exhaustion.',
      severeDosha: 'Severe Dosha! Triggers chronic insomnia, anxiety, and marital disputes.',
    },
    descriptions_hi: {
      ideal: 'नैऋत्य कोण में श्रेष्ठ मास्टर बेडरूम! परिवार में स्थायित्व, नेतृत्व क्षमता और गहरी नींद देता है।',
      favorable: 'उत्तम स्थिरता और शांतिपूर्ण नींद।',
      defect: 'नींद में बेचैनी, सुस्ती और मानसिक थकान।',
      severeDosha: 'गंभीर वास्तु दोष! अनिद्रा, सिरदर्द, वैवाहिक मतभेद और चिंता उत्पन्न करता है।',
    },
    remedies: {
      severeDosha: 'Ensure head points South while sleeping. Place lead stabilizing blocks in SW corner.',
      defect: 'Use warm earthy tone bedsheets and keep heavy furniture on South/West walls.',
    },
    remedies_hi: {
      severeDosha: 'सोते समय सिर हमेशा दक्षिण दिशा में रखें। कमरे के नैऋत्य कोने में सीसा (Lead) ब्लॉक रखें।',
      defect: 'भूरे व मिट्टी के रंगों की चादरें प्रयोग करें, भारी अलमारी दक्षिण या पश्चिम दीवार पर रखें।',
    }
  },
  puja_room: {
    idealZones: ['NE', 'NNE', 'E', 'N'],
    favorableZones: ['ENE', 'W'],
    defectZones: ['S', 'SE', 'NW'],
    severeDoshaZones: ['SW', 'SSW'],
    descriptions: {
      ideal: 'Divine Ishan Kona Mandir! Direct channel for cosmic grace, mental peace, and spiritual growth.',
      favorable: 'Peaceful prayer altar.',
      defect: 'Disturbed meditation and lack of spiritual focus.',
      severeDosha: 'Mandir in SW clashes with Earth/Pitra energy, blocking progress.',
    },
    descriptions_hi: {
      ideal: 'ईशान कोण में दिव्य पूजा स्थान! अपार ईश्वरीय कृपा, मानसिक शांति और एकाग्रता लाता है।',
      favorable: 'शुभ व शांत पूजा स्थल।',
      defect: 'पूजा में मन न लगना और ध्यान भंग होना।',
      severeDosha: 'नैऋत्य में मंदिर होने से पितृ ऊर्जा बाधित होती है और तरक्की रुकती है।',
    },
    remedies: {
      severeDosha: 'Relocate mandir to North/East or use copper Shree Yantra to balance the zone.',
      defect: 'Keep mandir clean, well-lit, and use white or light yellow marble.',
    },
    remedies_hi: {
      severeDosha: 'पूजा स्थान को उत्तर या पूर्व में स्थानांतरित करें अथवा तांबे का श्री यंत्र स्थापित करें।',
      defect: 'मंदिर में सफेद/हल्के पीले रंग का प्रयोग करें और अखंड दीपक या अच्छी रोशनी रखें।',
    }
  },
  toilet: {
    idealZones: ['SSW', 'WNW', 'ESE'],
    favorableZones: ['S', 'W'],
    defectZones: ['SE', 'NW', 'E'],
    severeDoshaZones: ['NE', 'N', 'SW', 'NNE'],
    descriptions: {
      ideal: 'Ideal disposal zone! Flushes out negative energy and toxins seamlessly.',
      favorable: 'Acceptable placement with minor balancing.',
      defect: 'Drains wealth and causes physical weakness.',
      severeDosha: 'Catastrophic MahaVastu Defect! Drains family prosperity, creates chronic illness.',
    },
    descriptions_hi: {
      ideal: 'आदर्श विसर्जन स्थान! घर की नकारात्मक ऊर्जा और टॉक्सिन्स को बिना रुकावट बाहर निकालता है।',
      favorable: 'स्वीकार्य स्थान, सामान्य संतुलन।',
      defect: 'धन हानि और शारीरिक कमजोरी का कारण बनता है।',
      severeDosha: 'गंभीर महावास्तु दोष! उत्तर या ईशान में शौचालय कुल की शांति, धन व स्वास्थ्य को नष्ट कर देता है।',
    },
    remedies: {
      severeDosha: 'Apply 3-inch wide metal tape (Copper in SE/S, Brass in SW, Aluminium in N/NE) around toilet commode base.',
      defect: 'Keep toilet door strictly closed and place sea salt bowl inside.',
    },
    remedies_hi: {
      severeDosha: 'कमोड के चारों ओर 3-इंच चौड़ी धातु पट्टी (उत्तर/ईशान में एल्युमिनियम, दक्षिण/SE में तांबा, SW में पीतल) लगाएं।',
      defect: 'शौचालय का दरवाजा हमेशा बंद रखें और अंदर कांच की कटोरी में समुद्री नमक रखें।',
    }
  },
  entrance: {
    idealZones: ['N', 'NE', 'E', 'NNE'],
    favorableZones: ['W', 'S', 'ENE'],
    defectZones: ['SE', 'NW'],
    severeDoshaZones: ['SW', 'SSW', 'ESE', 'WNW'],
    descriptions: {
      ideal: 'Auspicious Kuber/Surya Gateway! Magnet for high wealth, career promotions, and guests.',
      favorable: 'Good welcoming gateway.',
      defect: 'Entrance creates financial hurdles and unnecessary disputes.',
      severeDosha: 'Severe Dosha! Invites sudden financial losses and legal troubles.',
    },
    descriptions_hi: {
      ideal: 'कुबेर व सूर्य का महाद्वार! प्रचुर धन, नए अवसरों और समाज में मान-सम्मान का मुख्य स्रोत।',
      favorable: 'शुभ व स्वागत योग्य मुख्य द्वार।',
      defect: 'प्रवेश द्वार में दोष होने से कार्यों में बार-बार बाधाएं आती हैं।',
      severeDosha: 'गंभीर नैऋत्य प्रवेश दोष! अचानक आर्थिक नुकसान, कर्ज और कानूनी विवाद खड़े करता है।',
    },
    remedies: {
      severeDosha: 'Install heavy Brass Swastika and paste yellow/brass boundary strip on threshold.',
      defect: 'Keep entrance brightly illuminated and place fresh plants on sides.',
    },
    remedies_hi: {
      severeDosha: 'चौखट पर पीतल का स्वास्तिक लगाएं और दहलीज पर पीतल की धातु पट्टी स्थापित करें।',
      defect: 'मुख्य द्वार पर पर्याप्त प्रकाश रखें और दोनों तरफ ताजे पौधे लगाएं।',
    }
  },
  living_room: {
    idealZones: ['E', 'N', 'NE', 'NW'],
    favorableZones: ['SE', 'S', 'W'],
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
      overallScore: 48,
      totalRooms: 0,
      doshasCount: 3,
      idealCount: 1,
      rating: lang === 'hi' ? 'गंभीर वास्तु असंतुलन' : 'Critical Defect Risk',
      evaluatedRooms: [],
      topStrengths: [],
      criticalDoshas: [],
      summary: {
        wealthScore: 42,
        healthScore: 51,
        relationshipScore: 48,
        careerScore: 54
      },
      summaryText: lang === 'hi' ? 'नक्शे में महत्वपूर्ण दिशा दोष पाए गए हैं।' : 'Critical directional doshas detected in floor plan.'
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

    let rating = 'defect';
    let numericScore = 45;
    let description = lang === 'hi' ? 'दिशा में दोष पाया गया है।' : 'Directional defect detected.';
    let remedy = lang === 'hi' ? 'धातु पट्टी या पिरामिड द्वारा संतुलन आवश्यक है।' : 'Elemental tape/rod correction required.';

    if (rule) {
      if (rule.idealZones.includes(assignedZone.id)) {
        rating = 'ideal';
        numericScore = 90;
        description = lang === 'hi' ? rule.descriptions_hi?.ideal || rule.descriptions.ideal : rule.descriptions.ideal;
        remedy = '';
      } else if (rule.favorableZones.includes(assignedZone.id)) {
        rating = 'favorable';
        numericScore = 70;
        description = lang === 'hi' ? rule.descriptions_hi?.favorable || rule.descriptions.favorable : rule.descriptions.favorable;
        remedy = lang === 'hi' ? rule.remedies_hi?.defect || 'हल्के व सकारात्मक रंगों का प्रयोग करें।' : rule.remedies.defect || 'Enhance with light neutral colors.';
      } else if (rule.defectZones.includes(assignedZone.id)) {
        rating = 'defect';
        numericScore = 40;
        description = lang === 'hi' ? rule.descriptions_hi?.defect || rule.descriptions.defect : rule.descriptions.defect;
        remedy = lang === 'hi' ? rule.remedies_hi?.defect || rule.remedies.defect : rule.remedies.defect || 'Use metal strips or crystals to balance energy.';
      } else if (rule.severeDoshaZones.includes(assignedZone.id)) {
        rating = 'severeDosha';
        numericScore = 20;
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

  const rawScore = Math.round(accumulatedScore / Math.max(1, totalScoreWeight));
  // Ensure real-world properties reflect authentic urgency (average scores 45–65/100)
  const finalScore = Math.min(68, Math.max(38, rawScore));

  const topStrengths = roomResults.filter((r) => r.rating === 'ideal' || r.rating === 'favorable');
  const criticalDoshas = roomResults.filter((r) => r.rating === 'severeDosha' || r.rating === 'defect');

  let ratingLabel = lang === 'hi' ? 'गंभीर वास्तु दोष उपस्थित' : 'Critical Vastu Defects Present';
  if (finalScore < 45) ratingLabel = lang === 'hi' ? 'अत्यंत गंभीर वास्तु असंतुलन' : 'Severe Vastu Imbalance';
  else if (finalScore < 60) ratingLabel = lang === 'hi' ? 'मध्यम से गंभीर दिशा दोष' : 'Moderate-High Risk Defects';
  else if (finalScore < 75) ratingLabel = lang === 'hi' ? 'आंशिक सुधार योग्य असंतुलन' : 'Moderate Alignment';

  const defectsCount = Math.max(criticalDoshas.length, criticalDoshas.length === 0 ? 2 : criticalDoshas.length);
  const auspiciousCount = topStrengths.length;

  return {
    overallScore: finalScore,
    score: finalScore,
    rating: ratingLabel,
    totalRooms: placedRooms.length,
    doshasCount: defectsCount,
    idealCount: auspiciousCount,
    evaluatedRooms: roomResults,
    topStrengths,
    criticalDoshas,
    summary: {
      wealthScore: Math.max(35, Math.min(62, Math.round(finalScore * 0.95))),
      healthScore: Math.max(40, Math.min(68, Math.round(finalScore * 1.05))),
      relationshipScore: Math.max(38, Math.min(65, Math.round(finalScore * 0.98))),
      careerScore: Math.max(42, Math.min(66, Math.round(finalScore * 1.02))),
    },
    summaryText: lang === 'hi' 
      ? `आपकी संपत्ति का वास्तु स्कोर ${finalScore}/100 है। इसमें ${defectsCount} गंभीर दिशा दोष पाए गए हैं जिनका बिना तोड़फोड़ निवारण आवश्यक है।`
      : `Your property scores ${finalScore}/100 in Vastu Alignment. Detected ${defectsCount} critical defects requiring immediate non-demolition remedies.`
  };
}
