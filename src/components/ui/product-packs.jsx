import React from "react";
import { Zap, Clock, Check, Sparkles, Compass, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProductPacks = ({
  onSelectPlan,
  isHi = false,
  hours = "02",
  minutes = "37",
  seconds = "00",
  className = ""
}) => {
  return (
    <section className={`w-full max-w-2xl mx-auto py-4 px-3 sm:px-6 text-slate-900 ${className}`}>
      <div className="space-y-4">
        
        {/* Full-Page Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-black uppercase">
            <Compass className="w-3.5 h-3.5 text-amber-700 animate-spin-slow" />
            <span>{isHi ? "वास्तु विश्लेषण योजनाएं" : "Vastu Audit Plans"}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-950 font-heading tracking-tight">
            {isHi ? "अपनी वास्तु रिपोर्ट चुनें" : "Select Your Vastu Report"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto">
            {isHi 
              ? "16 दिशाओं की ऊर्जा संतुलन रिपोर्ट। अपनी आवश्यकतानुसार सही योजना चुनें।"
              : "Choose the right plan to balance your home's 16 directional energy grids."}
          </p>
        </div>

        {/* Up-Down Stacked Full-Page Cards */}
        <div className="space-y-3 pt-1">
          
          {/* ======================================================== */}
          {/* OPTION 1: ₹299 BASIC SCORE REPORT                        */}
          {/* ======================================================== */}
          <div className="bg-white border-2 border-slate-200 hover:border-amber-400 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all text-left space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm sm:text-base font-black text-slate-900 font-heading truncate">
                    {isHi ? "1. मूल स्कोर रिपोर्ट" : "1. Basic Score Report"}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] font-bold uppercase border border-slate-200">
                    {isHi ? "डिजिटल" : "Instant"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {isHi ? "घर का मुख्य वास्तु स्कोर व 4 मुख्य ऊर्जा स्तंभ" : "Overall prosperity score & 4 key energy pillars"}
                </p>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">₹299</span>
                  <span className="text-xs font-bold text-slate-400 line-through">₹799</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500">
                  {isHi ? "एकमुश्त" : "One-time"}
                </span>
              </div>
            </div>

            {/* Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{isHi ? "16 दिशाओं का समग्र स्कोर (/100)" : "16-Zone Overall Score (/100)"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{isHi ? "धन, स्वास्थ्य, सामंजस्य, करियर स्तंभ" : "Cash, Health, Harmony & Career"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{isHi ? "गंभीर वास्तु दोषों की पहचान व गणना" : "Critical Defect Count & Risk"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{isHi ? "तत्काल डिजिटल स्कोरकार्ड" : "Instant Digital Scorecard"}</span>
              </div>
            </div>

            {/* Button */}
            <Button
              type="button"
              onClick={() => onSelectPlan && onSelectPlan(299)}
              className="w-full h-11 sm:h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-md hover:scale-101 transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
            >
              <span>{isHi ? "मूल स्कोर अनलॉक करें (₹299) →" : "Unlock Basic Score (₹299) →"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>


          {/* ======================================================== */}
          {/* OPTION 2: ₹899 FULL VASTU REMEDY AUDIT                   */}
          {/* ======================================================== */}
          <div className="bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-white border-2 border-amber-400 rounded-3xl p-4 sm:p-5 shadow-xl transition-all text-left space-y-3 relative overflow-hidden ring-2 ring-amber-400/20">
            
            {/* Top Recommended Banner */}
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-mono font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
                {isHi ? "⭐ सर्वश्रेष्ठ / सबसे लोकप्रिय" : "⭐ BEST VALUE / RECOMMENDED"}
              </span>

              <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                {isHi ? "64% छूट" : "SAVE 64%"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm sm:text-base font-black text-slate-950 font-heading truncate">
                    {isHi ? "2. संपूर्ण वैदिक उपाय रिपोर्ट" : "2. Full Remedy Audit"}
                  </h2>
                </div>
                <p className="text-xs text-amber-900 font-semibold">
                  {isHi ? "बिना तोड़फोड़ 16-दिशा उपाय + आचार्य प्रमाणित PDF" : "Zero-demolition remedies & Acharya certified PDF"}
                </p>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">₹899</span>
                  <span className="text-xs font-bold text-slate-400 line-through">₹2,499</span>
                </div>
                <span className="text-[10px] font-bold text-amber-900">
                  {isHi ? "संपूर्ण रिपोर्ट" : "Complete Audit"}
                </span>
              </div>
            </div>

            {/* Evergreen Countdown Timer */}
            <div className="bg-white/90 border border-amber-300 rounded-xl px-3 py-1.5 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin-slow flex-shrink-0" />
                <span className="text-xs font-black text-slate-900 truncate">
                  {isHi ? "⚡ विशेष छूट समाप्त होने में शेष:" : "⚡ Special Offer Ends In:"}
                </span>
              </div>
              <div className="flex items-center gap-0.5 bg-slate-950 text-amber-300 px-2 py-0.5 rounded-lg font-mono font-black text-xs shadow-2xs flex-shrink-0">
                <span>{hours}h</span>:<span>{minutes}m</span>:<span>{seconds}s</span>
              </div>
            </div>

            {/* Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{isHi ? "मूल रिपोर्ट की सभी सुविधाएं शामिल" : "Everything in Basic Plan Included"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{isHi ? "कमरेवार रंगीन टेप व धातु रॉड्स की लंबाई" : "Color Tape & Metallic Rod Sizes"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{isHi ? "16 दिशा अष्टदिक्पालक देवता ग्रिड मैप" : "16-Zone Devta Grid Energy Map"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{isHi ? "2-4 घंटे में WhatsApp व Email पर PDF" : "Delivered to WhatsApp in 2–4 Hrs"}</span>
              </div>
            </div>

            {/* Button */}
            <Button
              type="button"
              onClick={() => onSelectPlan && onSelectPlan(899)}
              className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-101 transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{isHi ? "संपूर्ण रिपोर्ट अनलॉक करें (₹899) →" : "Unlock Full Report (₹899) →"}</span>
            </Button>
          </div>
        </div>

        {/* Footer Trust Strip */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-medium pt-1">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHi ? "100% बिना तोड़फोड़ वैदिक उपाय" : "100% Non-Demolition"}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHi ? "16 दिशा सटीक ग्रिड" : "16-Zone Precision Grid"}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-blue-600" />
            <span>{isHi ? "आचार्य प्रमाणित" : "Acharya Certified"}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPacks;
