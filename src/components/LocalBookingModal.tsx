import React, { useState } from 'react';
import { X, Calendar, Clock, Users, MessageSquare, Check, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePlanRupee } from '../context/PlanRupeeContext';
import { Local } from '../types';

interface LocalBookingModalProps {
  local: Local;
  onClose: () => void;
  onSuccess: () => void;
}

export const LocalBookingModal: React.FC<LocalBookingModalProps> = ({ local, onClose, onSuccess }) => {
  const { bookConsultation } = usePlanRupee();

  const [date, setDate] = useState('2026-09-23');
  const [time, setTime] = useState('11:00 AM');
  const [travelers, setTravelers] = useState('2');
  const [question, setQuestion] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookConsultation({
      local,
      date,
      time,
      travelers,
      question: question || 'Personalized trip review and recommended hidden gems.'
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setIsSubmitted(true);
    setTimeout(() => {
      onSuccess();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Package 02 • Local Consultation</span>
            <h3 className="text-xl font-black text-neutral-950 font-display">
              Consult {local.name}
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
              <Check size={32} />
            </div>
            <h4 className="text-2xl font-black text-neutral-950 font-display">
              Consultation Booked!
            </h4>
            <p className="text-xs text-neutral-600 max-w-xs mx-auto">
              {local.name} has been notified and will connect with you on your preferred date ({date} at {time}).
            </p>
            <div className="text-[11px] font-semibold text-neutral-400">
              Added to your PlanRupee Travel Dashboard.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Local Mini Summary Card */}
            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <img 
                src={local.avatar} 
                alt={local.name} 
                className="w-12 h-12 rounded-xl object-cover" 
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-neutral-950">{local.name}</div>
                <div className="text-xs text-neutral-500">{local.city} • Verified Local</div>
              </div>
              <div className="text-right">
                <div className="text-base font-black text-neutral-950">₹{local.consultationFee}</div>
                <div className="text-[10px] text-neutral-400">Fee</div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                  <Calendar size={12} />
                  <span>Consultation Date</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                  <Clock size={12} />
                  <span>Preferred Slot</span>
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold"
                >
                  <option>10:00 AM (Morning)</option>
                  <option>11:00 AM (Morning)</option>
                  <option>02:00 PM (Afternoon)</option>
                  <option>05:00 PM (Evening)</option>
                  <option>08:00 PM (Post Dinner)</option>
                </select>
              </div>
            </div>

            {/* Question / Focus */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                <MessageSquare size={12} />
                <span>What would you like to ask or plan?</span>
              </label>
              <textarea
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Need best authentic butter chicken spots, romantic quiet places for our anniversary date, and hidden Le Corbusier architecture tips..."
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:border-neutral-900 focus:ring-0 resize-none"
              />
            </div>

            {/* Travelers */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                <Users size={12} />
                <span>Traveling Group Size</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Solo', '2', '3–5', '6+'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTravelers(t)}
                    className={`py-2 text-xs font-bold rounded-xl transition ${
                      travelers === t ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                <span>Total Consultation Amount:</span>
                <span className="text-base font-black">₹{local.consultationFee}</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg"
              >
                CONFIRM & CONSULT {local.name.toUpperCase()}
              </button>

              <p className="text-[10px] text-center text-neutral-400">
                100% satisfaction guarantee. Full refund if consultation doesn't deliver unique local value.
              </p>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
