import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Bookmark, 
  BookmarkCheck, 
  RefreshCw, 
  Trash2, 
  Plus, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Printer, 
  Share2, 
  Compass, 
  AlertCircle,
  X,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { usePlanRupee } from '../context/PlanRupeeContext';
import { RoadmapDay, RoadmapActivity, Place } from '../types';
import { VerificationBadge } from './common/Badge';

export const RoadmapSection: React.FC = () => {
  const { 
    activeRoadmap, 
    savedPlaceIds, 
    toggleSavePlace, 
    updateRoadmapActivity, 
    removeRoadmapActivity, 
    addRoadmapActivity,
    optimizeDay,
    places,
    currentCity,
    setSelectedPlaceForModal,
    setIsReviewModalOpen,
    setActivePlaceToReview
  } = usePlanRupee();

  // Active expanded day tab (or expanded days map)
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [collapsedDays, setCollapsedDays] = useState<Record<number, boolean>>({});
  
  // Replace Place Modal State
  const [replacingActivity, setReplacingActivity] = useState<{ dayNumber: number; activity: RoadmapActivity } | null>(null);
  // Add Place Modal State
  const [addingActivityDay, setAddingActivityDay] = useState<number | null>(null);
  const [addingSlot, setAddingSlot] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Dinner'>('Afternoon');
  const [notification, setNotification] = useState<string | null>(null);

  if (!activeRoadmap) {
    return (
      <section id="roadmap" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl font-black">NO ACTIVE ROADMAP</h2>
          <p className="text-neutral-500 text-sm">Please generate a roadmap using the Trip Planner above.</p>
        </div>
      </section>
    );
  }

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleCollapse = (dayNum: number) => {
    setCollapsedDays(prev => ({
      ...prev,
      [dayNum]: !prev[dayNum]
    }));
  };

  const handleOptimize = (dayNum: number) => {
    optimizeDay(dayNum);
    showToast(`Day ${dayNum} travel sequence & timing optimized!`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Roadmap link copied to clipboard!');
    }
  };

  // Filter available alternative places for replacement
  const availableAlternatives = places.filter(p => p.city === activeRoadmap.city);

  return (
    <section id="roadmap" className="py-20 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Toast Notification */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-950 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Roadmap Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-neutral-200 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider">
              <Compass size={13} className="text-neutral-900" />
              <span>Personalized Itinerary 01</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-950 font-display tracking-tight">
              Your PlanRupee roadmap
            </h2>
            <div className="text-sm sm:text-base font-semibold text-neutral-600">
              {activeRoadmap.title} • {activeRoadmap.travelers} Travelers • {activeRoadmap.budget} Tier
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="px-4 py-2.5 rounded-full border border-neutral-300 hover:border-neutral-950 text-xs font-semibold text-neutral-800 transition flex items-center gap-2"
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-full border border-neutral-300 hover:border-neutral-950 text-xs font-semibold text-neutral-800 transition flex items-center gap-2"
            >
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {activeRoadmap.days.map((day) => {
            const isSelected = selectedDayNumber === day.dayNumber;
            return (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayNumber(day.dayNumber)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <span>DAY 0{day.dayNumber}</span>
                <span className={`text-[11px] font-normal ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  ({day.activities.length} stops)
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Day Content */}
        {activeRoadmap.days.filter(d => d.dayNumber === selectedDayNumber).map((day) => {
          const isCollapsed = collapsedDays[day.dayNumber] || false;

          return (
            <div key={day.dayNumber} className="bg-neutral-50/50 rounded-4xl border border-neutral-200 p-6 sm:p-10 space-y-8">
              
              {/* Day Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black tracking-widest uppercase text-neutral-400">
                      DAY 0{day.dayNumber}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-800">
                      {activeRoadmap.city}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-neutral-950 font-display mt-1">
                    {day.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                    {day.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleOptimize(day.dayNumber)}
                    className="px-4 py-2.5 rounded-full bg-white hover:bg-neutral-100 border border-neutral-300 text-xs font-bold text-neutral-900 transition flex items-center gap-1.5 shadow-sm"
                    title="Intelligently reorganize by distance and opening hours"
                  >
                    <SlidersHorizontal size={14} className="text-neutral-700" />
                    <span>Optimize My Day</span>
                  </button>

                  <button
                    onClick={() => {
                      setAddingActivityDay(day.dayNumber);
                    }}
                    className="px-4 py-2.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus size={14} />
                    <span>Add Place</span>
                  </button>

                  <button
                    onClick={() => toggleCollapse(day.dayNumber)}
                    className="p-2.5 rounded-full bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition"
                    title={isCollapsed ? 'Expand Day' : 'Collapse Day'}
                  >
                    {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                  </button>
                </div>
              </div>

              {/* Day Vertical Timeline Activities */}
              {!isCollapsed && (
                <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-neutral-300 space-y-10 my-4">
                  
                  {day.activities.map((activity, index) => {
                    const isSaved = savedPlaceIds.includes(activity.placeId);
                    const matchingPlace = places.find(p => p.id === activity.placeId);

                    return (
                      <div key={activity.id} className="relative group">
                        
                        {/* Timeline Node Dot */}
                        <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-5 h-5 rounded-full bg-white border-4 border-neutral-950 shadow-sm" />

                        {/* Distance & Travel Time indicator from previous */}
                        {index > 0 && (
                          <div className="-mt-6 mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200/70 text-neutral-700 text-[11px] font-semibold">
                            <Clock size={11} />
                            <span>{activity.distanceFromPrevious}</span>
                          </div>
                        )}

                        {/* Location Card */}
                        <div className="bg-white rounded-3xl border border-neutral-200 hover:border-neutral-900 transition-all p-5 sm:p-7 shadow-subtle hover:shadow-card">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                            
                            {/* Card Image */}
                            <div className="md:col-span-4 relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100">
                              <img 
                                src={activity.image} 
                                alt={activity.placeName} 
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                              />
                              <div className="absolute top-3 left-3">
                                <span className="px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                                  {activity.timeSlot}
                                </span>
                              </div>
                              {matchingPlace && (
                                <div className="absolute bottom-3 left-3">
                                  <VerificationBadge status={matchingPlace.verificationStatus} size="sm" />
                                </div>
                              )}
                            </div>

                            {/* Card Details */}
                            <div className="md:col-span-8 space-y-4">
                              
                              {/* Header & Actions */}
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                                    {activity.category}
                                  </span>
                                  <h4 
                                    onClick={() => matchingPlace && setSelectedPlaceForModal(matchingPlace)}
                                    className="text-xl sm:text-2xl font-black text-neutral-950 font-display cursor-pointer hover:underline"
                                  >
                                    {activity.placeName}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-1">
                                  {/* Save Place */}
                                  <button
                                    onClick={() => toggleSavePlace(activity.placeId)}
                                    className={`p-2 rounded-xl border transition ${
                                      isSaved 
                                        ? 'bg-neutral-950 text-white border-neutral-950' 
                                        : 'bg-white text-neutral-500 border-neutral-200 hover:text-neutral-900 hover:border-neutral-400'
                                    }`}
                                    title={isSaved ? 'Saved to your profile' : 'Save place'}
                                  >
                                    {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                                  </button>

                                  {/* Replace Place with Curated Alternative */}
                                  <button
                                    onClick={() => setReplacingActivity({ dayNumber: day.dayNumber, activity })}
                                    className="p-2 rounded-xl bg-white text-neutral-500 border border-neutral-200 hover:text-neutral-900 hover:border-neutral-400 transition"
                                    title="Replace with alternative spot"
                                  >
                                    <RefreshCw size={16} />
                                  </button>

                                  {/* Remove Activity */}
                                  <button
                                    onClick={() => removeRoadmapActivity(day.dayNumber, activity.id)}
                                    className="p-2 rounded-xl bg-white text-neutral-400 border border-neutral-200 hover:text-red-600 hover:border-red-200 transition"
                                    title="Remove from itinerary"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>

                              {/* Rating & Operational Specs */}
                              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-neutral-600">
                                <div className="flex items-center gap-1 font-bold text-neutral-900">
                                  <Star size={13} className="text-amber-500 fill-amber-500" />
                                  <span>{activity.rating}</span>
                                  <span className="text-neutral-400 font-normal">({activity.reviewCount} reviews)</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Clock size={13} className="text-neutral-400" />
                                  <span>{activity.estimatedDuration}</span>
                                </div>
                                <span>•</span>
                                <div className="font-semibold text-neutral-800">
                                  Approx. ₹{activity.approxCostInr}
                                </div>
                                <span>•</span>
                                <div className="text-neutral-500">
                                  {activity.openingHours}
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                                {activity.shortDescription}
                              </p>

                              {/* WHY PLANRUPEE RECOMMENDS THIS */}
                              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs space-y-1">
                                <div className="font-bold text-neutral-950 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                                  <Sparkles size={12} className="text-neutral-900" />
                                  <span>WHY PLANRUPEE RECOMMENDS THIS</span>
                                </div>
                                <p className="text-neutral-700 italic font-medium leading-relaxed">
                                  "{activity.whyPlanRupeeRecommends}"
                                </p>
                              </div>

                              {/* Footer Actions on Place Card */}
                              <div className="pt-2 flex items-center justify-between text-xs">
                                <button
                                  onClick={() => matchingPlace && setSelectedPlaceForModal(matchingPlace)}
                                  className="font-bold text-neutral-950 hover:underline"
                                >
                                  View Place Details & Reviews →
                                </button>

                                <button
                                  onClick={() => {
                                    if (matchingPlace) {
                                      setActivePlaceToReview(matchingPlace);
                                      setIsReviewModalOpen(true);
                                    }
                                  }}
                                  className="text-neutral-500 hover:text-neutral-900 text-xs font-semibold"
                                >
                                  + Leave Verified Review
                                </button>
                              </div>

                            </div>

                          </div>
                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

            </div>
          );
        })}

      </div>

      {/* REPLACE PLACE MODAL */}
      {replacingActivity && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Roadmap Customization</span>
                <h3 className="text-xl font-black text-neutral-950 font-display">
                  Replace: {replacingActivity.activity.placeName}
                </h3>
              </div>
              <button 
                onClick={() => setReplacingActivity(null)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <p className="text-xs text-neutral-500">
                Select an alternative place in <span className="font-bold text-neutral-900">{activeRoadmap.city}</span> to take this time slot:
              </p>

              <div className="grid grid-cols-1 gap-3">
                {availableAlternatives
                  .filter(p => p.id !== replacingActivity.activity.placeId)
                  .map((altPlace) => (
                    <div 
                      key={altPlace.id}
                      className="p-4 rounded-2xl border border-neutral-200 hover:border-neutral-950 transition flex items-center justify-between gap-4 bg-white"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={altPlace.images[0]} 
                          alt={altPlace.name} 
                          className="w-14 h-14 rounded-xl object-cover shrink-0" 
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-neutral-950 truncate">{altPlace.name}</span>
                            <VerificationBadge status={altPlace.verificationStatus} size="sm" />
                          </div>
                          <div className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5">
                            <span>{altPlace.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-neutral-800 font-semibold">
                              <Star size={11} className="text-amber-500 fill-amber-500" />
                              {altPlace.rating}
                            </span>
                            <span>•</span>
                            <span>₹{altPlace.approxCostInr}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          updateRoadmapActivity(replacingActivity.dayNumber, replacingActivity.activity.id, altPlace);
                          setReplacingActivity(null);
                          showToast(`Replaced with ${altPlace.name}!`);
                        }}
                        className="px-4 py-2 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold shrink-0 transition"
                      >
                        Choose Place
                      </button>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ADD PLACE MODAL */}
      {addingActivityDay !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Add Stop to Day {addingActivityDay}</span>
                <h3 className="text-xl font-black text-neutral-950 font-display">
                  Select Place to Add
                </h3>
              </div>
              <button 
                onClick={() => setAddingActivityDay(null)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Target Time Slot
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Morning', 'Afternoon', 'Evening', 'Dinner'] as const).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setAddingSlot(slot)}
                      className={`py-2 text-xs font-bold rounded-xl transition ${
                        addingSlot === slot ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Choose from {activeRoadmap.city}
                </label>

                <div className="space-y-2.5">
                  {availableAlternatives.map((altPlace) => (
                    <div 
                      key={altPlace.id}
                      className="p-3.5 rounded-2xl border border-neutral-200 hover:border-neutral-950 transition flex items-center justify-between gap-4 bg-white"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={altPlace.images[0]} 
                          alt={altPlace.name} 
                          className="w-12 h-12 rounded-xl object-cover shrink-0" 
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-neutral-950 truncate">{altPlace.name}</div>
                          <div className="text-xs text-neutral-500 flex items-center gap-2">
                            <span>{altPlace.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 font-bold text-neutral-800">
                              <Star size={11} className="text-amber-500 fill-amber-500" />
                              {altPlace.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addRoadmapActivity(addingActivityDay, altPlace, addingSlot);
                          setAddingActivityDay(null);
                          showToast(`Added ${altPlace.name} to Day ${addingActivityDay}!`);
                        }}
                        className="px-4 py-2 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold shrink-0 transition"
                      >
                        Add to Roadmap
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
