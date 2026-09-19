import React, { useState } from 'react';
import { 
  X, 
  Map, 
  UserCheck, 
  Sparkles, 
  Star, 
  Bookmark, 
  Calendar, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { usePlanRupee } from '../context/PlanRupeeContext';
import { Place, Local } from '../types';

interface UserDashboardModalProps {
  onClose: () => void;
  onOpenRoadmap: () => void;
  onOpenConciergeTracker: (reqId: string) => void;
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({ 
  onClose, 
  onOpenRoadmap,
  onOpenConciergeTracker 
}) => {
  const { 
    activeRoadmap, 
    myConsultations, 
    myConciergeRequests, 
    savedPlaceIds, 
    places, 
    savedLocalIds, 
    locals,
    placeReviews,
    toggleSavePlace,
    toggleSaveLocal,
    setSelectedPlaceForModal,
    setSelectedLocalForModal
  } = usePlanRupee();

  const [activeTab, setActiveTab] = useState<
    'roadmaps' | 'consultations' | 'concierge' | 'saved_places' | 'saved_locals' | 'reviews'
  >('roadmaps');

  const savedPlacesList = places.filter(p => savedPlaceIds.includes(p.id));
  const savedLocalsList = locals.filter(l => savedLocalIds.includes(l.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl sm:rounded-4xl max-w-4xl w-full my-8 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Section 26 • Traveler Workspace</span>
            <h3 className="text-xl sm:text-2xl font-black text-neutral-950 font-display">
              MY TRAVEL DASHBOARD
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Horizontal Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-6 py-2 border-b border-neutral-100 bg-neutral-50/60">
          <button
            onClick={() => setActiveTab('roadmaps')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'roadmaps' ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            My Roadmaps ({activeRoadmap ? 1 : 0})
          </button>

          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'consultations' ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Local Consultations ({myConsultations.length})
          </button>

          <button
            onClick={() => setActiveTab('concierge')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'concierge' ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            5★ Concierge ({myConciergeRequests.length})
          </button>

          <button
            onClick={() => setActiveTab('saved_places')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'saved_places' ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Saved Places ({savedPlacesList.length})
          </button>

          <button
            onClick={() => setActiveTab('saved_locals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'saved_locals' ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Saved Locals ({savedLocalsList.length})
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'reviews' ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            My Reviews ({placeReviews.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: ROADMAPS */}
          {activeTab === 'roadmaps' && (
            <div className="space-y-4">
              {activeRoadmap ? (
                <div className="p-6 rounded-3xl border-2 border-neutral-950 bg-white space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-400">
                      Active Itinerary
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      Ready to Explore
                    </span>
                  </div>

                  <div>
                    <h4 className="text-2xl font-black text-neutral-950 font-display">
                      {activeRoadmap.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                      {activeRoadmap.tagline}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-semibold uppercase">City</span>
                      <span className="font-bold text-neutral-900">{activeRoadmap.city}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Duration</span>
                      <span className="font-bold text-neutral-900">{activeRoadmap.totalDays} Days</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Travelers</span>
                      <span className="font-bold text-neutral-900">{activeRoadmap.travelers}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Budget</span>
                      <span className="font-bold text-neutral-900">{activeRoadmap.budget}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenRoadmap();
                      }}
                      className="px-6 py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition flex items-center gap-2"
                    >
                      <span>Open Interactive Timeline</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-400 text-sm">
                  No active roadmaps yet. Use the homepage planner to generate one!
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONSULTATIONS */}
          {activeTab === 'consultations' && (
            <div className="space-y-4">
              {myConsultations.length > 0 ? (
                myConsultations.map((cons) => (
                  <div key={cons.id} className="p-5 rounded-3xl border border-neutral-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-subtle">
                    <div className="flex items-center gap-4">
                      <img src={cons.localAvatar} alt={cons.localName} className="w-14 h-14 rounded-2xl object-cover" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-neutral-950">{cons.localName}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                            {cons.status}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          {cons.city} • {cons.date} at {cons.time} ({cons.travelers} travelers)
                        </div>
                        <p className="text-xs text-neutral-700 italic mt-1 line-clamp-1">
                          "{cons.question}"
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-neutral-950">₹{cons.consultationFee}</div>
                      <span className="text-[10px] text-neutral-400">Paid Session</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-neutral-400 text-sm">
                  You have not booked any local consultations yet. Visit the "Locals" section to talk to someone who knows the city.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONCIERGE REQUESTS */}
          {activeTab === 'concierge' && (
            <div className="space-y-4">
              {myConciergeRequests.length > 0 ? (
                myConciergeRequests.map((req) => (
                  <div key={req.id} className="p-5 rounded-3xl border border-neutral-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-subtle">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-neutral-950 text-white text-[10px] font-bold uppercase">
                          {req.category}
                        </span>
                        <span className="text-xs text-neutral-500 font-semibold">{req.city} • {req.timing}</span>
                      </div>
                      <p className="font-bold text-sm text-neutral-950 line-clamp-1">
                        "{req.query}"
                      </p>
                      <div className="text-xs text-neutral-500 flex items-center gap-2">
                        <span>Status: <strong className="text-neutral-900">{req.status.replace('_', ' ')}</strong></span>
                        <span>•</span>
                        <span>{req.updates.length} updates logged</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenConciergeTracker(req.id);
                      }}
                      className="px-4 py-2 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold transition shrink-0"
                    >
                      Track Request →
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-neutral-400 text-sm">
                  No active concierge requests. Tell PlanRupee what you need in the Concierge section.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SAVED PLACES */}
          {activeTab === 'saved_places' && (
            <div className="space-y-3">
              {savedPlacesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedPlacesList.map((place) => (
                    <div 
                      key={place.id}
                      onClick={() => {
                        onClose();
                        setSelectedPlaceForModal(place);
                      }}
                      className="p-3.5 rounded-2xl border border-neutral-200 hover:border-neutral-950 transition flex items-center justify-between gap-3 bg-white cursor-pointer group shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={place.images[0]} alt={place.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <h5 className="font-bold text-sm text-neutral-950 truncate group-hover:underline">{place.name}</h5>
                          <div className="text-xs text-neutral-500">{place.city} • {place.category}</div>
                          <div className="flex items-center gap-1 text-xs text-neutral-800 font-semibold mt-0.5">
                            <Star size={11} className="text-amber-500 fill-amber-500" />
                            <span>{place.rating}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSavePlace(place.id);
                        }}
                        className="p-2 rounded-xl text-neutral-400 hover:text-red-600 transition"
                        title="Remove bookmark"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-400 text-sm">
                  No saved places yet. Click the bookmark icon on any card to save it here.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SAVED LOCALS */}
          {activeTab === 'saved_locals' && (
            <div className="space-y-3">
              {savedLocalsList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedLocalsList.map((local) => (
                    <div 
                      key={local.id}
                      onClick={() => {
                        onClose();
                        setSelectedLocalForModal(local);
                      }}
                      className="p-3.5 rounded-2xl border border-neutral-200 hover:border-neutral-950 transition flex items-center justify-between gap-3 bg-white cursor-pointer group shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={local.avatar} alt={local.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <h5 className="font-bold text-sm text-neutral-950 truncate group-hover:underline">{local.name}</h5>
                          <div className="text-xs text-neutral-500">{local.city} • Verified Local</div>
                          <div className="flex items-center gap-1 text-xs text-neutral-800 font-semibold mt-0.5">
                            <Star size={11} className="text-amber-500 fill-amber-500" />
                            <span>{local.rating} (₹{local.consultationFee})</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveLocal(local.id);
                        }}
                        className="p-2 rounded-xl text-neutral-400 hover:text-red-600 transition"
                        title="Remove bookmark"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-400 text-sm">
                  No saved local experts yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 6: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-3">
              {placeReviews.map((rev) => {
                const targetPlace = places.find(p => p.id === rev.placeId);
                return (
                  <div key={rev.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-neutral-900">
                      <span>{targetPlace ? targetPlace.name : rev.placeId}</span>
                      <span className="flex items-center gap-1 text-amber-600 font-bold">
                        ★ {rev.overallRating}.0
                      </span>
                    </div>
                    <p className="text-neutral-700 italic">
                      "{rev.comment}"
                    </p>
                    <div className="text-[10px] text-neutral-400 flex items-center justify-between pt-1 border-t border-neutral-200">
                      <span>By {rev.authorName} on {rev.date}</span>
                      <span className="text-emerald-700 font-semibold">✓ Community Feedback</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
