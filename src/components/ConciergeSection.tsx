import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Utensils, 
  Car, 
  Camera, 
  Gift, 
  CalendarHeart, 
  Music, 
  Heart, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Building2,
  HelpCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { usePlanRupee } from '../context/PlanRupeeContext';
import { City } from '../types';
import { ConciergeTrackerModal } from './ConciergeTrackerModal';

export const ConciergeSection: React.FC = () => {
  const { currentCity, submitConciergeRequest, myConciergeRequests } = usePlanRupee();

  const [selectedCategory, setSelectedCategory] = useState<string>('Food');
  const [requestText, setRequestText] = useState<string>('');
  const [city, setCity] = useState<City>(currentCity);
  const [timing, setTiming] = useState<string>('Tonight, 8:00 PM');
  const [budget, setBudget] = useState<string>('₹2,500 - ₹5,000');
  const [contactName, setContactName] = useState<string>('Pranjal Traveler');
  const [contactPhone, setContactPhone] = useState<string>('+91 98765 43210');
  
  // Tracker modal state
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);

  const categories = [
    'Food',
    'Reservations',
    'Transport',
    'Shopping',
    'Experiences',
    'Celebrations',
    'Photography',
    'Local Help',
    'Other'
  ];

  const quickCards = [
    { title: 'Find a restaurant', desc: 'Curated intimate dining or family feast', category: 'Food', prompt: 'Find me the best authentic romantic courtyard dinner spot with vegetarian options.' },
    { title: 'Book a table', desc: 'Secure high-demand weekend tables', category: 'Reservations', prompt: 'Book a private bougainvillea garden table at Virgin Courtyard for 2 people tonight.' },
    { title: 'Find local food', desc: 'The real dishes locals eat', category: 'Food', prompt: 'Where can I get authentic slow-simmered butter chicken and garlic naan after 10 PM?' },
    { title: 'Plan a date', desc: 'Complete surprise date itinerary', category: 'Celebrations', prompt: 'Plan a romantic surprise date: sunset viewpoint, quiet wine bar, and candlelit dinner.' },
    { title: 'Arrange flowers', desc: 'Fresh floral hampers & custom gifts', category: 'Celebrations', prompt: 'Arrange a fresh bouquet of exotic lilies and handwritten greeting card delivered to my hotel.' },
    { title: 'Find a gift', desc: 'Handcrafted Phulkari or gourmet sweets', category: 'Shopping', prompt: 'Find genuine master-weaver Phulkari silk dupattas in Patiala without tourist markup.' },
    { title: 'Find a photographer', desc: 'Editorial vacation shoot & reels', category: 'Photography', prompt: 'Find a creative photographer for a 2-hour morning shoot at Capitol Complex & Rock Garden.' },
    { title: 'Plan an evening', desc: 'Music, microbrewery & nightlife', category: 'Experiences', prompt: 'Organize our evening: start at an artisan coffee roaster, move to a rooftop lounge with live jazz.' },
    { title: 'Find transportation', desc: 'Chauffeured sedan or highway taxi', category: 'Transport', prompt: 'Arrange a clean chauffeured sedan for day trip from Chandigarh to Patiala Qila Mubarak.' },
    { title: 'Custom request', desc: 'Anything else you need handled', category: 'Other', prompt: 'I have a unique travel request: ' }
  ];

  const handleQuickCardClick = (card: typeof quickCards[0]) => {
    setSelectedCategory(card.category);
    setRequestText(card.prompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    const newReq = submitConciergeRequest({
      category: selectedCategory,
      query: requestText,
      city,
      timing,
      budget,
      travelers: '2',
      contactName,
      contactPhone
    });

    setActiveTrackingId(newReq.id);
    setRequestText('');
  };

  const trackedRequest = myConciergeRequests.find(r => r.id === activeTrackingId) || myConciergeRequests[0];

  return (
    <section id="concierge" className="py-24 bg-white border-b border-neutral-200 relative overflow-hidden">
      
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-100 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header: Section 15 */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
            <Sparkles size={13} className="text-amber-600" />
            <span>Concierge</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-neutral-950 font-display tracking-tightest leading-none">
            Need something done?
            <br />
            <span className="text-neutral-400">We handle it.</span>
          </h2>
        </div>

        {/* Quick Request Selection Cards (Section 15) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Quick Request Shortcuts
            </span>
            <span className="text-xs text-neutral-500">Tap to auto-fill prompt</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {quickCards.map((card, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickCardClick(card)}
                className="p-4 rounded-2xl border border-neutral-200 hover:border-neutral-950 bg-neutral-50/50 hover:bg-white text-left transition-all flex flex-col justify-between h-28 group shadow-subtle"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 group-hover:text-neutral-900">
                    {card.category}
                  </span>
                  <ArrowRight size={12} className="text-neutral-400 group-hover:translate-x-1 group-hover:text-neutral-950 transition" />
                </div>
                <div>
                  <div className="font-bold text-xs text-neutral-900 leading-snug group-hover:underline">
                    {card.title}
                  </div>
                  <div className="text-[10px] text-neutral-500 line-clamp-1 mt-0.5">
                    {card.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Premium Concierge Request Interface (Section 3 & 15) */}
        <div className="bg-neutral-950 rounded-4xl text-white p-6 sm:p-12 shadow-2xl space-y-8 relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                WHAT CAN WE TAKE CARE OF?
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
                Tell PlanRupee what you need...
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
              <Clock size={14} className="text-amber-400" />
              <span>Average response: Under 12 minutes</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Category Pills */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Select Request Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                      selectedCategory === cat
                        ? 'bg-white text-neutral-950 font-bold'
                        : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Large Textarea Input */}
            <div className="space-y-2">
              <textarea
                rows={4}
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                placeholder="Tell PlanRupee what you need... e.g. 'Find me a romantic dinner tonight in Sector 8', 'Book a table at a good café', 'Find a birthday cake & arrange flowers', 'Arrange highway transportation to Patiala'..."
                className="w-full p-4 sm:p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:border-amber-400 focus:ring-0 text-sm sm:text-base resize-none leading-relaxed"
                required
              />
            </div>

            {/* Timing, City, Budget Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                  <MapPin size={12} />
                  <span>City</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as City)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-semibold"
                >
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Patiala">Patiala</option>
                  <option value="Rajpura">Rajpura</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                  <Clock size={12} />
                  <span>When do you need this?</span>
                </label>
                <input
                  type="text"
                  value={timing}
                  onChange={(e) => setTiming(e.target.value)}
                  placeholder="e.g. Tonight 8 PM, Tomorrow noon"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Approx Budget Target
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. ₹3,000 or Flexible"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-semibold"
                />
              </div>

            </div>

            {/* Contact Info & CTA */}
            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>White-glove coordination</span>
                </span>
                <span>•</span>
                <span>Real-time dispatch tracker</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-white hover:bg-neutral-200 text-neutral-950 font-black text-xs uppercase tracking-widest transition flex items-center justify-center gap-3 shadow-lg group"
              >
                <span>REQUEST CONCIERGE</span>
                <Send size={15} className="group-hover:translate-x-1 transition" />
              </button>
            </div>

          </form>

        </div>

        {/* Live Active Requests Pill / Link */}
        {myConciergeRequests.length > 0 && (
          <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-950 text-white flex items-center justify-center font-bold text-xs">
                5★
              </div>
              <div>
                <div className="font-bold text-sm text-neutral-950">
                  You have {myConciergeRequests.length} active Concierge request(s)
                </div>
                <div className="text-xs text-neutral-500">
                  Latest: {myConciergeRequests[0].category} in {myConciergeRequests[0].city} ({myConciergeRequests[0].status.replace('_', ' ')})
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTrackingId(myConciergeRequests[0].id)}
              className="px-5 py-2.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition"
            >
              Open Live Tracker
            </button>
          </div>
        )}

      </div>

      {/* Concierge Tracker Modal */}
      {activeTrackingId && trackedRequest && (
        <ConciergeTrackerModal
          request={trackedRequest}
          onClose={() => setActiveTrackingId(null)}
        />
      )}

    </section>
  );
};
