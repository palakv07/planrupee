import React, { useState } from 'react';
import { 
  RefreshCw, 
  User, 
  Map, 
  Compass, 
  Star, 
  Database, 
  ArrowDown, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck,
  Layers
} from 'lucide-react';

export const DataLoopSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const steps = [
    {
      step: '01',
      title: 'Traveler',
      subtitle: 'Set your trip',
      desc: 'Dates, city, budget, mood and pace.',
      icon: User,
      metric: 'Real intent'
    },
    {
      step: '02',
      title: 'Choose a plan',
      subtitle: 'Roadmap, local or concierge',
      desc: 'Pick the level of help you want.',
      icon: Map,
      metric: '3 options'
    },
    {
      step: '03',
      title: 'Experience the city',
      subtitle: 'Eat, walk, explore',
      desc: 'See the places people actually love.',
      icon: Compass,
      metric: 'Ground reality'
    },
    {
      step: '04',
      title: 'Leave a review',
      subtitle: 'Verified feedback',
      desc: 'Helps improve the next trip.',
      icon: Star,
      metric: 'Better data'
    },
    {
      step: '05',
      title: 'Update the loop',
      subtitle: 'Live recommendations',
      desc: 'The best places rise to the top.',
      icon: Database,
      metric: 'Always refining'
    },
    {
      step: '06',
      title: 'Better trips next time',
      subtitle: 'Smarter future visits',
      desc: 'The community keeps getting sharper.',
      icon: TrendingUp,
      metric: 'Continuous growth'
    }
  ];

  return (
    <section id="data-loop" className="py-24 bg-neutral-950 text-white relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-neutral-900 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Header (Section 23) */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <RefreshCw size={13} className="animate-spin text-amber-400" />
            <span>The PlanRupee Data Loop</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tightest leading-tight text-white">
            EVERY TRIP MAKES
            <br />
            <span className="text-neutral-400">THE NEXT ONE BETTER.</span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl mx-auto">
            Traditional travel booking sites rely on unverified sponsored listings. PlanRupee builds an autonomous, self-improving community loop powered by verified visits and local expertise.
          </p>
        </div>

        {/* Step-by-Step Interactive Flow Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            const isHovered = activeStepIndex === idx;

            return (
              <div
                key={item.step}
                onMouseEnter={() => setActiveStepIndex(idx)}
                className={`p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isHovered
                    ? 'bg-neutral-900 border-white shadow-2xl scale-[1.02]'
                    : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest text-neutral-500 font-mono">
                      PHASE {item.step}
                    </span>
                    <div className={`p-2 rounded-xl transition ${
                      isHovered ? 'bg-white text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      <Icon size={18} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black font-display text-white tracking-wide">
                      {item.title}
                    </h3>
                    <div className="text-xs font-semibold text-neutral-400 mt-0.5">
                      {item.subtitle}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500 font-medium">{item.metric}</span>
                  <span className={`font-bold transition ${isHovered ? 'text-amber-400' : 'text-neutral-600'}`}>
                    Step {idx + 1} of 6 →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* The Core Ecosystem Diagram Box (Section 30) */}
        <div className="bg-neutral-900/80 rounded-3xl border border-neutral-800 p-8 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Section 30 Architecture</span>
              <h3 className="text-xl sm:text-2xl font-black font-display text-white">
                PLANRUPEE CORE ECOSYSTEM
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-emerald-400 font-semibold">
              <ShieldCheck size={16} />
              <span>Verified Data Integrity</span>
            </div>
          </div>

          {/* Diagram horizontal sequence */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 items-center text-center text-xs">
            
            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
              <div className="font-bold text-white">TRAVELER</div>
              <div className="text-[10px] text-neutral-500">Inputs Preferences</div>
            </div>

            <div className="hidden sm:block text-neutral-600 font-bold">→</div>

            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
              <div className="font-bold text-white">3 PACKAGES</div>
              <div className="text-[10px] text-neutral-500">Roadmap • Local • Concierge</div>
            </div>

            <div className="hidden sm:block text-neutral-600 font-bold">→</div>

            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
              <div className="font-bold text-white">PLACES</div>
              <div className="text-[10px] text-neutral-500">Visited & Experienced</div>
            </div>

            <div className="hidden sm:block text-neutral-600 font-bold">→</div>

            <div className="p-3 rounded-2xl bg-white text-neutral-950 font-bold shadow-lg">
              <div>BETTER DATA</div>
              <div className="text-[10px] text-neutral-600">Dynamic Community Lift</div>
            </div>

          </div>

          <div className="text-center pt-2 text-xs text-neutral-400">
            "Real travelers create real feedback. Real feedback creates better local and place ratings. Better ratings create better travel experiences."
          </div>
        </div>

      </div>
    </section>
  );
};
