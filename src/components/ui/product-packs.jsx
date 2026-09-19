import React from "react";
import { Clock, Lock, Sparkles, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProductPacks = ({
  onSelectPlan,
  isHi = false,
  hours = "02",
  minutes = "37",
  seconds = "00",
  overallScore = 49,
  doshasCount = 4,
  className = ""
}) => {
  return (
    <section className={`py-4 px-2 sm:px-4 ${className} bg-amber-50 rounded-xl relative overflow-hidden`}>
      {/* Subtle Vastu Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      <div className="max-w-4xl mx-auto space-y-5 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sun className="w-4 h-4 text-amber-600" />
            <span>{isHi ? "वास्तु विश्लेषण पूर्ण" : "VASTU AUDIT COMPLETE"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-950">
            {isHi ? "आपकी वास्तु रिपोर्ट तैयार है!" : "Your Report is Ready!"}
          </h1>
          <p className="text-amber-800 text-sm font-medium leading-tight max-w-md mx-auto">
            {isHi 
              ? "16 दिशाओं की ऊर्जा संतुलन रिपोर्ट। अपनी रिपोर्ट प्राप्त करने के लिए नीचे दी गई योजना चुनें।" 
              : "16-zone precision analytics. Choose your preferred plan below to instantly unlock your report."}
          </p>
        </div>

        {/* 1:1 Warm Vastu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch max-w-3xl mx-auto">
          
          {/* ======================================================== */}
          {/* OPTION 1: ₹299 BASIC VASTU REPORT (Emphasized Default)     */}
          {/* ======================================================== */}
          <div className="bg-gradient-to-b from-amber-100 to-white border-2 border-amber-400 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-lg text-left space-y-4 relative min-h-[260px]">
            {/* Top Ribbon */}
            <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-lg shadow-sm">
              {isHi ? "सबसे लोकप्रिय" : "MOST POPULAR"}
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-amber-950 leading-tight">
                    {isHi ? "मूल वास्तु रिपोर्ट" : "Basic Vastu Report"}
                  </h3>
                  <p className="text-xs text-amber-800 font-medium">
                    {isHi ? "घर का मुख्य वास्तु स्कोर व 4 मुख्य स्तंभ" : "Macro prosperity score & defect count"}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="text-3xl font-black text-amber-600">₹299</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-500 line-through">
                    ₹799
                  </span>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2 pt-3 border-t border-amber-200/60 text-sm">
                {[
                  { label: isHi ? "16 दिशा समग्र वास्तु स्कोर" : "16-Zone Overall Score" },
                  { label: isHi ? "4 मुख्य ऊर्जा स्तंभ (धन, स्वास्थ्य)" : "4 Core Energy Pillars (Cash & Health)" },
                  { label: isHi ? "गंभीर वास्तु दोषों की गणना" : "Defect Count & Risk Analysis" },
                  { label: isHi ? "तत्काल डिजिटल स्कोरकार्ड" : "Immediate Digital Scorecard" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-amber-900 font-medium text-xs sm:text-sm">
                    <span className="text-amber-600">🕉️</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-3">
              <Button
                type="button"
                onClick={() => onSelectPlan && onSelectPlan(299)}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{isHi ? "मूल रिपोर्ट अनलॉक करें →" : "Unlock Basic Report →"}</span>
              </Button>
            </div>
          </div>


          {/* ======================================================== */}
          {/* OPTION 2: ₹899 DETAILED VASTU REPORT                       */}
          {/* ======================================================== */}
          <div className="bg-white border-2 border-orange-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-md text-left space-y-4 min-h-[260px]">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-800 leading-tight">
                    {isHi ? "विस्तृत वास्तु रिपोर्ट" : "Detailed Vastu Report"}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {isHi ? "बिना तोड़फोड़ 16-दिशा उपाय + आचार्य PDF" : "Zero-demolition remedies & certified PDF"}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="text-2xl font-black text-slate-800">₹899</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 line-through">
                    ₹2,499
                  </span>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-sm">
                {[
                  { label: isHi ? "मूल रिपोर्ट की सभी सुविधाएं शामिल" : "All Basic Features Included" },
                  { label: isHi ? "रंगीन टेप व धातु रॉड्स के सटीक माप" : "Color Tape & Rod Sizes" },
                  { label: isHi ? "16 दिशा देवता ऊर्जा ग्रिड मैप" : "16-Zone Devta Grid Map" },
                  { label: isHi ? "आचार्य द्वारा प्रमाणित PDF (WhatsApp)" : "Acharya Certified PDF (WhatsApp)" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700 font-medium text-xs sm:text-sm">
                    <span className="text-orange-500">✨</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onSelectPlan && onSelectPlan(899)}
                className="w-full h-12 rounded-xl border-2 border-orange-400 text-orange-600 hover:bg-orange-50 font-bold text-sm uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isHi ? "संपूर्ण रिपोर्ट अनलॉक करें →" : "Unlock Full Report →"}</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Universal Countdown Timer */}
        <div className="flex justify-center pt-2">
          <div className="bg-amber-100 border border-amber-300 rounded-full px-4 py-1.5 flex items-center justify-center gap-2 text-xs text-amber-900 shadow-sm">
            <Clock className="w-4 h-4 text-amber-600 animate-spin-slow" />
            <span className="font-bold">{isHi ? "विशेष छूट समाप्त:" : "Special Offer Ends:"}</span>
            <span className="font-mono font-black text-amber-700">
              {hours}h : {minutes}m : {seconds}s
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProductPacks;

