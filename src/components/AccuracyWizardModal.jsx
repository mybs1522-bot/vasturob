import React from 'react';
import { X, HelpCircle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AccuracyWizardModal({ isOpen, onClose, plotExtraData, setPlotExtraData }) {
  if (!isOpen) return null;

  const precisionFactors = [
    {
      id: 'pada',
      title: '1. Exact Door Placement (32 Entrance Padas)',
      why: 'Vastu divides directions into 32 entry zones. For instance, Center North (N3/N4) brings high financial growth, while corner North (N1) brings health friction.',
      options: [
        { label: 'Center North / East (Auspicious)', val: 'N3_N4' },
        { label: 'Center South / West (Auspicious)', val: 'S3_S4' },
        { label: 'Corner / Off-center Door', val: 'corner' },
      ],
      key: 'entrancePada'
    },
    {
      id: 'topography',
      title: '2. Land Slope & Surrounding Roads (Veedhi Shoola)',
      why: 'Energy flows downhill. Land should naturally slope towards North or East. If South/West is lower, remedies are needed.',
      options: [
        { label: 'Slopes down towards North / East (Ideal)', val: 'slope_NE' },
        { label: 'Flat Level Plot', val: 'flat' },
        { label: 'Slopes down towards South / West', val: 'slope_SW' },
        { label: 'Facing T-Junction Road', val: 'veedhi_shoola' },
      ],
      key: 'topography'
    },
    {
      id: 'brahmasthan',
      title: '3. House Center Integrity (Brahmasthan)',
      why: 'The center 1/9th grid of your floor plan should be open and light. Structural pillars or toilets in the center choke energy.',
      options: [
        { label: 'Open & Unburdened (Ideal)', val: 'open' },
        { label: 'Living Room / Hall in Center', val: 'living' },
        { label: 'Pillar / Heavy Load in Center', val: 'pillar' },
        { label: 'Toilet in Center (Severe Defect)', val: 'dosha_center' },
      ],
      key: 'brahmasthanStatus'
    },
    {
      id: 'tanks',
      title: '4. Underground Sump vs. Overhead Water Tank',
      why: 'Underground water creates positive weight relief (best in North/East), while overhead tanks add heavy load (best in West/South-West).',
      options: [
        { label: 'Underground in NE, Overhead in W/SW (Ideal)', val: 'tanks_perfect' },
        { label: 'Underground tank in SE / SW', val: 'underground_bad' },
        { label: 'Overhead tank in NE / North', val: 'overhead_bad' },
      ],
      key: 'waterTanks'
    },
    {
      id: 'geometry',
      title: '5. Corner Cuts & Extensions',
      why: 'Extended North-East brings prosperity. Cut North-East corner causes energy imbalance.',
      options: [
        { label: 'Square / Rectangular (Ideal)', val: 'regular' },
        { label: 'North-East Extended Outward', val: 'ne_extended' },
        { label: 'North-East Corner Cut', val: 'ne_cut' },
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
              What Else Should Be Asked for 100% Vastu Accuracy?
            </h2>
            <p className="text-xs text-slate-500">
              5 supplementary criteria used by professional Vastu consultants
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-700"
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
                      className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all ${
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
            {Object.keys(plotExtraData).length} of 5 precision details configured
          </span>
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            Apply to Report <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
