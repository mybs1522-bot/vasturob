"use client";
import React, { useRef } from "react";
import { Box, Zap, Sparkles } from "lucide-react";
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
      className={`py-8 md:py-16 px-4 sm:px-6 bg-yellow-50/70 text-black rounded-3xl ${className}`}
    >
      <div className="max-w-4xl mx-auto">
        <TimelineAnimation
          animationNum={1}
          timelineRef={timelineRef}
          className="text-center mb-8 sm:mb-12"
        >
          <TimelineAnimation
            animationNum={2}
            timelineRef={timelineRef}
            as="h1"
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 text-slate-950 font-heading"
          >
            {isHi ? "अपने घर के लिए सही रिपोर्ट चुनें" : "Flexible Plans for Your Home Vastu"}
          </TimelineAnimation>
          <TimelineAnimation
            animationNum={3}
            timelineRef={timelineRef}
            as="p"
            className="text-neutral-600 text-pretty max-w-lg leading-relaxed mx-auto text-sm sm:text-base font-medium"
          >
            {isHi 
              ? "16 दिशाओं की महावास्तु ऊर्जा गणना। बिना तोड़फोड़ सुख-समृद्धि हेतु सही योजना चुनें।"
              : "100% precision 16-zone MahaVastu energy analytics. Unlock instant Vedic alignment with zero hidden fees."}
          </TimelineAnimation>
        </TimelineAnimation>

        <TimelineAnimation
          animationNum={4}
          timelineRef={timelineRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch"
        >
          {/* ======================================================== */}
          {/* OPTION 1: ₹299 BASIC SCORE REPORT (Amber Neo-Brutalist)  */}
          {/* ======================================================== */}
          <TimelineAnimation
            animationNum={5}
            timelineRef={timelineRef}
            className="bg-amber-300 border-2 border-black rounded-3xl sm:rounded-4xl p-6 sm:p-10 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6 text-left"
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-2xl font-black mb-1 flex items-center gap-2 text-black font-heading">
                  <Zap className="size-6 text-black fill-current" />
                  {isHi ? "मूल स्कोर रिपोर्ट" : "Basic Score"}
                </h3>
                <p className="text-neutral-900 text-sm font-medium">
                  {isHi ? "घर का मुख्य वास्तु स्कोर व 4 मुख्य स्तंभ" : "Macro prosperity score & defect analysis"}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black font-mono text-black">₹299</span>
                  <span className="text-base font-bold text-neutral-700 line-through">₹799</span>
                </div>
                <span className="text-sm font-semibold text-neutral-800">
                  {isHi ? "एकमुश्त भुगतान • कोई छुपा शुल्क नहीं" : "Single one-time purchase. No hidden fees."}
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t-2 border-black/20">
                {[
                  { label: isHi ? "16 दिशा वास्तु स्कोर" : "16-Zone Score", val: "/100" },
                  { label: isHi ? "4 मुख्य ऊर्जा स्तंभ" : "4 Core Energy Pillars", val: "Cash & Health" },
                  { label: isHi ? "गंभीर वास्तु दोष गणना" : "Defects & Risk Count", val: "Instant" },
                  { label: isHi ? "डिजिटल स्कोरकार्ड" : "Digital Scorecard", val: "Immediate" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5 text-sm font-bold text-black">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-4 h-4 text-black flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14.2618 3.59937C13.1956 2.53312 12.6625 2 12 2C11.3375 2 10.8044 2.53312 9.73815 3.59937C9.09832 4.2392 8.46427 4.53626 7.55208 4.53626C6.7556 4.53626 5.62243 4.38178 5 5.00944C4.38249 5.63214 4.53628 6.76065 4.53628 7.55206C4.53628 8.46428 4.2392 9.09832 3.59935 9.73817C2.53312 10.8044 2.00001 11.3375 2 12C2.00002 12.6624 2.53314 13.1956 3.59938 14.2618C4.31616 14.9786 4.53628 15.4414 4.53628 16.4479C4.53628 17.2444 4.38181 18.3776 5.00949 19C5.63218 19.6175 6.76068 19.4637 7.55206 19.4637C8.52349 19.4637 8.99128 19.6537 9.68457 20.347C10.2749 20.9374 11.0663 22 12 22C12.9337 22 13.7251 20.9374 14.3154 20.347C15.0087 19.6537 15.4765 19.4637 16.4479 19.4637C17.2393 19.4637 18.3678 19.6175 18.9905 19M20.4006 9.73817C21.4669 10.8044 22 11.3375 22 12C22 12.6624 21.4669 13.1956 20.4006 14.2618C19.6838 14.9786 19.4637 15.4414 19.4637 16.4479C19.4637 17.2444 19.6182 18.3776 18.9905 19M18.9905 19H19" />
                        <path d="M8 10.3077C8 10.3077 10.25 10 12 14C12 14 17.0588 4 22 2" />
                      </svg>
                      {item.label}
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-900 font-extrabold font-mono">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => onSelectPlan && onSelectPlan(299)}
              className="group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-950 text-white border-2 border-black px-6 font-bold text-xs uppercase tracking-wider transition-all duration-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-neutral-800 cursor-pointer mt-2"
            >
              <span>{isHi ? "मूल स्कोर अनलॉक करें (₹299) →" : "Unlock Basic Score (₹299) →"}</span>
            </Button>
          </TimelineAnimation>

          {/* ======================================================== */}
          {/* OPTION 2: ₹899 FULL REMEDY AUDIT (Dark Luxury Card)      */}
          {/* ======================================================== */}
          <TimelineAnimation
            animationNum={6}
            timelineRef={timelineRef}
            className="bg-neutral-900 text-white rounded-3xl sm:rounded-4xl p-6 sm:p-10 flex flex-col justify-between shadow-2xl ring-2 ring-amber-400/40 space-y-6 text-left relative overflow-hidden"
          >
            {/* Top Gold Ribbon */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-mono font-black text-[10px] uppercase tracking-wider px-4 py-1 rounded-bl-2xl shadow-md">
              {isHi ? "⭐ सर्वश्रेष्ठ / अनुशंसित" : "⭐ BEST VALUE / RECOMMENDED"}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-2xl font-black mb-1 flex items-center gap-2 font-heading text-white">
                  <Box className="size-7 text-amber-400" strokeWidth={2} />
                  {isHi ? "संपूर्ण वैदिक उपाय" : "Full Remedy Audit"}
                </h3>
                <TimelineAnimation
                  animationNum={7}
                  timelineRef={timelineRef}
                  className="text-neutral-400 text-sm font-medium"
                >
                  {isHi ? "बिना तोड़फोड़ 16-दिशा उपाय + आचार्य प्रमाणित PDF" : "Zero-demolition remedies & Acharya certified PDF"}
                </TimelineAnimation>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black font-mono text-white">₹899</span>
                  <span className="text-base font-bold text-neutral-500 line-through">₹2,499</span>
                  <span className="text-xs font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full">
                    {isHi ? "64% छूट" : "SAVE 64%"}
                  </span>
                </div>
                
                {/* Evergreen Timer */}
                <TimelineAnimation
                  animationNum={8}
                  timelineRef={timelineRef}
                  className="text-xs font-bold text-amber-300 flex items-center gap-1.5 pt-0.5"
                >
                  <span>⚡ {isHi ? "विशेष छूट समाप्त:" : "Special Offer Ends:"}</span>
                  <span className="bg-neutral-800 text-amber-300 font-mono px-2 py-0.5 rounded-md border border-amber-400/20">
                    {hours}h : {minutes}m : {seconds}s
                  </span>
                </TimelineAnimation>
              </div>

              <div className="space-y-3 pt-4 border-t border-neutral-800">
                {[
                  { label: isHi ? "मूल रिपोर्ट की सभी सुविधाएं" : "Basic Plan Features", val: "Included" },
                  { label: isHi ? "रंगीन टेप व धातु रॉड्स माप" : "Color Tape & Rod Sizes", val: "Custom Cut" },
                  { label: isHi ? "16 दिशा देवता ऊर्जा ग्रिड मैप" : "16-Zone Devta Grid", val: "Included" },
                  { label: isHi ? "आचार्य द्वारा प्रमाणित PDF" : "Acharya Certified PDF", val: "WhatsApp & Mail" },
                  { label: isHi ? "डिलीवरी समय" : "Delivery Timeline", val: "2–4 Hours" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5 text-sm font-medium text-neutral-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-4 h-4 text-amber-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14.2618 3.59937C13.1956 2.53312 12.6625 2 12 2C11.3375 2 10.8044 2.53312 9.73815 3.59937C9.09832 4.2392 8.46427 4.53626 7.55208 4.53626C6.7556 4.53626 5.62243 4.38178 5 5.00944C4.38249 5.63214 4.53628 6.76065 4.53628 7.55206C4.53628 8.46428 4.2392 9.09832 3.59935 9.73817C2.53312 10.8044 2.00001 11.3375 2 12C2.00002 12.6624 2.53314 13.1956 3.59938 14.2618C4.31616 14.9786 4.53628 15.4414 4.53628 16.4479C4.53628 17.2444 4.38181 18.3776 5.00949 19C5.63218 19.6175 6.76068 19.4637 7.55206 19.4637C8.52349 19.4637 8.99128 19.6537 9.68457 20.347C10.2749 20.9374 11.0663 22 12 22C12.9337 22 13.7251 20.9374 14.3154 20.347C15.0087 19.6537 15.4765 19.4637 16.4479 19.4637C17.2393 19.4637 18.3678 19.6175 18.9905 19M20.4006 9.73817C21.4669 10.8044 22 11.3375 22 12C22 12.6624 21.4669 13.1956 20.4006 14.2618C19.6838 14.9786 19.4637 15.4414 19.4637 16.4479C19.4637 17.2444 19.6182 18.3776 18.9905 19M18.9905 19H19" />
                        <path d="M8 10.3077C8 10.3077 10.25 10 12 14C12 14 17.0588 4 22 2" />
                      </svg>
                      {item.label}
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-400 font-mono font-bold">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => onSelectPlan && onSelectPlan(899)}
              className="group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 border-2 border-amber-300 px-6 font-black text-slate-950 text-xs sm:text-sm uppercase tracking-wider transition-all duration-100 shadow-[5px_5px_rgb(255_210_48)] active:translate-x-[3px] active:translate-y-[3px] hover:bg-yellow-300 active:shadow-none cursor-pointer mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isHi ? "संपूर्ण रिपोर्ट अनलॉक करें (₹899) →" : "Unlock Full Report (₹899) →"}</span>
            </Button>
          </TimelineAnimation>
        </TimelineAnimation>
      </div>
    </section>
  );
};

export default ProductPacks;
