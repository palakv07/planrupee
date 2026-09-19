import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Star, 
  Users, 
  Languages, 
  Sparkles, 
  Play, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  MessageCircle,
  Calendar,
  Video,
  Heart,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { usePlanRupee } from '../context/PlanRupeeContext';
import { Local } from '../types';
import { VerificationBadge } from './common/Badge';

interface LocalProfileModalProps {
  local: Local;
  onClose: () => void;
  onBookConsultation: (local: Local) => void;
}

export const LocalProfileModal: React.FC<LocalProfileModalProps> = ({ local, onClose, onBookConsultation }) => {
  const { places, localReviews, savedLocalIds, toggleSaveLocal, setSelectedPlaceForModal } = usePlanRupee();

  const isSaved = savedLocalIds.includes(local.id);
  const reviews = localReviews.filter(r => r.localId === local.id);

  // Recommended places lookup
  const lovedPlaces = places.filter(p => local.placesILoveIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl sm:rounded-4xl max-w-4xl w-full my-8 max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Sticky Close Bar */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Verified Local Profile</span>
            <VerificationBadge status={local.verificationStatus} size="sm" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveLocal(local.id)}
              className={`p-2 rounded-xl border transition ${
                isSaved ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-white text-neutral-600 border-neutral-200 hover:text-neutral-950'
              }`}
              title={isSaved ? 'Saved to bookmarks' : 'Save local'}
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

        <div className="p-6 sm:p-10 space-y-12">
          
          {/* HERO SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Large Profile Portrait */}
            <div className="md:col-span-5 relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src={local.avatar} 
                  alt={local.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-neutral-950 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-1.5 text-xs font-bold">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span>{local.rating} Rating</span>
              </div>
            </div>

            {/* Profile Credentials */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>Verified Local Resident • {local.city}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-neutral-950 font-display mt-1 tracking-tight">
                  {local.name.toUpperCase()}
                </h2>
                <div className="text-sm font-semibold text-neutral-500">
                  {local.title}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center">
                <div>
                  <div className="text-lg font-black text-neutral-950">★★★★★ {local.rating}</div>
                  <div className="text-[11px] text-neutral-500 font-medium">{local.reviewCount} Reviews</div>
                </div>
                <div className="border-x border-neutral-200">
                  <div className="text-lg font-black text-neutral-950">{local.travelersHelped}</div>
                  <div className="text-[11px] text-neutral-500 font-medium">Travelers Helped</div>
                </div>
                <div>
                  <div className="text-lg font-black text-neutral-950">₹{local.consultationFee}</div>
                  <div className="text-[11px] text-neutral-500 font-medium">Consultation</div>
                </div>
              </div>

              {/* Bio & Intro */}
              <div className="space-y-3">
                <blockquote className="text-sm sm:text-base italic text-neutral-800 font-serif border-l-2 border-neutral-900 pl-4">
                  "{local.bio}"
                </blockquote>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {local.whyChooseMe}
                </p>
              </div>

              {/* Languages & Expertise */}
              <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Languages size={14} className="text-neutral-400" />
                  <span className="font-bold text-neutral-900">Languages:</span>
                  <span>{local.languages.join(', ')}</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="font-bold text-neutral-900 mr-1">Expertise:</span>
                  {local.expertise.map((exp) => (
                    <span key={exp} className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 font-semibold text-[11px]">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hero CTA: Consult This Local */}
              <div className="pt-4">
                <button
                  onClick={() => onBookConsultation(local)}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-3 shadow-xl"
                >
                  <MessageCircle size={16} />
                  <span>CONSULT {local.name.toUpperCase()} (₹{local.consultationFee})</span>
                </button>
                <div className="text-[11px] text-neutral-400 mt-2 font-medium">
                  ✓ {local.availability}
                </div>
              </div>

            </div>

          </div>

          {/* MY LOCAL PICKS (Section 14) */}
          <div className="space-y-6 pt-6 border-t border-neutral-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Curated Favorites</span>
              <h3 className="text-2xl font-black text-neutral-950 font-display">
                MY LOCAL PICKS
              </h3>
              <p className="text-xs text-neutral-500">
                {local.name}'s definitive shortlist for the best insider spots in {local.city}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(local.localPicks).map(([key, pick]) => (
                <div key={key} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-neutral-950 transition space-y-1.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    {pick.label}
                  </div>
                  <div className="font-bold text-sm text-neutral-950">
                    {pick.name}
                  </div>
                  <div className="text-xs text-neutral-600 leading-snug">
                    {pick.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PLACES I LOVE (Section 14) */}
          <div className="space-y-6 pt-6 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Recommended Locations</span>
                <h3 className="text-2xl font-black text-neutral-950 font-display">
                  PLACES I LOVE
                </h3>
              </div>
              <span className="text-xs text-neutral-500 font-medium">
                {lovedPlaces.length} curated places
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {lovedPlaces.map((place) => (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlaceForModal(place)}
                  className="rounded-2xl border border-neutral-200 hover:border-neutral-950 overflow-hidden bg-white cursor-pointer group shadow-sm transition-all"
                >
                  <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                    <img 
                      src={place.images[0]} 
                      alt={place.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold">
                      Recommended by {local.name.split(' ')[0]}
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      {place.category}
                    </div>
                    <div className="font-bold text-sm text-neutral-950 line-clamp-1 group-hover:underline">
                      {place.name}
                    </div>
                    <div className="flex items-center justify-between text-xs text-neutral-600 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-neutral-900">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        {place.rating}
                      </span>
                      <span>₹{place.approxCostInr}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MY REELS (Section 14 - Instagram/Reel 9:16 Grid) */}
          {local.reels.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Short Video Stories</span>
                  <h3 className="text-2xl font-black text-neutral-950 font-display">
                    MY REELS
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                  <Video size={14} className="text-amber-500" />
                  <span>{local.instagramHandle}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {local.reels.map((reel) => (
                  <div key={reel.id} className="relative aspect-reel rounded-2xl overflow-hidden shadow-md group border border-neutral-200 bg-neutral-950">
                    <img 
                      src={reel.thumbnail} 
                      alt={reel.title} 
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-95 group-hover:scale-105 transition duration-500" 
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    {/* Duration Badge */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                      {reel.duration}
                    </div>

                    {/* Play Button Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center text-white group-hover:scale-110 transition">
                        <Play size={18} className="fill-white translate-x-0.5" />
                      </div>
                    </div>

                    {/* Title & View stats */}
                    <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        #{reel.tag}
                      </span>
                      <div className="text-xs font-bold leading-snug line-clamp-2">
                        {reel.title}
                      </div>
                      <div className="text-[10px] text-neutral-300">
                        {reel.views} views
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRAVELER REVIEWS (Section 14) */}
          <div className="space-y-6 pt-6 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Verified Client Feedback</span>
                <h3 className="text-2xl font-black text-neutral-950 font-display">
                  TRAVELER REVIEWS
                </h3>
              </div>
              <div className="text-xs font-bold text-neutral-900 flex items-center gap-1">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                <span>{local.rating} ({reviews.length} reviews)</span>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-neutral-950">{rev.authorName}</div>
                      <div className="text-[11px] text-neutral-500">{rev.authorCity} • {rev.date}</div>
                    </div>
                    <VerificationBadge status={rev.verificationType} size="sm" />
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-500 pt-1 border-t border-neutral-200/60">
                    <span>Knowledge: ★{rev.knowledgeRating}</span>
                    <span>Helpfulness: ★{rev.helpfulnessRating}</span>
                    <span>Responsiveness: ★{rev.responsivenessRating}</span>
                    <span>Recommendation Quality: ★{rev.recommendationQualityRating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM CTA BAR */}
          <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Consultation Fee</div>
              <div className="text-2xl font-black text-neutral-950">₹{local.consultationFee}</div>
            </div>

            <button
              onClick={() => onBookConsultation(local)}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg"
            >
              <span>CONSULT THIS LOCAL</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
