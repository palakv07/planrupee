import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Star, 
  Bookmark, 
  BookmarkCheck, 
  Plus, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { usePlanRupee } from '../context/PlanRupeeContext';
import { City, PlaceCategory, Place } from '../types';
import { VerificationBadge } from './common/Badge';

export const DiscoverSection: React.FC = () => {
  const { 
    currentCity, 
    setCurrentCity, 
    places, 
    setSelectedPlaceForModal,
    savedPlaceIds, 
    toggleSavePlace,
    addRoadmapActivity,
    activeRoadmap
  } = usePlanRupee();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const categories = [
    'All',
    'Food',
    'Café',
    'Heritage',
    'Shopping',
    'Nature',
    'Spiritual',
    'Hidden Gem'
  ];

  const filteredPlaces = places.filter(place => {
    const matchesCity = place.city === currentCity;
    const matchesCat = selectedCategory === 'All' || place.category === selectedCategory;
    return matchesCity && matchesCat;
  });

  const handleQuickAdd = (e: React.MouseEvent, place: Place) => {
    e.stopPropagation();
    if (!activeRoadmap) {
      setToastMsg('Please generate a roadmap above first!');
      setTimeout(() => setToastMsg(null), 2500);
      return;
    }
    addRoadmapActivity(1, place, 'Afternoon');
    setToastMsg(`Added ${place.name} to Day 1!`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <section id="discover" className="py-24 bg-neutral-50/40 border-b border-neutral-200 relative">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-950 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl animate-in fade-in duration-150">
          {toastMsg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header & City Tabs (Section 24) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-neutral-200 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200/70 text-neutral-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} className="text-neutral-900" />
              <span>Real World Place Directory</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-neutral-950 font-display tracking-tightest">
              Discover {currentCity}
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 max-w-xl">
              Authentic architecture, iconic culinary institutions, artisan markets, and quiet corners recommended by local residents.
            </p>
          </div>

          {/* City Toggle Buttons */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-neutral-200/60 border border-neutral-300/60 shrink-0">
            {(['Chandigarh', 'Patiala', 'Rajpura'] as City[]).map((city) => (
              <button
                key={city}
                onClick={() => setCurrentCity(city)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                  currentCity === city
                    ? 'bg-white text-neutral-950 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <Filter size={14} className="text-neutral-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-neutral-950 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Editorial Bento Grid (Section 24 & 33) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place, idx) => {
            const isSaved = savedPlaceIds.includes(place.id);
            const isLarge = idx % 5 === 0;

            return (
              <div
                key={place.id}
                onClick={() => setSelectedPlaceForModal(place)}
                className={`group bg-white rounded-3xl border border-neutral-200 hover:border-neutral-950 overflow-hidden cursor-pointer shadow-subtle hover:shadow-card transition-all flex flex-col justify-between ${
                  isLarge ? 'md:col-span-2' : ''
                }`}
              >
                <div>
                  {/* Large Image */}
                  <div className={`relative overflow-hidden bg-neutral-100 ${isLarge ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
                    <img 
                      src={place.images[0]} 
                      alt={place.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700" 
                    />

                    {/* Verification Status Badge (Section 17 requirement) */}
                    <div className="absolute top-3 left-3">
                      <VerificationBadge status={place.verificationStatus} size="sm" />
                    </div>

                    {/* Bookmark action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSavePlace(place.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition ${
                        isSaved ? 'bg-neutral-950 text-white' : 'bg-white/80 text-neutral-700 hover:bg-white'
                      }`}
                      title={isSaved ? 'Saved' : 'Save place'}
                    >
                      {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>

                    {/* Bottom Category Overlay */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                        {place.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-neutral-950 text-xs font-bold flex items-center gap-1 shadow">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span>{place.rating}</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-neutral-950 font-display group-hover:underline">
                          {place.name}
                        </h3>
                        <div className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                          {place.address}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                      {place.description}
                    </p>

                    {/* "Recommended by X locals" (Section 24 requirement) */}
                    <div className="flex items-center gap-2 pt-2 text-xs">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[11px]">
                        ✓ Recommended by {place.localRecommendationsCount} locals
                      </span>
                      <span className="text-neutral-400 font-medium text-[11px]">
                        {place.reviewCount} verified reviews
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Bar */}
                <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <div className="font-semibold text-neutral-700">
                    Est. ₹{place.approxCostInr} • {place.estimatedDuration}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleQuickAdd(e, place)}
                      className="px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-950 hover:text-white text-neutral-800 text-xs font-bold transition flex items-center gap-1"
                      title="Add to Day 1 of Roadmap"
                    >
                      <Plus size={13} />
                      <span>Add</span>
                    </button>
                    <span className="text-neutral-950 font-bold group-hover:translate-x-0.5 transition">
                      Details →
                    </span>
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
