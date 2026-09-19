import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  UserCheck, 
  Layers, 
  ShieldAlert, 
  Menu, 
  X, 
  Bookmark, 
  Headphones,
  ChevronDown
} from 'lucide-react';
import { usePlanRupee } from '../context/PlanRupeeContext';
import { City } from '../types';

interface NavbarProps {
  onOpenDashboard: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDashboard, onScrollToSection }) => {
  const { 
    currentCity, 
    setCurrentCity, 
    setIsBecomeLocalModalOpen, 
    setIsAdminModalOpen,
    savedPlaceIds,
    savedLocalIds,
    myConsultations,
    myConciergeRequests,
    activeRoadmap
  } = usePlanRupee();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const cities: City[] = ['Chandigarh', 'Patiala', 'Rajpura'];

  const totalSavedCount = savedPlaceIds.length + savedLocalIds.length;
  const activeBookingsCount = myConsultations.length + myConciergeRequests.length;

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    onScrollToSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-left group"
            >
              <span className="text-2xl sm:text-3xl font-black tracking-tightest font-display text-neutral-950 group-hover:text-neutral-700 transition">
                PlanRupee
              </span>
              <span className="block text-[9px] sm:text-[10px] font-bold text-neutral-400 -mt-1">
                Plan less. Experience more.
              </span>
            </button>

            {/* City Selector Pill */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-800 transition"
              >
                <MapPin size={13} className="text-neutral-500" />
                <span>{currentCity}</span>
                <ChevronDown size={13} className="text-neutral-400" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-neutral-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                    MVP Scope
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setCurrentCity(city);
                        setIsCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between transition ${
                        currentCity === city ? 'bg-neutral-900 text-white font-semibold' : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{city}</span>
                      {currentCity === city && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-neutral-600">
            <button 
              onClick={() => handleNavClick('discover')}
              className="hover:text-neutral-950 transition"
            >
              Discover
            </button>
            <button 
              onClick={() => handleNavClick('roadmap')}
              className="hover:text-neutral-950 transition flex items-center gap-1.5"
            >
              <span>Roadmap</span>
              {activeRoadmap && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
            <button 
              onClick={() => handleNavClick('locals')}
              className="hover:text-neutral-950 transition"
            >
              Locals
            </button>
            <button 
              onClick={() => handleNavClick('concierge')}
              className="hover:text-neutral-950 transition flex items-center gap-1"
            >
              <span>Concierge</span>
              <span className="text-[9px] bg-neutral-900 text-white px-1.5 py-0.5 rounded-full font-bold">5★</span>
            </button>
            <button 
              onClick={() => handleNavClick('how-it-works')}
              className="hover:text-neutral-950 transition"
            >
              How It Works
            </button>
            <button 
              onClick={() => handleNavClick('data-loop')}
              className="hover:text-neutral-950 transition text-neutral-500"
            >
              Data Loop
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Become a Local CTA */}
            <button
              onClick={() => setIsBecomeLocalModalOpen(true)}
              className="text-xs font-semibold px-3 py-2 text-neutral-700 hover:text-neutral-950 transition border border-transparent hover:border-neutral-200 rounded-xl"
            >
              Become a Local
            </button>

            {/* My Trips Dashboard Button */}
            <button
              onClick={onOpenDashboard}
              className="relative p-2 rounded-xl text-neutral-700 hover:bg-neutral-100 transition border border-neutral-200"
              title="My Trips & Dashboard"
            >
              <Bookmark size={18} />
              {(totalSavedCount > 0 || activeBookingsCount > 0) && (
                <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalSavedCount + activeBookingsCount}
                </span>
              )}
            </button>

            {/* Admin Portal Toggle */}
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition border border-neutral-200"
              title="Admin Portal (Demo / Verification Management)"
            >
              <ShieldAlert size={18} />
            </button>

            {/* Primary Get Started Button */}
            <button
              onClick={() => handleNavClick('trip-planner')}
              className="px-5 py-2.5 rounded-full bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition shadow-sm"
            >
              Plan My Trip
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenDashboard}
              className="p-2 rounded-lg text-neutral-700 border border-neutral-200"
            >
              <Bookmark size={18} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-900 border border-neutral-200"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-5 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Current City</span>
            <div className="flex gap-1">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setCurrentCity(city)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    currentCity === city ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <button onClick={() => handleNavClick('discover')} className="p-3 text-left rounded-xl bg-neutral-50 hover:bg-neutral-100">
              Discover {currentCity}
            </button>
            <button onClick={() => handleNavClick('roadmap')} className="p-3 text-left rounded-xl bg-neutral-50 hover:bg-neutral-100">
              My Roadmap
            </button>
            <button onClick={() => handleNavClick('locals')} className="p-3 text-left rounded-xl bg-neutral-50 hover:bg-neutral-100">
              Meet Locals
            </button>
            <button onClick={() => handleNavClick('concierge')} className="p-3 text-left rounded-xl bg-neutral-50 hover:bg-neutral-100">
              5★ Concierge
            </button>
            <button onClick={() => handleNavClick('how-it-works')} className="p-3 text-left rounded-xl bg-neutral-50 hover:bg-neutral-100">
              How It Works
            </button>
            <button onClick={() => handleNavClick('data-loop')} className="p-3 text-left rounded-xl bg-neutral-50 hover:bg-neutral-100">
              Data Loop
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsBecomeLocalModalOpen(true);
              }}
              className="w-full py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold text-neutral-800"
            >
              Become a Verified Local
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAdminModalOpen(true);
              }}
              className="w-full py-2 rounded-xl text-xs font-semibold text-neutral-500 bg-neutral-50"
            >
              Admin & Data Moderation
            </button>
            <button
              onClick={() => handleNavClick('trip-planner')}
              className="w-full py-3 rounded-full bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider"
            >
              Plan My Trip
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
