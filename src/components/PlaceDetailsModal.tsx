import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  MessageSquare, 
  Check, 
  Plus, 
  ShieldCheck,
  Compass
} from 'lucide-react';
import { usePlanRupee } from '../context/PlanRupeeContext';
import { Place } from '../types';
import { VerificationBadge } from './common/Badge';

interface PlaceDetailsModalProps {
  place: Place;
  onClose: () => void;
  onOpenReview: (place: Place) => void;
}

export const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({ place, onClose, onOpenReview }) => {
  const { 
    placeReviews, 
    savedPlaceIds, 
    toggleSavePlace, 
    activeRoadmap, 
    addRoadmapActivity,
    locals
  } = usePlanRupee();

  const isSaved = savedPlaceIds.includes(place.id);
  const reviews = placeReviews.filter(r => r.placeId === place.id);

  const [toast, setToast] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Recommending locals
  const recommendingLocals = locals.filter(l => place.recommendedByLocalIds.includes(l.id));

  // Compute criteria breakdown averages
  const avgFood = reviews.length > 0 ? (reviews.reduce((a, b) => a + (b.foodRating || 4.5), 0) / reviews.length).toFixed(1) : '4.8';
  const avgAmbience = reviews.length > 0 ? (reviews.reduce((a, b) => a + (b.ambienceRating || 4.5), 0) / reviews.length).toFixed(1) : '4.9';
  const avgValue = reviews.length > 0 ? (reviews.reduce((a, b) => a + (b.valueRating || 4.5), 0) / reviews.length).toFixed(1) : '4.7';
  const avgClean = reviews.length > 0 ? (reviews.reduce((a, b) => a + (b.cleanlinessRating || 4.5), 0) / reviews.length).toFixed(1) : '4.6';

  const handleAddToRoadmap = () => {
    if (!activeRoadmap) {
      showNotification('Please build a roadmap first!');
      return;
    }
    addRoadmapActivity(1, place, 'Afternoon');
    showNotification(`Added ${place.name} to Day 1 of your Roadmap!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl sm:rounded-4xl max-w-4xl w-full my-8 max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200 relative">
        
        {/* Toast */}
        {toast && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-950 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2">
            <Check size={14} className="text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}

        {/* Top Sticky Bar */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Place Details</span>
            <VerificationBadge status={place.verificationStatus} size="sm" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSavePlace(place.id)}
              className={`p-2 rounded-xl border transition ${
                isSaved ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-white text-neutral-600 border-neutral-200 hover:text-neutral-950'
              }`}
              title={isSaved ? 'Saved to bookmarks' : 'Save place'}
            >
              {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-100 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-10">
          
          {/* Main Hero & Gallery */}
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-3xl overflow-hidden shadow-card">
              <div className="sm:col-span-2 aspect-[16/10] bg-neutral-100">
                <img 
                  src={place.images[0]} 
                  alt={place.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="hidden sm:flex flex-col gap-3">
                {place.images.slice(1, 3).map((img, i) => (
                  <div key={i} className="flex-1 aspect-[16/10] bg-neutral-100 overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Place Title & Rating Bar */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
                  <span>{place.city}</span>
                  <span>•</span>
                  <span>{place.category}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-neutral-950 font-display mt-1 tracking-tight">
                  {place.name}
                </h2>
                <div className="text-xs text-neutral-500 flex items-center gap-1.5 mt-1">
                  <MapPin size={13} />
                  <span>{place.address}</span>
                </div>
              </div>

              {/* Dynamic Rating Score Box (Section 22) */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-right shrink-0">
                <div className="flex items-center gap-1.5 text-2xl font-black text-neutral-950 justify-end">
                  <Star size={20} className="text-amber-500 fill-amber-500" />
                  <span>{place.rating}</span>
                </div>
                <div className="text-[11px] text-neutral-500 font-semibold">
                  From {place.reviewCount} genuine traveler reviews
                </div>
              </div>
            </div>

          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs">
            <div>
              <span className="text-neutral-400 font-bold uppercase text-[10px] block">Opening Hours</span>
              <span className="font-bold text-neutral-900">{place.openingHours}</span>
            </div>
            <div>
              <span className="text-neutral-400 font-bold uppercase text-[10px] block">Price Level</span>
              <span className="font-bold text-neutral-900">{place.priceLevel} (~₹{place.approxCostInr})</span>
            </div>
            <div>
              <span className="text-neutral-400 font-bold uppercase text-[10px] block">Visit Duration</span>
              <span className="font-bold text-neutral-900">{place.estimatedDuration}</span>
            </div>
            <div>
              <span className="text-neutral-400 font-bold uppercase text-[10px] block">Best Time</span>
              <span className="font-bold text-neutral-900">{place.bestTimeToVisit}</span>
            </div>
          </div>

          {/* Description & PlanRupee Recommendation */}
          <div className="space-y-4">
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              {place.description}
            </p>

            <div className="p-5 rounded-3xl bg-neutral-950 text-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                <Sparkles size={14} />
                <span>WHY PLANRUPEE RECOMMENDS THIS</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 italic font-medium leading-relaxed">
                "{place.whyPlanRupeeRecommends}"
              </p>
            </div>
          </div>

          {/* Recommended by Locals */}
          {recommendingLocals.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Verified Local Backing
              </h4>
              <div className="flex flex-wrap gap-3">
                {recommendingLocals.map((loc) => (
                  <div key={loc.id} className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs">
                    <img src={loc.avatar} alt={loc.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="font-bold text-neutral-900">{loc.name}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">Recommended</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 19 Multi-Criteria Rating Breakdown */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Multi-Criteria Experience Ratings
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-[10px] font-bold text-neutral-400 uppercase">Food / Taste</div>
                <div className="text-lg font-black text-neutral-950 mt-0.5">★ {avgFood}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-[10px] font-bold text-neutral-400 uppercase">Ambience</div>
                <div className="text-lg font-black text-neutral-950 mt-0.5">★ {avgAmbience}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-[10px] font-bold text-neutral-400 uppercase">Value for Money</div>
                <div className="text-lg font-black text-neutral-950 mt-0.5">★ {avgValue}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-[10px] font-bold text-neutral-400 uppercase">Cleanliness</div>
                <div className="text-lg font-black text-neutral-950 mt-0.5">★ {avgClean}</div>
              </div>
            </div>
          </div>

          {/* Verified User Reviews List */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Verified Visitor Reviews ({reviews.length})
              </h4>
              <button
                onClick={() => onOpenReview(place)}
                className="text-xs font-bold text-neutral-950 hover:underline"
              >
                + Write a Review
              </button>
            </div>

            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-neutral-950">{rev.authorName}</span>
                      <span className="text-neutral-400 ml-2">({rev.authorLocation}) • {rev.date}</span>
                    </div>
                    <VerificationBadge status={rev.verificationType} size="sm" />
                  </div>
                  <p className="text-neutral-700 italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => onOpenReview(place)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-neutral-300 hover:border-neutral-950 text-xs font-bold uppercase tracking-wider text-neutral-900 transition"
            >
              Write Verified Review
            </button>

            <button
              onClick={handleAddToRoadmap}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
            >
              <Plus size={15} />
              <span>Add to My Roadmap</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
