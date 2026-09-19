import React from 'react';
import { 
  Map, 
  UserCheck, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Compass, 
  Calendar, 
  Clock, 
  Heart, 
  ShieldCheck,
  Star
} from 'lucide-react';

interface PackagesOverviewProps {
  onSelectPackage: (pkg: 'roadmap' | 'local' | 'concierge') => void;
}

export const PackagesOverview: React.FC<PackagesOverviewProps> = ({ onSelectPackage }) => {
  return (
    <section id="packages" className="py-20 bg-neutral-50/50 border-y border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-neutral-400">
            Choose your style
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-neutral-950 font-display tracking-tight">
            Pick the way you move through the city.
          </h2>
        </div>

        {/* The Three Package Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 01 — PLANRUPEE ROADMAP */}
          <div className="bg-white rounded-3xl p-8 border border-neutral-200 hover:border-neutral-950 transition-all flex flex-col justify-between shadow-subtle hover:shadow-card group">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-black tracking-widest text-neutral-400 uppercase">
                  01 — ROADMAP
                </span>
                <span className="p-2.5 rounded-2xl bg-neutral-100 text-neutral-950 group-hover:bg-neutral-950 group-hover:text-white transition">
                  <Map size={20} />
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-neutral-950 font-display">
                  A trip plan that actually fits.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
                  Day-by-day flow built around your dates, mood and budget.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs space-y-2">
                <div className="font-bold text-neutral-900">Built for:</div>
                <div className="grid grid-cols-2 gap-1.5 text-neutral-600 text-[11px]">
                  <div>• Food spots</div>
                  <div>• Hidden gems</div>
                  <div>• Best timings</div>
                  <div>• Local flow</div>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-neutral-700">
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-neutral-950 shrink-0" />
                  <span>Smart day-by-day route</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-neutral-950 shrink-0" />
                  <span>Local food & café picks</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-neutral-950 shrink-0" />
                  <span>Time-aware schedule</span>
                </li>
              </ul>

            </div>

            <div className="pt-8 mt-6 border-t border-neutral-100">
              <button
                onClick={() => onSelectPackage('roadmap')}
                className="w-full py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>BUILD MY ROADMAP</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 02 — PLANRUPEE LOCAL */}
          <div className="bg-white rounded-3xl p-8 border-2 border-neutral-950 transition-all flex flex-col justify-between shadow-card relative group">
            
            <div className="absolute -top-3 left-8 px-3.5 py-0.5 rounded-full bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-wider">
              Verified Local Experts
            </div>

            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-black tracking-widest text-neutral-950 uppercase">
                  02 — LOCAL
                </span>
                <span className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <UserCheck size={20} />
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-neutral-950 font-display">
                  Talk to someone who knows the city.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
                  Verified locals with real recommendations.
                </p>
              </div>

              {/* Local Spotlight Preview: Simran Kaur */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" 
                  alt="Simran Kaur" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-neutral-950 truncate">Simran Kaur</span>
                    <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                  </div>
                  <div className="text-[11px] text-neutral-500">Chandigarh Local • 127 helped</div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-900 mt-0.5">
                    <Star size={11} className="text-amber-500 fill-amber-500" />
                    <span>4.9 (127 verified reviews)</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-neutral-700">
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span>Browse authentic verified local profiles</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span>Check languages & specific neighborhood expertise</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span>View local picks (Best breakfast, hidden sunset)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span>Paid 1-on-1 consultation & custom Q&A</span>
                </li>
              </ul>

            </div>

            <div className="pt-8 mt-6 border-t border-neutral-100">
              <button
                onClick={() => onSelectPackage('local')}
                className="w-full py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md"
              >
                <span>CONSULT A LOCAL</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 03 — PLANRUPEE CONCIERGE */}
          <div className="bg-white rounded-3xl p-8 border border-neutral-200 hover:border-neutral-950 transition-all flex flex-col justify-between shadow-subtle hover:shadow-card group">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-black tracking-widest text-neutral-400 uppercase">
                  03 — CONCIERGE
                </span>
                <span className="p-2.5 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200">
                  <Sparkles size={20} />
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-neutral-950 font-display">
                  Need something handled? We do it.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
                  Dining, booking, surprises and local logistics.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 text-white text-xs space-y-2">
                <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  Example Requests We Handle:
                </div>
                <div className="text-[11px] text-neutral-200 italic space-y-1">
                  <div>"Find me a romantic courtyard dinner tonight."</div>
                  <div>"Book a table at Virgin Courtyard."</div>
                  <div>"Arrange a fresh floral bouquet & birthday cake."</div>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-neutral-700">
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-neutral-950 shrink-0" />
                  <span>Dedicated luxury personal travel concierge</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-neutral-950 shrink-0" />
                  <span>Direct phone & priority coordination</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-neutral-950 shrink-0" />
                  <span>Table reservations, celebrations, photography</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-neutral-950 shrink-0" />
                  <span>Live 5-stage status tracking in your dashboard</span>
                </li>
              </ul>

            </div>

            <div className="pt-8 mt-6 border-t border-neutral-100">
              <button
                onClick={() => onSelectPackage('concierge')}
                className="w-full py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>REQUEST CONCIERGE</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
