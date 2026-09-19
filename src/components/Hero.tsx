import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Heart, 
  Coffee, 
  Camera, 
  Compass, 
  Sun, 
  ShoppingBag, 
  Landmark, 
  Moon, 
  UtensilsCrossed,
  MapPin
} from 'lucide-react';
import { usePlanRupee } from '../context/PlanRupeeContext';
import { City, TripMood, Interest, BudgetTier, TravelerCount } from '../types';

interface HeroProps {
  onPackageSelect: (pkg: 'roadmap' | 'local' | 'concierge') => void;
}

export const Hero: React.FC<HeroProps> = ({ onPackageSelect }) => {
  const { currentCity, setCurrentCity, createNewRoadmap } = usePlanRupee();

  // Form State
  const [selectedCity, setSelectedCity] = useState<City>(currentCity);
  const [arrivalDate, setArrivalDate] = useState('2026-09-22');
  const [departureDate, setDepartureDate] = useState('2026-09-26');
  const [arrivalTime, setArrivalTime] = useState('10:00');
  const [departureTime, setDepartureTime] = useState('18:00');
  const [travelers, setTravelers] = useState<TravelerCount>('2');
  const [selectedMoods, setSelectedMoods] = useState<TripMood[]>(['Food', 'Culture', 'Romantic']);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>(['Food', 'Cafés', 'Heritage', 'Hidden Gems']);
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier>('Moderate');

  // Transition flow state
  const [planningState, setPlanningState] = useState<'idle' | 'analyzing' | 'choose_package'>('idle');

  const moodsList: { id: TripMood; label: string; desc: string; icon: any }[] = [
    { id: 'Romantic', label: 'ROMANTIC', desc: 'Date spots, cafés, sunsets and intimate experiences', icon: Heart },
    { id: 'Family', label: 'FAMILY', desc: 'Family-friendly activities, gardens and gentle dining', icon: Users },
    { id: 'Spiritual', label: 'SPIRITUAL', desc: 'Sacred gurdwaras, early morning kirtan & peace', icon: Sun },
    { id: 'Food', label: 'FOOD', desc: 'Legendary dhabas, artisan bakeries & street chaat', icon: UtensilsCrossed },
    { id: 'Adventure', label: 'ADVENTURE', desc: 'Outdoor exploration, Shivalik trails & open drives', icon: Compass },
    { id: 'Culture', label: 'CULTURE', desc: 'Heritage forts, Corbusier brutalism & royal museums', icon: Landmark },
    { id: 'Nightlife', label: 'NIGHTLIFE', desc: 'Evening microbreweries, rooftop lounges & music', icon: Moon },
    { id: 'Shopping', label: 'SHOPPING', desc: 'Phulkari handlooms, old city bazaars & boutiques', icon: ShoppingBag },
    { id: 'Relaxation', label: 'RELAXATION', desc: 'Slow travel, shaded courtyards & quiet nature', icon: Coffee },
    { id: 'Photography', label: 'PHOTOGRAPHY', desc: 'Scenic architecture, golden hour spots & Reel frames', icon: Camera },
  ];

  const allInterests: Interest[] = [
    'Food',
    'Cafés',
    'Shopping',
    'Culture',
    'Heritage',
    'Nature',
    'Nightlife',
    'Photography',
    'Hidden Gems',
    'Spiritual Places',
    'Family Activities',
    'Local Experiences',
  ];

  const budgets: { id: BudgetTier; label: string; desc: string }[] = [
    { id: 'Budget', label: 'Budget', desc: 'Authentic dhabas & public heritage' },
    { id: 'Moderate', label: 'Moderate', desc: 'Curated cafes, cabs & local dining' },
    { id: 'Premium', label: 'Premium', desc: 'Boutique stays & private drivers' },
    { id: 'Luxury', label: 'Luxury', desc: 'Five-star royal dining & private access' },
  ];

  const toggleMood = (mood: TripMood) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? (prev.length > 1 ? prev.filter(m => m !== mood) : prev) 
        : [...prev, mood]
    );
  };

  const toggleInterest = (interest: Interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? (prev.length > 1 ? prev.filter(i => i !== interest) : prev)
        : [...prev, interest]
    );
  };

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlanningState('analyzing');

    // Generate personalized roadmap in context
    createNewRoadmap({
      city: selectedCity,
      arrivalDate,
      departureDate,
      arrivalTime,
      departureTime,
      travelers,
      budget: selectedBudget,
      moods: selectedMoods,
      interests: selectedInterests,
    });

    setCurrentCity(selectedCity);

    // Smooth transition simulation
    setTimeout(() => {
      setPlanningState('choose_package');
    }, 1200);
  };

  return (
    <section id="trip-planner" className="relative pt-8 pb-20 overflow-hidden bg-white">
      
      {/* Editorial Destination Collage Background Accent */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Headline & Supporting Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold">
              <Sparkles size={13} className="text-neutral-900" />
              <span>Trip plans for Chandigarh, Patiala and Rajpura</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-neutral-950 editorial-title tracking-tightest">
              Plan your trip.
              <br />
              <span className="text-neutral-400">Live it like a local.</span>
            </h1>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-neutral-500">
              <span className="px-2.5 py-1.5 rounded-full bg-neutral-100 text-neutral-800">Roadmap</span>
              <span className="px-2.5 py-1.5 rounded-full bg-neutral-100 text-neutral-800">Local</span>
              <span className="px-2.5 py-1.5 rounded-full bg-neutral-100 text-neutral-800">Concierge</span>
            </div>
          </div>

          {/* Casual destination photo collage */}
          <div className="lg:col-span-5 relative hidden sm:block">
            <div className="relative h-[32rem] w-full">
              {/* Image 1: Chandigarh Modernist */}
              <div className="absolute top-0 right-0 w-72 h-56 rounded-[2rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80" 
                  alt="Rock Garden Chandigarh"
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Image 2: Patiala Royal Darbar */}
              <div className="absolute bottom-0 left-0 w-72 h-56 rounded-[2rem] overflow-hidden shadow-2xl -rotate-6 hover:rotate-0 transition duration-500 z-10">
                <img 
                  src="https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80" 
                  alt="Patiala Qila Mubarak"
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Image 3: Highway Dhaba Authentic Food */}
              <div className="absolute top-28 left-16 w-64 h-52 rounded-[1.75rem] overflow-hidden shadow-2xl rotate-12 hover:rotate-0 transition duration-500 z-20">
                <img 
                  src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80" 
                  alt="GT Road Flavors"
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Interactive Trip Planner Form Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {planningState === 'idle' && (
          <div className="bg-white rounded-3xl sm:rounded-4xl border border-neutral-200 shadow-card p-6 sm:p-10 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-neutral-100 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Section 01</span>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 font-display tracking-tight">
                  PLAN YOUR TRIP
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
                Tell PlanRupee where, when and how you like to travel. We’ll structure the exact experience for you.
              </p>
            </div>

            <form onSubmit={handlePlanSubmit} className="space-y-10 pt-8">
              
              {/* Field 1: WHERE ARE YOU GOING? STRICTLY 3 CITIES */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Where are you going? <span className="text-neutral-400 font-normal">(Strict MVP Scope)</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['Chandigarh', 'Patiala', 'Rajpura'] as City[]).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setSelectedCity(city)}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        selectedCity === city
                          ? 'border-neutral-950 bg-neutral-950 text-white shadow-md'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className={selectedCity === city ? 'text-white' : 'text-neutral-400'} />
                        <div>
                          <div className="font-bold text-sm sm:text-base">{city}</div>
                          <div className={`text-[11px] ${selectedCity === city ? 'text-neutral-300' : 'text-neutral-500'}`}>
                            {city === 'Chandigarh' && 'Modernism, gardens & cafes'}
                            {city === 'Patiala' && 'Royal darbars, phulkari & lassi'}
                            {city === 'Rajpura' && 'GT road dhabas & heritage mandis'}
                          </div>
                        </div>
                      </div>
                      {selectedCity === city && <Check size={18} className="text-white shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates & Times & Travelers Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                {/* Arriving Date */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>Arriving Date</span>
                  </label>
                  <input
                    type="date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-0 text-sm font-semibold text-neutral-900"
                    required
                  />
                </div>

                {/* Leaving Date */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>Leaving Date</span>
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-0 text-sm font-semibold text-neutral-900"
                    required
                  />
                </div>

                {/* Arrival Time */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <Clock size={13} />
                    <span>Arrival Time</span>
                  </label>
                  <input
                    type="time"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-0 text-sm font-semibold text-neutral-900"
                  />
                </div>

                {/* Departure Time */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <Clock size={13} />
                    <span>Departure Time</span>
                  </label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-0 text-sm font-semibold text-neutral-900"
                  />
                </div>

                {/* Travelers Count */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <Users size={13} />
                    <span>How many travelers?</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {(['Solo', '2', '3–5', '6+'] as TravelerCount[]).map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setTravelers(count)}
                        className={`py-3 rounded-xl text-xs font-bold transition ${
                          travelers === count
                            ? 'bg-neutral-950 text-white'
                            : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Field: TRIP MOOD (Visual Selection Cards, Multiple Selections) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Trip Mood <span className="text-neutral-400 font-normal">(Select all that match your vibe)</span>
                  </label>
                  <span className="text-xs text-neutral-400 font-medium">
                    {selectedMoods.length} selected
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {moodsList.map((mood) => {
                    const Icon = mood.icon;
                    const isSelected = selectedMoods.includes(mood.id);
                    return (
                      <button
                        key={mood.id}
                        type="button"
                        onClick={() => toggleMood(mood.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 relative ${
                          isSelected
                            ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm'
                            : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-800'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <Icon size={18} className={isSelected ? 'text-white' : 'text-neutral-500'} />
                          {isSelected && <Check size={14} className="text-white" />}
                        </div>
                        <div>
                          <div className="text-xs font-black tracking-wider uppercase">{mood.label}</div>
                          <div className={`text-[10px] leading-tight line-clamp-2 mt-0.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                            {mood.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field: INTERESTS (Tags Selection) */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Specific Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {allInterests.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3.5 py-2 rounded-full text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-neutral-950 text-white'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {isSelected ? `✓ ${interest}` : `+ ${interest}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field: BUDGET */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Trip Budget
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {budgets.map((b) => {
                    const isSelected = selectedBudget === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBudget(b.id)}
                        className={`p-3.5 rounded-2xl border text-left transition ${
                          isSelected
                            ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm'
                            : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-800'
                        }`}
                      >
                        <div className="font-bold text-sm">{b.label}</div>
                        <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {b.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FORM CTA: PLAN MY TRIP */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-neutral-500 font-medium">
                  {selectedCity} • {travelers} traveler{travelers !== 'Solo' && 's'} • {selectedBudget} tier • {selectedMoods.length} moods
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-sm uppercase tracking-wider transition flex items-center justify-center gap-3 shadow-lg group"
                >
                  <span>PLAN MY TRIP</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Transition Screen 1: Understanding your trip... */}
        {planningState === 'analyzing' && (
          <div className="bg-white rounded-4xl border border-neutral-200 shadow-xl p-12 text-center space-y-6 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-950 animate-spin">
              <Sparkles size={28} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-neutral-400">Curating Intelligence</div>
              <h3 className="text-2xl sm:text-3xl font-black text-neutral-950 mt-1 font-display">
                Understanding your trip...
              </h3>
            </div>
            <p className="text-sm text-neutral-500 max-w-md mx-auto">
              Analyzing travel times, opening hours, local spots and verified community feedback in <span className="font-bold text-neutral-900">{selectedCity}</span>.
            </p>
            <div className="w-48 h-1.5 bg-neutral-100 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-neutral-900 rounded-full animate-pulse-subtle w-full" />
            </div>
          </div>
        )}

        {/* Transition Screen 2: How would you like PlanRupee to help? */}
        {planningState === 'choose_package' && (
          <div className="bg-white rounded-4xl border border-neutral-200 shadow-2xl p-8 sm:p-12 space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <Check size={13} />
                <span>Trip Profile Built for {selectedCity}</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-neutral-950 font-display tracking-tight">
                How would you like PlanRupee to help?
              </h3>
              <p className="text-sm text-neutral-600">
                Choose the level of involvement that suits your travel style:
              </p>
            </div>

            {/* The Three Package Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Package 01 — ROADMAP */}
              <div className="p-6 rounded-3xl border-2 border-neutral-200 hover:border-neutral-950 transition flex flex-col justify-between bg-neutral-50/50 hover:bg-white group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest text-neutral-400 uppercase">01 — ROADMAP</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800">Self-Guided</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-neutral-950 font-display">
                      Your complete trip, planned.
                    </h4>
                    <p className="text-xs text-neutral-600 mt-1">
                      Personalized day-by-day itinerary with optimized travel times and curated food recommendations.
                    </p>
                  </div>
                  <ul className="space-y-2 text-xs text-neutral-700 pt-2 border-t border-neutral-200">
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600 shrink-0" />
                      <span>Multi-day roadmap for {selectedCity}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600 shrink-0" />
                      <span>Morning-to-night schedule</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600 shrink-0" />
                      <span>Local food & café recommendations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600 shrink-0" />
                      <span>Travel sequence & time optimization</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 mt-4 border-t border-neutral-100">
                  <div className="text-xs font-bold text-neutral-500 mb-2">Package Fee: ₹499</div>
                  <button
                    onClick={() => onPackageSelect('roadmap')}
                    className="w-full py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2"
                  >
                    <span>GET MY ROADMAP</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Package 02 — LOCAL */}
              <div className="p-6 rounded-3xl border-2 border-neutral-950 bg-white shadow-lg flex flex-col justify-between relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest text-neutral-950 uppercase">02 — LOCAL</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">1-on-1 Consultation</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-neutral-950 font-display">
                      Talk to someone who knows the city.
                    </h4>
                    <p className="text-xs text-neutral-600 mt-1">
                      Direct consultation with a verified local born and raised in {selectedCity}.
                    </p>
                  </div>
                  <ul className="space-y-2 text-xs text-neutral-700 pt-2 border-t border-neutral-200">
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600 shrink-0" />
                      <span>Verified Local with 4.9★ rating</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600 shrink-0" />
                      <span>Direct 1-on-1 consultation & chat</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600 shrink-0" />
                      <span>Hidden places not in tourist guides</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600 shrink-0" />
                      <span>Personalized recommendations & tips</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 mt-4 border-t border-neutral-100">
                  <div className="text-xs font-bold text-neutral-500 mb-2">Starting at ₹799</div>
                  <button
                    onClick={() => onPackageSelect('local')}
                    className="w-full py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2"
                  >
                    <span>FIND MY LOCAL</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Package 03 — CONCIERGE */}
              <div className="p-6 rounded-3xl border-2 border-neutral-200 hover:border-neutral-950 transition flex flex-col justify-between bg-neutral-50/50 hover:bg-white group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest text-neutral-400 uppercase">03 — CONCIERGE</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">Luxury Service</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-neutral-950 font-display">
                      Five-star service. Without the hotel.
                    </h4>
                    <p className="text-xs text-neutral-600 mt-1">
                      Ask PlanRupee to take care of reservations, surprise dates, flowers, private cars or local access.
                    </p>
                  </div>
                  <ul className="space-y-2 text-xs text-neutral-700 pt-2 border-t border-neutral-200">
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600 shrink-0" />
                      <span>Personal luxury travel concierge</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600 shrink-0" />
                      <span>Table reservations & special bookings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600 shrink-0" />
                      <span>Flowers, gifts, surprise dates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-600 shrink-0" />
                      <span>Live 5-stage status tracking</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 mt-4 border-t border-neutral-100">
                  <div className="text-xs font-bold text-neutral-500 mb-2">Starting at ₹1,999</div>
                  <button
                    onClick={() => onPackageSelect('concierge')}
                    className="w-full py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2"
                  >
                    <span>REQUEST CONCIERGE</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setPlanningState('idle')}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 underline"
              >
                ← Back to adjust trip details
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
