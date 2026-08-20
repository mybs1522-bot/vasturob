import React, { createContext, useContext, useState } from 'react';

export const translations = {
  en: {
    // Navigation & Common
    app_title: 'VastuScope',
    tagline: 'MahaVastu Precision Engine',
    home: 'Home',
    accuracy_guarantee: '100% Accuracy',
    step1_start: '1. Start',
    step2_mark: '2. Mark Boxes',
    step3_north: '3. Set North',
    step4_report: '4. Report',
    back_to_start: 'Back to Start',
    back_to_rooms: 'Back to Room Boxes',
    back_to_north: 'Back to North Direction',
    calculate_report: 'Calculate Vastu Report',
    scanning_plan: 'Scanning Your Plan...',
    plan_scanned: 'Plan Scanned',
    retry_processing: 'Retry Processing',
    plan_analysis_retry: 'Floor Plan Analysis Retry Required',
    plan_retry_desc: 'We could not automatically detect room boxes on the first attempt. Click Retry Plan Processing below to re-scan your image.',
    re_upload: 'Re-upload Image',
    
    // Step 1: Start Choices
    how_to_start: 'How would you like to start?',
    choose_option: 'Choose your preferred option below to calculate Vastu',
    upload_plan_title: 'Upload Floor Plan',
    upload_plan_desc: 'Upload PNG, JPG, SVG, or PDF file',
    draw_by_hand_title: 'Draw Floor Plan by Hand',
    draw_by_hand_desc: 'Freehand Pen & Eraser sketch canvas',
    chat_expert_title: 'Chat with Vastu Expert',
    chat_expert_price: '₹999',
    chat_expert_desc: 'No floor plan required! Our expert will chat with you on WhatsApp and resolve your queries.',
    or_divider: 'OR',

    // Step 2: Canvas & Rooms
    step2_heading: 'Step 2: Position Room Boxes',
    toggle_zones: 'Toggle 16 Zones Grid',
    upload_new_plan: 'Upload Plan',
    drag_to_reposition: 'Drag room badges to match your exact room locations',

    // Step 3: North Direction
    step3_heading: 'Step 3: Align Exact North Direction',
    step3_desc: 'Rotate compass wheel or adjust slider until the North arrow matches your floor plan North',
    north_angle: 'North Angle',
    degrees: 'Degrees',
    compass_instruction: 'Align the RED needle directly pointing to your site True North',
    generate_full_audit: 'Generate Full Vastu Audit Report',

    // Landing Page Hero
    hero_badge: 'Trusted by 50,000+ Indian Homes & Architects',
    hero_title_1: 'Scientific 16-Zone',
    hero_title_2: 'Vastu Analysis',
    hero_title_3: 'For Your Home in 60 Seconds',
    hero_desc: 'Upload your blueprint or sketch by hand. Our MahaVastu AI Engine scans 16 directional zones, detects critical doshas, and gives 100% non-demolition remedies.',
    cta_start_free: 'Scan Floor Plan →',
    cta_expert: 'Chat with Expert (₹999)',
    guarantee_subtext: 'Zero Wall Breaking • Instant PDF Report • 100% Vedic Accuracy',

    // Landing Page Pain Points
    pain_badge: 'Common Life Disruptions',
    pain_title: 'Are Misaligned Energies Affecting Your Home?',
    pain_desc: '90% of homes suffer from uncorrected directional imbalances that silently impact family peace, wealth, and health.',
    pain1_title: 'Financial Stagnation',
    pain1_desc: 'Cash drain and blocked payments caused by misplaced toilets or fire elements in North & North-East zones.',
    pain2_title: 'Health & Insomnia',
    pain2_desc: 'Chronic lethargy, anxiety, and sleep disorders from sleeping in wrong energy zones or defective South-West placement.',
    pain3_title: 'Family & Relationship Friction',
    pain3_desc: 'Constant arguments, misunderstandings, and marital stress triggered by elemental clashes in South-East or South-West.',

    // Landing Page Demolition Free
    remedy_badge: 'Zero Wall Breakage Required',
    remedy_title: 'Correct 95% of Vastu Deficiencies Without Breaking a Single Wall',
    remedy_desc: 'You do NOT need expensive home renovations or structural breaking. Modern Vedic Vastu uses precise elemental neutralization techniques:',
    rem1_title: 'Elemental Color Tapes & Strips',
    rem1_desc: 'Misplaced toilets or kitchens are instantly neutralized by applying 3-inch elemental color strips along the floor boundary.',
    rem2_title: 'Brass & Copper Energy Rods',
    rem2_desc: 'Metal wire insertions into tile grooves block negative energy fields from bathrooms and wrong entrances in under 30 minutes.',
    rem3_title: 'Pancha Tattva Pyramids',
    rem3_desc: 'Consecrated brass and lead pyramids boost dormant positive energy in weak zones, multiplying cash flow and family harmony effortlessly.',

    // Report View
    report_title: 'Vastu Shastra Comprehensive Audit',
    report_subtitle: '16 MahaVastu Directional Zones & Lakshmi-Kuber Prosperity Evaluation',
    prosperity_score: 'Lakshmi-Kuber Prosperity Score',
    score_excellent: 'Excellent Vastu Alignment',
    score_good: 'Moderate Vastu Energy',
    score_poor: 'Critical Vastu Doshas Found',
    doshas_detected: 'Defects Detected',
    remedies_prescribed: 'Remedies Prescribed',
    vital_zones_aligned: 'Vital Zones Aligned',
    download_pdf_report: 'Download Full Premium PDF Report (₹899)',
    unlock_remedies: 'Unlock Complete Non-Demolition Remedies Guide',
    whatsapp_consultation_cta: 'Book 1-on-1 WhatsApp Consultation (₹999)',
    room_by_room_audit: 'Room-by-Room Zone Audits',
    correct_zone: 'Ideal Zone',
    favorable_zone: 'Favorable Zone',
    defect_zone: 'Defect Zone',
    severe_dosha: 'Severe Dosha',
    remedy_label: 'Remedy / उपाय:',

    // Language Selector Modal
    select_language: 'Choose Your Preferred Language',
    select_language_sub: 'अपनी पसंदीदा भाषा चुनें (Select English or Hindi)',
    lang_en_name: 'English',
    lang_en_desc: 'Standard Architectural & MahaVastu terms',
    lang_hi_name: 'हिन्दी (Hindi)',
    lang_hi_desc: '16 महावास्तु दिशाएं, वैदिक उपाय व संपूर्ण विश्लेषण',
    continue_btn: 'Continue / आगे बढ़ें',
    loading_vastu_engine: 'Loading MahaVastu Engine...',
    loading_vastu_sub: 'कृपया प्रतीक्षा करें • वास्तु चक्र लोड हो रहा है'
  },
  hi: {
    // Navigation & Common
    app_title: 'वास्तुस्कोप',
    tagline: 'महावास्तु 16-दिशा शुद्धता इंजन',
    home: 'होम',
    accuracy_guarantee: '100% प्रामाणिक वैदिक वास्तु',
    step1_start: '1. शुरुआत',
    step2_mark: '2. कमरे चिह्नित करें',
    step3_north: '3. उत्तर दिशा तय करें',
    step4_report: '4. वास्तु रिपोर्ट',
    back_to_start: '← वापस शुरुआत पर',
    back_to_rooms: '← वापस कमरों की स्थिति पर',
    back_to_north: '← वापस उत्तर दिशा पर',
    calculate_report: 'संपूर्ण वास्तु रिपोर्ट निकालें',
    scanning_plan: 'नक्शे का विश्लेषण जारी है...',
    plan_scanned: 'नक्शा सफलतापूर्वक स्कैन हुआ',
    retry_processing: 'पुनः स्कैन करें',
    plan_analysis_retry: 'नक्शा पुनः स्कैन करने की आवश्यकता है',
    plan_retry_desc: 'पहली बार में कमरों के नाम नहीं पढ़े जा सके। नीचे "पुनः स्कैन करें" पर क्लिक करें।',
    re_upload: 'दूसरा नक्शा अपलोड करें',
    
    // Step 1: Start Choices
    how_to_start: 'आप वास्तु जांच कैसे शुरू करना चाहते हैं?',
    choose_option: 'सटीक वास्तु गणना के लिए नीचे से अपना पसंदीदा विकल्प चुनें',
    upload_plan_title: 'घर का नक्शा (Floor Plan) अपलोड करें',
    upload_plan_desc: 'PNG, JPG, SVG या PDF फाइल अपलोड करें',
    draw_by_hand_title: 'हाथ से नक्शा बनाएं',
    draw_by_hand_desc: 'पेन और इरेज़र से अपनी सुविधानुसार आसान स्केच बनाएं',
    chat_expert_title: 'वास्तु एक्सपर्ट से सीधा परामर्श',
    chat_expert_price: '₹999',
    chat_expert_desc: 'नक्शे की जरूरत नहीं! हमारे वरिष्ठ वास्तु विशेषज्ञ WhatsApp पर आपसे चैट कर समाधान देंगे।',
    or_divider: 'अथवा',

    // Step 2: Canvas & Rooms
    step2_heading: 'चरण 2: नक्शे पर कमरों की स्थिति जांचें',
    toggle_zones: '16 महावास्तु दिशा चक्र देखें/छिपाएं',
    upload_new_plan: 'नया नक्शा चुनें',
    drag_to_reposition: 'कमरों के बैज को ड्रैग करके सही जगह पर सेट करें',

    // Step 3: North Direction
    step3_heading: 'चरण 3: घर की सटीक उत्तर (North) दिशा तय करें',
    step3_desc: 'कंपास व्हील को घुमाएं या स्लाइडर से उत्तर दिशा को अपने नक्शे की मुख्य उत्तर दिशा से मिलाएं',
    north_angle: 'उत्तर दिशा कोण (डिग्री)',
    degrees: 'डिग्री',
    compass_instruction: 'लाल सुई को अपने घर की वास्तविक उत्तर दिशा की ओर रखें',
    generate_full_audit: 'संपूर्ण वैदिक वास्तु रिपोर्ट तैयार करें',

    // Landing Page Hero
    hero_badge: '50,000+ भारतीय घरों एवं वास्तुविदों द्वारा प्रमाणित',
    hero_title_1: 'वैज्ञानिक 16-दिशा',
    hero_title_2: 'महावास्तु विश्लेषण',
    hero_title_3: 'मात्र 60 सेकंड में अपने घर का',
    hero_desc: 'घर का नक्शा अपलोड करें या हाथ से बनाएं। हमारा AI इंजन 16 दिशाओं की ऊर्जा जांचकर बिना तोड़फोड़ 100% अचूक वैदिक उपाय प्रदान करता है।',
    cta_start_free: 'नक्शा स्कैन करें →',
    cta_expert: 'एक्सपर्ट से परामर्श (₹999)',
    guarantee_subtext: 'बिना तोड़फोड़ उपाय • तुरंत PDF रिपोर्ट • 100% वैदिक प्रामाणिकता',

    // Landing Page Pain Points
    pain_badge: 'दैनिक जीवन में वास्तु का प्रभाव',
    pain_title: 'क्या आपके घर में गलत दिशा की ऊर्जा समस्याएं पैदा कर रही है?',
    pain_desc: '90% घरों में अनजाने में दिशा दोष होते हैं, जो धन, स्वास्थ्य और पारिवारिक सुख को सीधे प्रभावित करते हैं।',
    pain1_title: 'धन की कमी व अनावश्यक खर्चे',
    pain1_desc: 'उत्तर (कुबेर) या ईशान कोण में शौचालय या गलत रसोई से आमदनी रुकती है और धन व्यर्थ बहता है।',
    pain2_title: 'स्वास्थ्य समस्याएं व अनिद्रा',
    pain2_desc: 'नैऋत्य (SW) या आग्नेय (SE) में गलत शयनकक्ष से मानसिक तनाव, सिरदर्द और नींद न आने की समस्या होती है।',
    pain3_title: 'पारिवारिक कलह व तनाव',
    pain3_desc: 'तत्वों के असंतुलन (जैसे अग्नि में जल या जल में अग्नि) से घर में बात-बात पर झगड़े और अशांति बनी रहती है।',

    // Landing Page Demolition Free
    remedy_badge: 'बिना एक भी दीवार तोड़े 100% समाधान',
    remedy_title: 'घर में बिना कोई तोड़फोड़ किए 95% वास्तु दोष ठीक करें',
    remedy_desc: 'आपको महंगे नवीनीकरण या निर्माण तोड़ने की बिल्कुल जरूरत नहीं है। आधुनिक महावास्तु सरल पंचतत्व संतुलन तकनीकों का उपयोग करता है:',
    rem1_title: 'पंचतत्व रंगीन पट्टियां (Color Tapes)',
    rem1_desc: 'गलत दिशा में बने शौचालय या रसोई के चारों ओर 3-इंच की विशिष्ट रंगीन पट्टी लगाने से नकारात्मक ऊर्जा तुरंत रुक जाती है।',
    rem2_title: 'पीतल व तांबे की ऊर्जा रॉड्स (Metal Rods)',
    rem2_desc: 'टाइल के जोड़ों में पीतल या तांबे का तार लगाने से मात्र 30 मिनट में गंभीर प्रवेश द्वार या दिशा दोष पूरी तरह शांत हो जाते हैं।',
    rem3_title: 'पंचतत्व पिरामिड व स्फटिक (Pyramids & Crystals)',
    rem3_desc: 'कमजोर दिशाओं में अभिमंत्रित पिरामिड स्थापित करने से घर में धन का प्रवाह और सकारात्मक ऊर्जा कई गुना बढ़ जाती है।',

    // Report View
    report_title: 'संपूर्ण महावास्तु वैदिक विश्लेषण रिपोर्ट',
    report_subtitle: '16 महावास्तु दिशाएं, पंचतत्व संतुलन एवं लक्ष्मी-कुबेर समृद्धि सूचकांक',
    prosperity_score: 'लक्ष्मी-कुबेर वास्तु समृद्धि स्कोर',
    score_excellent: 'अति उत्तम वास्तु संतुलन',
    score_good: 'मध्यम वास्तु ऊर्जा',
    score_poor: 'गंभीर वास्तु दोष उपस्थित',
    doshas_detected: 'पहचाने गए दोष',
    remedies_prescribed: 'प्रस्तावित वैदिक उपाय',
    vital_zones_aligned: 'संतुलित मुख्य दिशाएं',
    download_pdf_report: 'संपूर्ण प्रीमियम PDF रिपोर्ट डाउनलोड करें (₹899)',
    unlock_remedies: 'बिना तोड़फोड़ संपूर्ण उपाय गाइड अनलॉक करें',
    whatsapp_consultation_cta: 'वास्तु विशेषज्ञ से 1-ऑन-1 WhatsApp परामर्श (₹999)',
    room_by_room_audit: 'प्रत्येक कमरे का दिशावार विस्तृत विश्लेषण',
    correct_zone: 'आदर्श स्थान (शुभ)',
    favorable_zone: 'स्वीकार्य स्थान',
    defect_zone: 'दिशा दोष (सुधार योग्य)',
    severe_dosha: 'गंभीर वास्तु दोष',
    remedy_label: 'वैदिक उपाय:',

    // Language Selector Modal
    select_language: 'अपनी पसंदीदा भाषा चुनें',
    select_language_sub: 'Choose Your Preferred Language (English or Hindi)',
    lang_en_name: 'English',
    lang_en_desc: 'Standard Architectural & MahaVastu terms',
    lang_hi_name: 'हिन्दी (Hindi)',
    lang_hi_desc: '16 महावास्तु दिशाएं, वैदिक उपाय व संपूर्ण विश्लेषण',
    continue_btn: 'आगे बढ़ें / Continue',
    loading_vastu_engine: 'महावास्तु इंजन लोड हो रहा है...',
    loading_vastu_sub: 'कृपया प्रतीक्षा करें • वास्तु चक्र तैयार किया जा रहा है'
  }
};

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
  toggleLang: () => {},
  isLoadingTransition: false
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('vastuscope_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const [isLoadingTransition, setIsLoadingTransition] = useState(false);

  const setLang = (newLang) => {
    if (newLang === lang) return;
    setIsLoadingTransition(true);
    try {
      localStorage.setItem('vastuscope_lang', newLang);
    } catch {}
    
    // Smooth transition
    setTimeout(() => {
      setLangState(newLang);
      setTimeout(() => {
        setIsLoadingTransition(false);
      }, 500);
    }, 400);
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'hi' : 'en');
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations.en?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, toggleLang, isLoadingTransition }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
