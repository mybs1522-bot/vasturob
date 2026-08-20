"use client";
import React, { useRef } from "react";
import { Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimelineAnimation } from "@/components/ui/product-packs-utils/timeline-animation";

export interface ProductPacksProps {
  onSelectPlan?: (amount: number) => void;
  isHi?: boolean;
  hours?: string;
  minutes?: string;
  seconds?: string;
  className?: string;
}

export const ProductPacks: React.FC<ProductPacksProps> = ({
  onSelectPlan,
  isHi = false,
  hours = "02",
  minutes = "37",
  seconds = "00",
  className = ""
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={timelineRef}
      className={`py-2 px-1 sm:px-4 bg-yellow-50/60 text-black rounded-3xl ${className}`}
    >
      <div className="max-w-xl mx-auto space-y-2.5">
        
        {/* Ultra-Compact Header */}
        <TimelineAnimation
          animationNum={1}
          timelineRef={timelineRef}
          className="text-center space-y-0.5"
        >
          <TimelineAnimation
            animationNum={2}
            timelineRef={timelineRef}
            as="h2"
            className="text-base sm:text-xl font-black tracking-tight text-slate-950 font-heading"
          >
            {isHi ? "अपनी वास्तु रिपोर्ट चुनें" : "Select Your Vastu Report"}
          </TimelineAnimation>
          <TimelineAnimation
            animationNum={3}
            timelineRef={timelineRef}
            as="p"
            className="text-neutral-600 text-xs font-medium max-w-sm mx-auto"
          >
            {isHi 
              ? "16 दिशाओं का वैदिक विश्लेषण। उपयुक्त योजना चुनें।" 
              : "16-zone precision analytics. Choose your plan to unlock."}
          </TimelineAnimation>
        </TimelineAnimation>

        {/* Up-Down Stacked Cards: Ultra-Compact Spacing to Fit Entirely in Viewport */}
        <TimelineAnimation
          animationNum={4}
          timelineRef={timelineRef}
          className="space-y-2.5"
        >
          {/* ======================================================== */}
          {/* OPTION 1: ₹299 BASIC SCORE REPORT                        */}
          {/* ======================================================== */}
          <TimelineAnimation
            animationNum={5}
            timelineRef={timelineRef}
            className="bg-amber-300 border-2 border-black rounded-2xl sm:rounded-3xl p-3.5 sm:p-4.5 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2.5 text-left"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Zap className="size-5 text-black fill-current flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-black text-black font-heading">
                    {isHi ? "1. मूल स्कोर रिपोर्ट" : "1. Basic Score"}
                  </h3>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-black">₹299</span>
                  <span className="text-xs font-bold text-neutral-700 line-through">₹799</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1.5 border-t border-black/20 text-xs">
                {[
                  { label: isHi ? "16 दिशा वास्तु स्कोर" : "16-Zone Score", val: "/100" },
                  { label: isHi ? "4 मुख्य ऊर्जा स्तंभ" : "4 Core Energy Pillars", val: "Cash & Health" },
                  { label: isHi ? "गंभीर वास्तु दोष गणना" : "Defects & Risk Count", val: "Instant" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 font-bold text-black">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-3.5 h-3.5 text-black flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14.2618 3.59937C13.1956 2.53312 12.6625 2 12 2C11.3375 2 10.8044 2.53312 9.73815 3.59937C9.09832 4.2392 8.46427 4.53626 7.55208 4.53626C6.7556 4.53626 5.62243 4.38178 5 5.00944C4.38249 5.63214 4.53628 6.76065 4.53628 7.55206C4.53628 8.46428 4.2392 9.09832 3.59935 9.73817C2.53312 10.8044 2.00001 11.3375 2 12C2.00002 12.6624 2.53314 13.1956 3.59938 14.2618C4.31616 14.9786 4.53628 15.4414 4.53628 16.4479C4.53628 17.2444 4.38181 18.3776 5.00949 19C5.63218 19.6175 6.76068 19.4637 7.55206 19.4637C8.52349 19.4637 8.99128 19.6537 9.68457 20.347C10.2749 20.9374 11.0663 22 12 22C12.9337 22 13.7251 20.9374 14.3154 20.347C15.0087 19.6537 15.4765 19.4637 16.4479 19.4637C17.2393 19.4637 18.3678 19.6175 18.9905 19M20.4006 9.73817C21.4669 10.8044 22 11.3375 22 12C22 12.6624 21.4669 13.1956 20.4006 14.2618C19.6838 14.9786 19.4637 15.4414 19.4637 16.4479C19.4637 17.2444 19.6182 18.3776 18.9905 19M18.9905 19H19" />
                        <path d="M8 10.3077C8 10.3077 10.25 10 12 14C12 14 17.0588 4 22 2" />
                      </svg>
                      <span>{item.label}</span>
                    </div>
                    <span className="font-extrabold font-mono text-neutral-900">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clean Action Button Without Redundant Price */}
            <Button
              type="button"
              variant="outline"
              onClick={() => onSelectPlan && onSelectPlan(299)}
              className="group relative inline-flex h-10 w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-950 text-white border-2 border-black px-4 font-bold text-xs uppercase tracking-wider transition-all duration-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-neutral-800 cursor-pointer"
            >
              <span>{isHi ? "मूल रिपोर्ट अनलॉक करें →" : "Unlock Basic Report →"}</span>
            </Button>
          </TimelineAnimation>

          {/* ======================================================== */}
          {/* OPTION 2: ₹899 FULL REMEDY AUDIT                         */}
          {/* ======================================================== */}
          <TimelineAnimation
            animationNum={6}
            timelineRef={timelineRef}
            className="bg-neutral-900 text-white border-2 border-amber-400 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4.5 flex flex-col justify-between shadow-xl space-y-2.5 text-left relative overflow-hidden"
          >
            {/* Top Ribbon */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-mono font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-2xs">
                {isHi ? "⭐ सर्वश्रेष्ठ / अनुशंसित" : "⭐ BEST VALUE"}
              </span>
              <span className="text-[9px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full">
                {isHi ? "64% छूट" : "SAVE 64%"}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="size-5 text-amber-400 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-black text-white font-heading">
                    {isHi ? "2. संपूर्ण वैदिक उपाय" : "2. Full Remedies"}
                  </h3>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white">₹899</span>
                  <span className="text-xs font-bold text-neutral-500 line-through">₹2,499</span>
                </div>
              </div>

              {/* Compact Timer */}
              <div className="bg-neutral-800/90 border border-amber-400/20 rounded-lg px-2 py-1 flex items-center justify-between gap-1 text-[10px] text-amber-300">
                <span className="font-bold">{isHi ? "⚡ विशेष छूट समाप्त:" : "⚡ Special Offer Ends:"}</span>
                <span className="font-mono font-black bg-black/50 px-1.5 py-0.5 rounded">
                  {hours}h : {minutes}m : {seconds}s
                </span>
              </div>

              <div className="space-y-1.5 pt-1.5 border-t border-neutral-800 text-xs">
                {[
                  { label: isHi ? "मूल रिपोर्ट की सभी सुविधाएं" : "All Basic Features Included", val: "Yes" },
                  { label: isHi ? "रंगीन टेप व धातु रॉड्स माप" : "Color Tape & Rod Sizes", val: "Custom Cut" },
                  { label: isHi ? "आचार्य द्वारा प्रमाणित PDF" : "Acharya Certified PDF", val: "WhatsApp" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 text-neutral-200 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-3.5 h-3.5 text-amber-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14.2618 3.59937C13.1956 2.53312 12.6625 2 12 2C11.3375 2 10.8044 2.53312 9.73815 3.59937C9.09832 4.2392 8.46427 4.53626 7.55208 4.53626C6.7556 4.53626 5.62243 4.38178 5 5.00944C4.38249 5.63214 4.53628 6.76065 4.53628 7.55206C4.53628 8.46428 4.2392 9.09832 3.59935 9.73817C2.53312 10.8044 2.00001 11.3375 2 12C2.00002 12.6624 2.53314 13.1956 3.59938 14.2618C4.31616 14.9786 4.53628 15.4414 4.53628 16.4479C4.53628 17.2444 4.38181 18.3776 5.00949 19C5.63218 19.6175 6.76068 19.4637 7.55206 19.4637C8.52349 19.4637 8.99128 19.6537 9.68457 20.347C10.2749 20.9374 11.0663 22 12 22C12.9337 22 13.7251 20.9374 14.3154 20.347C15.0087 19.6537 15.4765 19.4637 16.4479 19.4637C17.2393 19.4637 18.3678 19.6175 18.9905 19M20.4006 9.73817C21.4669 10.8044 22 11.3375 22 12C22 12.6624 21.4669 13.1956 20.4006 14.2618C19.6838 14.9786 19.4637 15.4414 19.4637 16.4479C19.4637 17.2444 19.6182 18.3776 18.9905 19M18.9905 19H19" />
                        <path d="M8 10.3077C8 10.3077 10.25 10 12 14C12 14 17.0588 4 22 2" />
                      </svg>
                      <span>{item.label}</span>
                    </div>
                    <span className="font-bold font-mono text-neutral-400">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clean Action Button Without Redundant Price */}
            <Button
              type="button"
              variant="outline"
              onClick={() => onSelectPlan && onSelectPlan(899)}
              className="group relative inline-flex h-10 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 border-2 border-amber-300 px-4 font-black text-slate-950 text-xs uppercase tracking-wider transition-all duration-100 shadow-[3px_3px_rgb(255_210_48)] active:translate-x-[1px] active:translate-y-[1px] hover:bg-yellow-300 active:shadow-none cursor-pointer"
            >
              <span>{isHi ? "संपूर्ण रिपोर्ट अनलॉक करें →" : "Unlock Full Report →"}</span>
            </Button>
          </TimelineAnimation>
        </TimelineAnimation>
      </div>
    </section>
  );
};

export default ProductPacks;
