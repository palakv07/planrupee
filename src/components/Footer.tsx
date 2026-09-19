import React from 'react';
import { 
  Globe, 
  Share2, 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  ArrowUp,
  Heart
} from 'lucide-react';
import { usePlanRupee } from '../context/PlanRupeeContext';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenBecomeLocal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection, onOpenBecomeLocal }) => {
  const { setCurrentCity } = usePlanRupee();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white text-neutral-900 border-t border-neutral-200 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="text-3xl font-black font-display tracking-tightest text-neutral-950">
                PLANRUPEE
              </span>
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mt-0.5">
                PLAN LESS. EXPERIENCE MORE.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 max-w-sm leading-relaxed">
              PlanRupee is a personalized travel-planning and local-experience platform. Your trip. Your preferences. Local knowledge. One plan.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#explore" className="p-2.5 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-950 hover:text-white transition" title="Global Network">
                <Globe size={15} />
              </a>
              <a href="#share" className="p-2.5 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-950 hover:text-white transition" title="Share Experience">
                <Share2 size={15} />
              </a>
              <a href="#community" className="p-2.5 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-950 hover:text-white transition" title="Community Chat">
                <MessageCircle size={15} />
              </a>
            </div>

            <div className="pt-2 text-[11px] text-neutral-500 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Strict MVP Scope: Chandigarh • Patiala • Rajpura</span>
            </div>
          </div>

          {/* Navigation Links: Packages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              The 3 Packages
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600 font-medium">
              <li>
                <button onClick={() => onScrollToSection('roadmap')} className="hover:text-neutral-950 transition">
                  01 Roadmap Generator
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('locals')} className="hover:text-neutral-950 transition">
                  02 Verified Locals
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('concierge')} className="hover:text-neutral-950 transition">
                  03 Five-Star Concierge
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('pricing')} className="hover:text-neutral-950 transition">
                  Package Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              MVP Destinations
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600 font-medium">
              <li>
                <button 
                  onClick={() => {
                    setCurrentCity('Chandigarh');
                    onScrollToSection('discover');
                  }} 
                  className="hover:text-neutral-950 transition"
                >
                  Discover Chandigarh
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setCurrentCity('Patiala');
                    onScrollToSection('discover');
                  }} 
                  className="hover:text-neutral-950 transition"
                >
                  Discover Patiala
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setCurrentCity('Rajpura');
                    onScrollToSection('discover');
                  }} 
                  className="hover:text-neutral-950 transition"
                >
                  Discover Rajpura
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('data-loop')} className="hover:text-neutral-950 transition">
                  Community Data Loop
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Local Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Community & Guides
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600 font-medium">
              <li>
                <button onClick={onOpenBecomeLocal} className="hover:text-neutral-950 transition font-bold text-neutral-900">
                  Become a Local
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('how-it-works')} className="hover:text-neutral-950 transition">
                  How PlanRupee Works
                </button>
              </li>
              <li>
                <a href="#about" className="hover:text-neutral-950 transition">
                  About PlanRupee
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-neutral-950 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-neutral-950 transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} PLANRUPEE Inc. Designed for authentic local travel experiences.
          </div>

          <div className="flex items-center gap-6">
            <span>Not a flight/hotel booking agency.</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition flex items-center gap-1.5"
            >
              <span>Back to Top</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
