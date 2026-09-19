import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, UserCheck, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';
import { City } from '../types';

interface BecomeLocalModalProps {
  onClose: () => void;
}

export const BecomeLocalModal: React.FC<BecomeLocalModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState<City>('Chandigarh');
  const [languages, setLanguages] = useState('English, Hindi, Punjabi');
  const [expertise, setExpertise] = useState('Food, Courtyard Cafés, Heritage');
  const [favoritePlaces, setFavoritePlaces] = useState('');
  const [availability, setAvailability] = useState('Weekends and Evenings');
  const [instagram, setInstagram] = useState('@');
  const [intro, setIntro] = useState('');
  const [pitch, setPitch] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl sm:rounded-4xl max-w-2xl w-full my-8 max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Section 27 • Resident Monetization</span>
            <h3 className="text-xl font-black text-neutral-950 font-display">
              Join PlanRupee Network
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
          <div className="p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
                <ShieldCheck size={14} />
                <span>Application Under Vetting</span>
              </div>
              <h4 className="text-3xl font-black text-neutral-950 font-display">
                Application Received!
              </h4>
              <p className="text-sm text-neutral-600 max-w-md mx-auto mt-2 leading-relaxed">
                Thank you, <strong className="text-neutral-900">{name}</strong>. Our local curator team in <strong className="text-neutral-900">{city}</strong> will verify your credentials and Instagram reel portfolio within 24 hours.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 max-w-sm mx-auto">
              Once approved, you will earn between <strong className="text-neutral-900">₹600 to ₹1,500</strong> per traveler consultation and receive the official <strong className="text-emerald-700">✓ VERIFIED LOCAL</strong> badge.
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3.5 rounded-full bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition"
            >
              Done & Return to Homepage
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            
            {/* Headline Section */}
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-950 font-display tracking-tightest leading-none">
                KNOW YOUR CITY?
                <br />
                <span className="text-neutral-400">BECOME THE PERSON TRAVELERS CALL.</span>
              </h2>
              <p className="text-sm text-neutral-600 font-medium">
                Turn your local knowledge into a paid experience. Help curious travelers discover authentic spots while earning per consultation.
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Name & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jaspreet Kaur"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Your City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as City)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900"
                  >
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Patiala">Patiala</option>
                    <option value="Rajpura">Rajpura</option>
                  </select>
                </div>
              </div>

              {/* Languages & Expertise */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Languages Spoken
                  </label>
                  <input
                    type="text"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Local Expertise Areas
                  </label>
                  <input
                    type="text"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    placeholder="Food, Cafés, Royal Heritage, Markets..."
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900"
                    required
                  />
                </div>
              </div>

              {/* Favorite Places */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  3 Favorite Places in your city that most tourists miss
                </label>
                <input
                  type="text"
                  value={favoritePlaces}
                  onChange={(e) => setFavoritePlaces(e.target.value)}
                  placeholder="e.g. Garden of Silence at sunrise, Sector 8 backlane espresso, Pal Dhaba butter chicken"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900"
                  required
                />
              </div>

              {/* Availability & Instagram */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Availability for Consultations
                  </label>
                  <input
                    type="text"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    placeholder="e.g. Daily evenings / Instant chat"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Instagram / Reel Profile Handle
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@yourhandle"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900"
                    required
                  />
                </div>
              </div>

              {/* Short Intro */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Short Introduction (About You)
                </label>
                <textarea
                  rows={2}
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="Tell travelers who you are and what makes you deeply connected to the city..."
                  className="w-full p-3 rounded-xl border border-neutral-200 text-xs text-neutral-900 resize-none"
                  required
                />
              </div>

              {/* Why should travelers choose you? */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Why should travelers choose you?
                </label>
                <textarea
                  rows={2}
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  placeholder="Describe your insider access, relationships with cooks, historians, or secret spots..."
                  className="w-full p-3 rounded-xl border border-neutral-200 text-xs text-neutral-900 resize-none"
                  required
                />
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-neutral-400">
                After vetting: <strong className="text-emerald-700">✓ VERIFIED LOCAL</strong>
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg"
              >
                APPLY TO BECOME A LOCAL
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
