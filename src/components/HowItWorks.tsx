import React from 'react';
import { Compass, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Tell us where you are going.',
      desc: 'Pick your city, dates and trip vibe.'
    },
    {
      num: '02',
      title: 'Choose your style.',
      desc: 'Roadmap, local or concierge.'
    },
    {
      num: '03',
      title: 'Get your plan.',
      desc: 'Clear, local-first recommendations.'
    },
    {
      num: '04',
      title: 'Review and improve.',
      desc: 'Your experience helps the next traveler.'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-neutral-400">
            Simple process
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-neutral-950 font-display tracking-tightest">
            How it works.
          </h2>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s) => (
            <div 
              key={s.num}
              className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 hover:border-neutral-950 transition-all flex flex-col justify-between space-y-6 group shadow-subtle hover:shadow-card"
            >
              <div className="space-y-4">
                <span className="text-4xl font-black text-neutral-950 font-display block">
                  {s.num}
                </span>
                <h3 className="text-lg font-black text-neutral-950 font-display leading-snug">
                  {s.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-200 text-[11px] font-bold text-neutral-400 group-hover:text-neutral-950 transition flex items-center gap-1">
                <span>Phase {s.num}</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
