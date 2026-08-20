import React, { useRef } from "react";
import { Zap, Sparkles } from "lucide-react";
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
    <section className={`py-1 px-1 sm:px-3 text-black ${className}`}>
      <div className="max-w-4xl mx-auto space-y-2">
        
        {/* Compact Header */}
        <div className="text-center space-y-0.5">
          <h2 className="text-sm sm:text-lg font-black tracking-tight text-slate-950 font-heading">
            {isHi ? "अपनी वास्तु रिपोर्ट चुनें" : "Select Your Vastu Report"}
          </h2>
          <p className="text-neutral-600 text-[11px] sm:text-xs font-medium leading-tight max-w-sm mx-auto">
            {isHi 
              ? "16 दिशाओं का वैदिक विश्लेषण। उपयुक्त योजना चुनें।" 
              : "16-zone precision analytics. Choose your plan to unlock."}
          </p>
        </div>

        {/* 1:1 Grid Layout (Side-by-Side on tablet/desktop, Ultra-compact on mobile so BOTH CTAs are in viewport) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 items-stretch max-w-2xl mx-auto">
          
          {/* ======================================================== */}
          {/* OPTION 1: ₹299 BASIC SCORE REPORT (1:1 Amber Card)       */}
          {/* ======================================================== */}
          <div className="bg-amber-300 border-2 border-black rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-left space-y-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Zap className="size-4 text-black fill-current flex-shrink-0" />
                  <h3 className="text-sm sm:text-base font-black text-black font-heading leading-tight">
                    {isHi ? "1. मूल स्कोर" : "1. Basic Score"}
                  </h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black font-mono text-black">₹299</span>
                  <span className="text-[10px] sm:text-xs font-bold text-neutral-700 line-through">₹799</span>
                </div>
              </div>

              <p className="text-[10px] sm:text-[11px] text-neutral-900 font-medium leading-tight">
                {isHi ? "घर का मुख्य वास्तु स्कोर व 4 स्तंभ" : "Macro prosperity score & defect count"}
              </p>

              <div className="space-y-1 pt-1 border-t border-black/20 text-[11px] sm:text-xs">
                {[
                  { label: isHi ? "16 दिशा स्कोर" : "16-Zone Score", val: "/100" },
                  { label: isHi ? "4 ऊर्जा स्तंभ" : "4 Core Pillars", val: "Cash & Health" },
                  { label: isHi ? "दोष गणना" : "Defects Count", val: "Instant" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center leading-none py-0.2">
                    <div className="flex items-center gap-1.5 font-bold text-black text-[10px] sm:text-[11px]">
                      <span className="text-black font-black">✓</span>
                      <span>{item.label}</span>
                    </div>
                    <span className="font-extrabold font-mono text-neutral-900 text-[10px] sm:text-[11px]">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clean Action Button Without Price */}
            <Button
              type="button"
              variant="outline"
              onClick={() => onSelectPlan && onSelectPlan(299)}
              className="group relative inline-flex h-8 sm:h-9 w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-950 text-white border-2 border-black px-3 font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-neutral-800 cursor-pointer"
            >
              <span>{isHi ? "मूल रिपोर्ट अनलॉक करें →" : "Unlock Basic →"}</span>
            </Button>
          </div>

          {/* ======================================================== */}
          {/* OPTION 2: ₹899 FULL REMEDY AUDIT (1:1 Dark Luxury Card)  */}
          {/* ======================================================== */}
          <div className="bg-neutral-900 text-white border-2 border-amber-400 rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-between shadow-lg text-left space-y-2 relative overflow-hidden">
            
            {/* Top Ribbon */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-1">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-mono font-black text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded shadow-2xs">
                {isHi ? "⭐ सर्वश्रेष्ठ" : "⭐ BEST VALUE"}
              </span>
              <span className="text-[8px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.2 rounded-full">
                {isHi ? "64% छूट" : "SAVE 64%"}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Sparkles className="size-4 text-amber-400 flex-shrink-0" />
                  <h3 className="text-sm sm:text-base font-black text-white font-heading leading-tight">
                    {isHi ? "2. संपूर्ण उपाय" : "2. Full Remedies"}
                  </h3>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black font-mono text-white">₹899</span>
                  <span className="text-[10px] sm:text-xs font-bold text-neutral-500 line-through">₹2,499</span>
                </div>
              </div>

              {/* Compact Timer */}
              <div className="bg-neutral-800/90 border border-amber-400/20 rounded-md px-1.5 py-0.5 flex items-center justify-between gap-1 text-[9px] text-amber-300 leading-none">
                <span className="font-bold">{isHi ? "⚡ छूट:" : "⚡ Ends:"}</span>
                <span className="font-mono font-black bg-black/50 px-1 py-0.2 rounded">
                  {hours}h : {minutes}m : {seconds}s
                </span>
              </div>

              <div className="space-y-1 pt-1 border-t border-neutral-800 text-[11px] sm:text-xs">
                {[
                  { label: isHi ? "मूल रिपोर्ट की सभी सुविधाएं" : "All Basic Features Included", val: "Yes" },
                  { label: isHi ? "रंगीन टेप व धातु रॉड माप" : "Color Tape & Rod Sizes", val: "Custom" },
                  { label: isHi ? "आचार्य प्रमाणित PDF" : "Acharya Certified PDF", val: "WhatsApp" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center leading-none py-0.2">
                    <div className="flex items-center gap-1.5 text-neutral-200 font-medium text-[10px] sm:text-[11px]">
                      <span className="text-amber-400 font-black">✓</span>
                      <span>{item.label}</span>
                    </div>
                    <span className="font-bold font-mono text-neutral-400 text-[10px] sm:text-[11px]">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clean Action Button Without Price */}
            <Button
              type="button"
              variant="outline"
              onClick={() => onSelectPlan && onSelectPlan(899)}
              className="group relative inline-flex h-8 sm:h-9 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 border-2 border-amber-300 px-3 font-black text-slate-950 text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-100 shadow-[2px_2px_rgb(255_210_48)] active:translate-x-[1px] active:translate-y-[1px] hover:bg-yellow-300 active:shadow-none cursor-pointer"
            >
              <span>{isHi ? "संपूर्ण रिपोर्ट अनलॉक करें →" : "Unlock Full →"}</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPacks;
