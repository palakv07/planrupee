import React from 'react';
import { Check, ArrowRight, Sparkles, Map, UserCheck, ShieldCheck } from 'lucide-react';

interface PricingSectionProps {
  onSelectPackage: (pkg: 'roadmap' | 'local' | 'concierge') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPackage }) => {
  return (
    <section id="pricing" className="py-24 bg-neutral-50/50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-neutral-400">
            Straightforward pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-neutral-950 font-display tracking-tightest">
            One plan. Three ways to travel.
          </h2>
        </div>


      </div>
    </section>
  );
};
