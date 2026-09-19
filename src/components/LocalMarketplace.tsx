import React, { useState } from 'react';
import { 
  UserCheck, 
  Star, 
  ShieldCheck, 
  Languages, 
  ArrowRight, 
  Sparkles, 
  Search, 
  MapPin,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { usePlanRupee } from '../context/PlanRupeeContext';
import { Local, City } from '../types';
import { VerificationBadge } from './common/Badge';

export const LocalMarketplace: React.FC = () => {
  const { 
    locals, 
    setSelectedLocalForModal, 
    savedLocalIds, 
    toggleSaveLocal, 
    setActiveLocalToBook, 
    setIsLocalBookingModalOpen,
    currentCity,
    setCurrentCity
  } = usePlanRupee();

  const [selectedCityFilter, setSelectedCityFilter] = useState<'All' | City>('All');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('All');

  const allExpertiseTags = [
    'All',
    'Food',
    'Cafés',
    'Hidden Gems',
    'Heritage',
    'Architecture',
    'GT Road Dhabas',
    'Textile Markets',
    'Shopping',
    'Photography'
  ];

  const filteredLocals = locals.filter(local => {
    const matchesCity = selectedCityFilter === 'All' || local.city === selectedCityFilter;
    const matchesExpertise = selectedExpertise === 'All' || local.expertise.some(e => e.toLowerCase().includes(selectedExpertise.toLowerCase()));
    return matchesCity && matchesExpertise;
  });

  return (
    <section id="locals" className="py-20 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-neutral-200 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider">
              <UserCheck size={13} className="text-neutral-900" />
              <span>Package 02 • Community Consultation</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-950 font-display tracking-tight uppercase">
              MEET YOUR LOCAL
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 max-w-xl">
              Talk to verified residents born and raised in the city. Get tailored recommendations, hidden gems, and real-time guidance.
            </p>
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {(['All', 'Chandigarh', 'Patiala', 'Rajpura'] as ('All' | City)[]).map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCityFilter(city)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  selectedCityFilter === city
                    ? 'bg-neutral-950 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Expertise Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-2 shrink-0">Filter:</span>
          {allExpertiseTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedExpertise(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedExpertise === tag
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Locals Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredLocals.map((local) => {
            const isSaved = savedLocalIds.includes(local.id);

            return (
              <div 
                key={local.id}
                className="bg-white rounded-3xl border border-neutral-200 hover:border-neutral-950 transition-all flex flex-col justify-between overflow-hidden shadow-subtle hover:shadow-card group"
              >
                <div>
                  
                  {/* Large Portrait */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                    <img 
                      src={local.avatar} 
                      alt={local.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                        <MapPin size={10} />
                        <span>{local.city}</span>
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveLocal(local.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition ${
                        isSaved ? 'bg-neutral-950 text-white' : 'bg-white/80 text-neutral-700 hover:bg-white'
                      }`}
                      title={isSaved ? 'Saved' : 'Save local'}
                    >
                      {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>

                    {/* Bottom Floating Rating & Verified Badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-neutral-950 flex items-center gap-1 shadow-sm">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span>{local.rating}</span>
                        <span className="text-[10px] text-neutral-400">({local.reviewCount})</span>
                      </div>

                      <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <ShieldCheck size={11} />
                        <span>Verified Local</span>
                      </span>
                    </div>

                  </div>

                  {/* Profile Details */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-lg font-black text-neutral-950 font-display group-hover:underline">
                        {local.name}
                      </h3>
                      <div className="text-xs text-neutral-500 line-clamp-1">
                        {local.title}
                      </div>
                    </div>

                    <div className="text-xs text-neutral-600 font-medium">
                      ✓ {local.travelersHelped} travelers helped
                    </div>

                    {/* Languages */}
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                      <Languages size={12} className="text-neutral-400" />
                      <span>{local.languages.join(' • ')}</span>
                    </div>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {local.expertise.slice(0, 3).map((exp) => (
                        <span key={exp} className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-semibold">
                          {exp}
                        </span>
                      ))}
                      {local.expertise.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-neutral-50 text-neutral-400 text-[10px]">
                          +{local.expertise.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Card Bottom CTA */}
                <div className="p-5 pt-0 border-t border-neutral-100 flex items-center justify-between mt-2">
                  <div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Consultation</div>
                    <div className="text-base font-black text-neutral-950">₹{local.consultationFee}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedLocalForModal(local)}
                      className="px-4 py-2 rounded-full border border-neutral-300 hover:border-neutral-950 text-xs font-bold text-neutral-800 transition"
                    >
                      VIEW LOCAL
                    </button>
                    <button
                      onClick={() => {
                        setActiveLocalToBook(local);
                        setIsLocalBookingModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold transition shadow-sm"
                    >
                      CONSULT
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
