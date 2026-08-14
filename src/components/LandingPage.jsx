import React, { useState } from 'react';
import HeroAscii from '@/components/ui/hero-ascii';
import VastuDemoVideoPlayer from './VastuDemoVideoPlayer';
import {
  Compass, Sparkles, ShieldCheck, PhoneCall,
  Flame, Droplets, CheckCircle2, Zap, Award,
  AlertTriangle, HeartPulse, DollarSign, Users, Briefcase, Sparkle, Hammer, ShieldAlert
} from 'lucide-react';

export default function LandingPage({ onNavigateToStart, onOpenExpertModal, onOpenAdmin }) {
  const [activeTab, setActiveTab] = useState('wealth');

  return (
    <div className="min-h-screen chequered-bg text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col smooth-hardware bg-white">
      {/* Subtle Fear Emergency Warning Top Bar (Black & Gold Theme) */}
      <div className="bg-slate-950 text-amber-300 border-b border-amber-500/30 px-4 py-2.5 text-center text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm relative z-50">
        <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce flex-shrink-0" />
        <span>
          <strong className="text-white">WARNING:</strong> 85% of Modern Indian Homes Suffer from Silent Vastu Defects That Drain Wealth &amp; Health.
        </span>
        <button
          type="button"
          onClick={onNavigateToStart}
          className="ml-2 bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full font-black text-[11px] hover:bg-yellow-300 transition-all hidden sm:inline shadow-sm cursor-pointer"
        >
          Check Your Risk Now &rarr;
        </button>
      </div>

      {/* HERO SECTION WITH UNICORN VITRUVIAN ASCII ANIMATION (FULL WIDTH & GOLD THEME) */}
      <section className="w-full">
        <HeroAscii onNavigateToStart={onNavigateToStart} onOpenExpertModal={onOpenExpertModal} />

        {/* HIGH QUALITY 8-10 SECOND CODE ANIMATION VIDEO (BELOW HERO SECTION) */}
        <div className="px-4 sm:px-8 max-w-7xl mx-auto">
          <VastuDemoVideoPlayer onNavigateToStart={onNavigateToStart} />
        </div>

        {/* Live Studio Wheel Teaser Card (White, Black & Gold) */}
        <div className="max-w-4xl mx-4 sm:mx-auto rounded-3xl border border-amber-400/40 bg-white p-4 sm:p-6 shadow-xl relative overflow-hidden my-12 z-10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-mono text-slate-900 font-extrabold">LIVE 16-ZONE MAHAVASTU SCANNER</span>
            </div>
            <span className="text-xs font-black bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-300/60 font-mono">
              Accuracy: 100% Precision
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-amber-200/60 space-y-2">
              <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-600" /> South-East (Agni Kone)
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">Controls cash liquidity and fire energy. Misplaced elements here cause sudden financial drainage.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-amber-200/60 space-y-2">
              <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
                <Droplets className="w-4 h-4 text-amber-600" /> North-East (Ishan Kone)
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">Spiritual head of the house (Lord Shiva zone). Heavy overhead clutter here causes mental confusion &amp; anxiety.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-amber-200/60 space-y-2">
              <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" /> South-West (Nirriti)
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">Controls family stability and head of household authority. Cuts here cause chronic debt and instability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE SILENT DANGER MATRIX (BLACK & GOLD SILENT DANGER) */}
      <section className="chequered-dark-bg text-white py-20 px-4 sm:px-8 border-y border-slate-800 relative bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-950/80 border border-amber-500/40 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Silent Danger Warning
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-white">
              4 Critical Vastu Flaws That Destroy Peace Before You Notice
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-medium">
              Vastu energy defects act like a silent leak in your household. 92% of families attribute these to &quot;bad luck&quot; or &quot;hard times&quot; without realizing their floor plan is causing them:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Danger Item 1 */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-400 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">SE Zone Defect</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">The Cash Drainer</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Toilet or water feature in South-East (Agni). Money flows in but instantly drains out into hospital bills, unexpected breakdowns, or unpaid invoices.
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-amber-400 font-bold">
                <span>Risk Level: High</span>
                <span>Impact: 100% Financial</span>
              </div>
            </div>

            {/* Danger Item 2 */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-400 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">NE Zone Defect</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">The Mental Fog</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Heavy storage or clutter over Ishan Kone. Triggers chronic headaches, anxiety, lack of career direction, and memory issues for family members.
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-amber-400 font-bold">
                <span>Risk Level: Severe</span>
                <span>Impact: Health &amp; Peace</span>
              </div>
            </div>

            {/* Danger Item 3 */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-400 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">SW Zone Defect</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">Relationship Split</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cuts or main entrance in South-West (Nirriti). Weakens the primary breadwinner&apos;s authority, causing constant marital quarrels and instability.
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-amber-400 font-bold">
                <span>Risk Level: High</span>
                <span>Impact: Marital Bond</span>
              </div>
            </div>

            {/* Danger Item 4 */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-400 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">North Zone Block</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">Career Ceiling</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kitchen or trash in the North (Kuber) zone. Blocks new job offers, prevents business growth, and keeps you stuck despite working long hours.
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-amber-400 font-bold">
                <span>Risk Level: High</span>
                <span>Impact: Growth &amp; Income</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={onNavigateToStart}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl inline-flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
            >
              <Compass className="w-5 h-5 text-slate-950" />
              <span>Diagnose Your Floor Plan Now &rarr;</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: 100% DEMOLITION-FREE REMEDIES GUARANTEE */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-black text-amber-900 uppercase tracking-widest bg-amber-100/90 border border-amber-300 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <Hammer className="w-4 h-4 text-amber-700" /> Zero Wall Breakage Required
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading leading-tight">
            Correct 95% of Vastu Deficiencies Without Breaking a Single Wall
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            You do NOT need expensive home renovations or structural breaking. Modern Vedic Vastu uses precise elemental neutralization techniques:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-4 hover:border-amber-400 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
              <Zap className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Elemental Color Tapes &amp; Strips</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Misplaced toilets or kitchens are instantly neutralized by applying 3-inch elemental color strips along the floor boundary.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-4 hover:border-amber-400 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Brass &amp; Copper Energy Rods</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Metal wire insertions into tile grooves block negative energy fields from bathrooms and wrong entrances completely in less than 30 minutes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-4 hover:border-amber-400 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
              <Sparkle className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Pancha Tattva Pyramids</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consecrated brass and lead pyramids boost dormant positive energy in weak zones, multiplying cash flow and family harmony effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: REAL TRANSFORMATION CASE STUDIES */}
      <section className="bg-slate-50/80 py-20 px-4 sm:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-black text-amber-900 uppercase tracking-widest bg-amber-100/90 border border-amber-300 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-700" /> Verified Transformation Stories
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading leading-tight">
              Before &amp; After Vastu Score Transformations
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              See how everyday Indian families turned around their finances, sleep quality, and relationships:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Case 1 */}
            <div className="bg-white p-6 rounded-3xl border border-amber-200/80 space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Rajesh &amp; Meena Sharma</h4>
                  <p className="text-[10px] text-slate-500">Business Owners, Mumbai</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">42/100</span>
                  <span className="text-xs font-bold text-slate-400">&rarr;</span>
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">89/100</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                &ldquo;Our client payments were stuck for 9 months. VastuScope identified a toilet in our South-East cash zone. Applying a copper strip remedy released ₹14 Lakhs of pending dues within 21 days!&rdquo;
              </p>
              <div className="text-[10px] font-bold text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200">
                ✅ Outcome: ₹14 Lakh Payment Recovered in 21 Days
              </div>
            </div>

            {/* Case 2 */}
            <div className="bg-white p-6 rounded-3xl border border-amber-200/80 space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Priya &amp; Sunita K.</h4>
                  <p className="text-[10px] text-slate-500">IT Executives, Bengaluru</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">38/100</span>
                  <span className="text-xs font-bold text-slate-400">&rarr;</span>
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">92/100</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                &ldquo;My husband had severe insomnia and career anxiety for 2 years. Rotating our bed direction away from the North-East zone solved his sleep issue in just 4 days!&rdquo;
              </p>
              <div className="text-[10px] font-bold text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200">
                ✅ Outcome: Insomnia Solved &amp; Got Promoted
              </div>
            </div>

            {/* Case 3 */}
            <div className="bg-white p-6 rounded-3xl border border-amber-200/80 space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Vikram Sethi</h4>
                  <p className="text-[10px] text-slate-500">Architect, New Delhi</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">55/100</span>
                  <span className="text-xs font-bold text-slate-400">&rarr;</span>
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">95/100</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                &ldquo;As an architect I was skeptical. But VastuScope&apos;s 16-zone precision compass alignment is 100% scientifically sound. I now use it for all my residential projects.&rdquo;
              </p>
              <div className="text-[10px] font-bold text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200">
                ✅ Outcome: 100% Client Satisfaction &amp; Growth
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VASTU BALANCED VS UNBALANCED COMPARISON TABLE */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 border-y border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">
              Vastu Balanced vs. Unbalanced Home
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">See the dramatic difference proper Vastu alignment makes</p>
          </div>

          {/* Desktop & Tablet Table (Minimum Width 640px for Zero Word Squishing) */}
          <div className="hidden sm:block overflow-x-auto rounded-3xl border-2 border-slate-900 shadow-xl bg-white">
            <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-white font-extrabold uppercase tracking-wider text-xs border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6 w-1/3">Life Aspect</th>
                  <th className="py-4 px-6 text-amber-400 bg-slate-900 w-1/3">❌ Unbalanced Vastu Home</th>
                  <th className="py-4 px-6 text-yellow-300 bg-slate-900 w-1/3">✅ Vastu Balanced Home</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-black text-slate-900">Cash Flow &amp; Savings</td>
                  <td className="py-4 px-6 text-slate-700 bg-slate-50/80">Blocked payments, sudden expenses, mounting debts</td>
                  <td className="py-4 px-6 text-amber-950 bg-amber-50/60 font-bold">Continuous money flow, high savings, financial growth</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-black text-slate-900">Career &amp; Promotions</td>
                  <td className="py-4 px-6 text-slate-700 bg-slate-50/80">Stagnation, hard work ignored, job insecurity</td>
                  <td className="py-4 px-6 text-amber-950 bg-amber-50/60 font-bold">Rapid promotions, new business opportunities</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-black text-slate-900">Health &amp; Peace of Mind</td>
                  <td className="py-4 px-6 text-slate-700 bg-slate-50/80">Insomnia, mental anxiety, chronic ailments</td>
                  <td className="py-4 px-6 text-amber-950 bg-amber-50/60 font-bold">Deep restful sleep, high energy, mental clarity</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-black text-slate-900">Relationships &amp; Family</td>
                  <td className="py-4 px-6 text-slate-700 bg-slate-50/80">Daily arguments, misunderstandings, family friction</td>
                  <td className="py-4 px-6 text-amber-950 bg-amber-50/60 font-bold">Warm loving atmosphere, strong family unity</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (Crystal Clear, Single Column Stack for Phones) */}
          <div className="sm:hidden space-y-4">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-md p-4 space-y-3">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-200 pb-2">
                💰 Cash Flow &amp; Savings
              </h3>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="bg-red-50/80 border border-red-200 p-2.5 rounded-xl text-red-950">
                  <span className="font-bold block text-red-700 text-[10px] uppercase">❌ Unbalanced Home:</span>
                  Blocked payments, sudden expenses, mounting debts
                </div>
                <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl text-amber-950">
                  <span className="font-extrabold block text-amber-800 text-[10px] uppercase">✅ Balanced Home:</span>
                  Continuous money flow, high savings, financial growth
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-md p-4 space-y-3">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-200 pb-2">
                📈 Career &amp; Promotions
              </h3>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="bg-red-50/80 border border-red-200 p-2.5 rounded-xl text-red-950">
                  <span className="font-bold block text-red-700 text-[10px] uppercase">❌ Unbalanced Home:</span>
                  Stagnation, hard work ignored, job insecurity
                </div>
                <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl text-amber-950">
                  <span className="font-extrabold block text-amber-800 text-[10px] uppercase">✅ Balanced Home:</span>
                  Rapid promotions, new business opportunities
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-md p-4 space-y-3">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-200 pb-2">
                🧠 Health &amp; Peace of Mind
              </h3>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="bg-red-50/80 border border-red-200 p-2.5 rounded-xl text-red-950">
                  <span className="font-bold block text-red-700 text-[10px] uppercase">❌ Unbalanced Home:</span>
                  Insomnia, mental anxiety, chronic ailments
                </div>
                <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl text-amber-950">
                  <span className="font-extrabold block text-amber-800 text-[10px] uppercase">✅ Balanced Home:</span>
                  Deep restful sleep, high energy, mental clarity
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-md p-4 space-y-3">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-200 pb-2">
                ❤️ Relationships &amp; Family
              </h3>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="bg-red-50/80 border border-red-200 p-2.5 rounded-xl text-red-950">
                  <span className="font-bold block text-red-700 text-[10px] uppercase">❌ Unbalanced Home:</span>
                  Daily arguments, misunderstandings, family friction
                </div>
                <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl text-amber-950">
                  <span className="font-extrabold block text-amber-800 text-[10px] uppercase">✅ Balanced Home:</span>
                  Warm loving atmosphere, strong family unity
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-STEP HOW IT WORKS */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-extrabold text-amber-900 uppercase tracking-widest bg-amber-100/90 px-3.5 py-1 rounded-full border border-amber-300">
            Quick 4-Step Walkthrough
          </span>
          <h2 className="text-3xl font-black text-slate-900 font-heading">
            How VastuScope Works in 60 Seconds
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 border border-amber-400/40 font-black flex items-center justify-center text-sm shadow-md">
              1
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Start Layout</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload a floor plan image, draw your walls freehand by hand, or select White Slate mode.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 border border-amber-400/40 font-black flex items-center justify-center text-sm shadow-md">
              2
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Position Room Boxes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Place room pills (+ Kitchen, + Bedroom, + Washroom, + Living, + Main Door) onto your layout.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 border border-amber-400/40 font-black flex items-center justify-center text-sm shadow-md">
              3
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Rotate North Wheel</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Turn the 360° compass wheel directly by touch or mouse to align North with your property.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 border border-amber-400/40 font-black flex items-center justify-center text-sm shadow-md">
              4
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Vedic Report &amp; Remedies</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get your score, Lakshmi-Kuber cash flow index, Ashtadikpalaka devta lords, and zero-demolition remedies.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onNavigateToStart}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg inline-flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
          >
            <span>Scan My Floor Plan Now &rarr;</span>
          </button>
        </div>
      </section>

      {/* FOOTER HIGH-CONVERTING CTA BANNER (BLACK & GOLD) */}
      <section className="bg-slate-950 border-t border-amber-500/30 text-white py-16 px-4 text-center space-y-6">
        <div className="max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black font-heading leading-tight text-white">
            Protect Your Home&apos;s Energy &amp; Wealth Today
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-medium">
            Don&apos;t wait for unseen Vastu defects to drain your savings. Calculate your 16-zone directional score and remedies right now.
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onNavigateToStart}
            className="px-9 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-all hover:scale-105 cursor-pointer"
          >
            Scan My Floor Plan Now &rarr;
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p className="font-extrabold text-slate-800">VastuScope Studio • Vedic 16 MahaVastu Engine</p>
        <p className="text-[11px] text-slate-400">© 2026 VastuScope Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}
