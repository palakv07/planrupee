import React, { useState } from 'react';
import { X, Star, CheckCircle2, Camera, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePlanRupee } from '../context/PlanRupeeContext';
import { Place } from '../types';

interface ReviewSubmissionModalProps {
  place: Place;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({ place, onClose, onSuccess }) => {
  const { submitPlaceReview } = usePlanRupee();

  const [authorName, setAuthorName] = useState('Pranjal Traveler');
  const [authorLocation, setAuthorLocation] = useState('Chandigarh');
  const [overallRating, setOverallRating] = useState<number>(5);
  const [foodRating, setFoodRating] = useState<number>(5);
  const [ambienceRating, setAmbienceRating] = useState<number>(5);
  const [valueRating, setValueRating] = useState<number>(5);
  const [cleanlinessRating, setCleanlinessRating] = useState<number>(5);
  const [experienceRating, setExperienceRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [isVerifiedVisit, setIsVerifiedVisit] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    submitPlaceReview({
      placeId: place.id,
      authorName,
      authorLocation,
      overallRating,
      foodRating,
      ambienceRating,
      valueRating,
      cleanlinessRating,
      experienceRating,
      comment,
      verificationType: isVerifiedVisit ? 'verified_visit' : 'unverified'
    });

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });

    setIsSubmitted(true);
    setTimeout(() => {
      onSuccess();
    }, 1600);
  };

  const StarSelector = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
      <span className="text-xs font-semibold text-neutral-700">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 hover:scale-125 transition"
          >
            <Star 
              size={15} 
              className={star <= value ? 'text-amber-500 fill-amber-500' : 'text-neutral-300'} 
            />
          </button>
        ))}
        <span className="text-xs font-bold text-neutral-900 ml-1.5">{value}.0</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl sm:rounded-4xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Section 19 • Authentic Community Feedback</span>
            <h3 className="text-xl font-black text-neutral-950 font-display">
              Review: {place.name}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
          >
            <X size={20} />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="text-2xl font-black text-neutral-950 font-display">
              Review Submitted & Verified!
            </h4>
            <p className="text-xs text-neutral-600 max-w-xs mx-auto">
              PlanRupee community data has been dynamically recalculated. The aggregate rating for <span className="font-bold text-neutral-900">{place.name}</span> is updated in real time.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* User Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">Your Name</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">Your City</label>
                <input
                  type="text"
                  value={authorLocation}
                  onChange={(e) => setAuthorLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold"
                />
              </div>
            </div>

            {/* Section 19 Multi-Criteria Ratings */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Multi-Criteria Rating (1 - 5 Stars)
              </label>

              <StarSelector label="Overall Experience" value={overallRating} onChange={setOverallRating} />
              <StarSelector label="Food & Taste Quality" value={foodRating} onChange={setFoodRating} />
              <StarSelector label="Ambience & Architecture" value={ambienceRating} onChange={setAmbienceRating} />
              <StarSelector label="Value for Money" value={valueRating} onChange={setValueRating} />
              <StarSelector label="Cleanliness & Hygiene" value={cleanlinessRating} onChange={setCleanlinessRating} />
            </div>

            {/* Written Review */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Written Review & Insider Tips
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you order? What was the best time to visit? Any hidden details future travelers should know about this place?"
                className="w-full p-3 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:border-neutral-950 focus:ring-0 resize-none"
                required
              />
            </div>

            {/* Verified Visit Toggle (Section 20 requirement) */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span className="text-xs font-bold text-neutral-800">Verify as PlanRupee Traveler Visit</span>
              </div>
              <input
                type="checkbox"
                checked={isVerifiedVisit}
                onChange={(e) => setIsVerifiedVisit(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-950 focus:ring-neutral-950 border-neutral-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition shadow-md"
            >
              SUBMIT VERIFIED REVIEW
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
