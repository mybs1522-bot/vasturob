import React from 'react';
import { X, HelpCircle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function AccuracyWizardModal({ isOpen, onClose, plotExtraData, setPlotExtraData }) {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  if (!isOpen) return null;

  const precisionFactors = [
    {
      id: 'pada',
      title: isHi ? '1. मुख्य द्वार का सटीक स्थान (32 प्रवेश पद)' : '1. Exact Door Placement (32 Entrance Padas)',
      why: isHi 
        ? 'वास्तु में 32 प्रवेश पद होते हैं। उत्तर के केंद्र (N3/N4) का मुख्य द्वार भारी धन लाभ कराता है, जबकि कोने (N1) का द्वार समस्याएं देता है।' 
        : 'Vastu divides directions into 32 entry zones. For instance, Center North (N3/N4) brings high financial growth, while corner North (N1) brings health friction.',
      options: [
        { label: isHi ? 'उत्तर / पूर्व का मध्य भाग (अत्यंत शुभ)' : 'Center North / East (Auspicious)', val: 'N3_N4' },
        { label: isHi ? 'दक्षिण / पश्चिम का मध्य भाग (शुभ)' : 'Center South / West (Auspicious)', val: 'S3_S4' },
        { label: isHi ? 'कोने का या दिशा-भटका द्वार' : 'Corner / Off-center Door', val: 'corner' },
      ],
      key: 'entrancePada'
    },
    {
      id: 'topography',
      title: isHi ? '2. भूमि का ढलान व आसपास की सड़कें (वीथी शूल)' : '2. Land Slope & Surrounding Roads (Veedhi Shoola)',
      why: isHi
        ? 'ऊर्जा ढलान की ओर बहती है। भूमि का ढलान उत्तर या पूर्व दिशा की ओर होना चाहिए। यदि दक्षिण/पश्चिम में ढलान है तो उपाय आवश्यक हैं।'
        : 'Energy flows downhill. Land should naturally slope towards North or East. If South/West is lower, remedies are needed.',
      options: [
        { label: isHi ? 'उत्तर / पूर्व की ओर ढलान (उत्तम)' : 'Slopes down towards North / East (Ideal)', val: 'slope_NE' },
        { label: isHi ? 'समतल भूखंड' : 'Flat Level Plot', val: 'flat' },
        { label: isHi ? 'दक्षिण / पश्चिम की ओर ढलान' : 'Slopes down towards South / West', val: 'slope_SW' },
        { label: isHi ? 'टी-पॉइंट / मुख्य सड़क का सामने होना' : 'Facing T-Junction Road', val: 'veedhi_shoola' },
      ],
      key: 'topography'
    },
    {
      id: 'brahmasthan',
      title: isHi ? '3. घर का केंद्र (ब्रह्मस्थान संतुलन)' : '3. House Center Integrity (Brahmasthan)',
      why: isHi
        ? 'घर का केंद्रीय 1/9 भाग खुला और हल्का होना चाहिए। केंद्र में भारी खंभा या शौचालय ऊर्जा को अवरुद्ध कर देता है।'
        : 'The center 1/9th grid of your floor plan should be open and light. Structural pillars or toilets in the center choke energy.',
      options: [
        { label: isHi ? 'खुला व हल्का (श्रेष्ठ)' : 'Open & Unburdened (Ideal)', val: 'open' },
        { label: isHi ? 'केंद्र में बैठक / हॉल' : 'Living Room / Hall in Center', val: 'living' },
        { label: isHi ? 'केंद्र में भारी खंभा / सीढ़ी' : 'Pillar / Heavy Load in Center', val: 'pillar' },
        { label: isHi ? 'केंद्र में शौचालय (गंभीर दोष)' : 'Toilet in Center (Severe Defect)', val: 'dosha_center' },
      ],
      key: 'brahmasthanStatus'
    },
    {
      id: 'tanks',
      title: isHi ? '4. भूमिगत पानी की टंकी बनाम छत की टंकी' : '4. Underground Sump vs. Overhead Water Tank',
      why: isHi
        ? 'भूमिगत जल सकारात्मक ऊर्जा देता है (उत्तर/पूर्व में श्रेष्ठ), जबकि छत की टंकी भारी भार डालती है (पश्चिम/SW में श्रेष्ठ)।'
        : 'Underground water creates positive weight relief (best in North/East), while overhead tanks add heavy load (best in West/South-West).',
      options: [
        { label: isHi ? 'भूमिगत उत्तर/ईशान में, छत की टंकी पश्चिम/SW में' : 'Underground in NE, Overhead in W/SW (Ideal)', val: 'tanks_perfect' },
        { label: isHi ? 'भूमिगत टंकी दक्षिण-पूर्व या दक्षिण-पश्चिम में' : 'Underground tank in SE / SW', val: 'underground_bad' },
        { label: isHi ? 'छत की भारी टंकी उत्तर या ईशान में' : 'Overhead tank in NE / North', val: 'overhead_bad' },
      ],
      key: 'waterTanks'
    },
    {
      id: 'geometry',
      title: isHi ? '5. भूखंड के कटे या बढ़े हुए कोने' : '5. Corner Cuts & Extensions',
      why: isHi
        ? 'ईशान कोण का बढ़ना शुभ होता है। ईशान कोण का कटना दिशा दोष पैदा करता है।'
        : 'Extended North-East brings prosperity. Cut North-East corner causes energy imbalance.',
      options: [
        { label: isHi ? 'वर्गाकार / आयताकार (श्रेष्ठ)' : 'Square / Rectangular (Ideal)', val: 'regular' },
        { label: isHi ? 'ईशान (NE) कोण बाहर की ओर बढ़ा हुआ' : 'North-East Extended Outward', val: 'ne_extended' },
        { label: isHi ? 'ईशान (NE) कोण कटा हुआ' : 'North-East Corner Cut', val: 'ne_cut' },
      ],
      key: 'plotGeometry'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="clean-card w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden bg-white">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              {isHi ? '100% शुद्ध वास्तु के लिए 5 मुख्य मानक' : 'What Else Should Be Asked for 100% Vastu Accuracy?'}
            </h2>
            <p className="text-xs text-slate-500">
              {isHi ? 'वरिष्ठ वास्तु आचार्यों द्वारा उपयोग किए जाने वाले 5 पूरक नियम' : '5 supplementary criteria used by professional Vastu consultants'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-5 scrollbar-thin flex-1">
          {precisionFactors.map((factor) => (
            <div key={factor.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
              <h4 className="font-bold text-sm text-slate-900">{factor.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{factor.why}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                {factor.options.map((opt) => {
                  const isSelected = plotExtraData[factor.key] === opt.val;
                  return (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setPlotExtraData((prev) => ({ ...prev, [factor.key]: opt.val }))}
                      className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            {isHi 
              ? `${Object.keys(plotExtraData).length} / 5 अतिरिक्त विवरण चयनित`
              : `${Object.keys(plotExtraData).length} of 5 precision details configured`
            }
          </span>
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isHi ? 'रिपोर्ट में लागू करें' : 'Apply to Report'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
