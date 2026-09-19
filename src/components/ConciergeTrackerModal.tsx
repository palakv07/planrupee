import React from 'react';
import { X, CheckCircle2, Clock, ShieldCheck, Sparkles, MessageSquare, ArrowRight, User } from 'lucide-react';
import { usePlanRupee } from '../context/PlanRupeeContext';
import { ConciergeRequest, ConciergeStatus } from '../types';

interface ConciergeTrackerModalProps {
  request: ConciergeRequest;
  onClose: () => void;
}

export const ConciergeTrackerModal: React.FC<ConciergeTrackerModalProps> = ({ request, onClose }) => {
  const { advanceConciergeStatus } = usePlanRupee();

  const stages: { id: ConciergeStatus; label: string; desc: string }[] = [
    { id: 'REQUEST_RECEIVED', label: 'REQUEST RECEIVED', desc: 'Logged and prioritized by dispatch' },
    { id: 'PLANRUPEE_CONCIERGE', label: 'PLANRUPEE CONCIERGE', desc: 'Senior travel concierge assigned' },
    { id: 'LOCAL_PARTNER', label: 'LOCAL / PARTNER', desc: 'Ground specialist engaged in city' },
    { id: 'REQUEST_CONFIRMED', label: 'REQUEST CONFIRMED', desc: 'Arrangements confirmed & locked' },
    { id: 'COMPLETED', label: 'COMPLETED', desc: 'Delivered five-star experience' },
  ];

  const currentStageIndex = stages.findIndex(s => s.id === request.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl sm:rounded-4xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Concierge Tracking ID: #{request.id.slice(-6).toUpperCase()}</span>
            <h3 className="text-xl font-black text-neutral-950 font-display">
              Luxury Service Tracker
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Request Header Summary Card */}
          <div className="p-5 rounded-3xl bg-neutral-950 text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                {request.category}
              </span>
              <span className="text-xs text-neutral-400">{request.city} • {request.timing}</span>
            </div>
            <p className="text-sm sm:text-base font-serif italic text-neutral-100">
              "{request.query}"
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs text-neutral-400">
              <span>Client: {request.contactName} ({request.contactPhone})</span>
              {request.budget && <span>Budget: {request.budget}</span>}
            </div>
          </div>

          {/* 5-STAGE STATUS TIMELINE (Section 16) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Service Pipeline Status
              </h4>
              <button
                onClick={() => advanceConciergeStatus(request.id)}
                className="text-[11px] font-bold text-neutral-900 hover:underline flex items-center gap-1"
                title="Simulate step advance for demo presentation"
              >
                <span>Simulate Next Stage →</span>
              </button>
            </div>

            <div className="space-y-4 relative pl-8 border-l-2 border-neutral-200">
              {stages.map((stage, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const isFuture = idx > currentStageIndex;

                return (
                  <div key={stage.id} className="relative">
                    {/* Circle Node */}
                    <div className={`absolute -left-[41px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPassed ? 'bg-emerald-500 text-white' :
                      isCurrent ? 'bg-neutral-950 text-white ring-4 ring-neutral-200 animate-pulse' :
                      'bg-neutral-100 text-neutral-400 border border-neutral-300'
                    }`}>
                      {isPassed ? <CheckCircle2 size={14} /> : (idx + 1)}
                    </div>

                    <div>
                      <div className={`text-xs font-black tracking-wider uppercase ${
                        isCurrent ? 'text-neutral-950 font-display text-sm' :
                        isPassed ? 'text-neutral-700' :
                        'text-neutral-400'
                      }`}>
                        {stage.label}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        {stage.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Concierge Dispatch Log Updates */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Live Concierge Dispatch Notes
            </h4>
            <div className="space-y-2.5">
              {request.updates.map((up, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-neutral-900">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={12} className="text-neutral-950" />
                      <span>{up.sender}</span>
                    </span>
                    <span className="text-[10px] text-neutral-400">{up.timestamp}</span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    {up.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Help Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-3">
            <ShieldCheck size={20} className="text-amber-700 shrink-0" />
            <div>
              <span className="font-bold">PlanRupee Concierge Guarantee:</span> Dedicated assistance until your experience is fulfilled. Direct contact: concierge@planrupee.com.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
