import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Plus, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Users, 
  Trash2, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import { usePlanRupee } from '../context/PlanRupeeContext';
import { City, VerificationStatus, PlaceCategory, Place } from '../types';
import { VerificationBadge } from './common/Badge';

interface AdminPanelModalProps {
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ onClose }) => {
  const { 
    places, 
    locals, 
    placeReviews, 
    myConciergeRequests, 
    addNewPlace, 
    verifyPlace, 
    verifyLocal,
    advanceConciergeStatus
  } = usePlanRupee();

  const [activeTab, setActiveTab] = useState<'places' | 'locals' | 'reviews' | 'concierge' | 'add_place'>('places');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // New place form state
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState<City>('Chandigarh');
  const [newCat, setNewCat] = useState<PlaceCategory>('Food');
  const [newAddress, setNewAddress] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newHours, setNewHours] = useState('10:00 AM – 10:00 PM');
  const [newCost, setNewCost] = useState(400);
  const [newWhy, setNewWhy] = useState('');
  const [newStatus, setNewStatus] = useState<VerificationStatus>('verified');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddPlaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addNewPlace({
      name: newName,
      city: newCity,
      category: newCat,
      address: newAddress,
      description: newDesc,
      openingHours: newHours,
      priceLevel: '₹₹',
      approxCostInr: Number(newCost),
      images: [newImage],
      whyPlanRupeeRecommends: newWhy || 'Curated local spot tested for verified quality.',
      bestTimeToVisit: 'Evening',
      estimatedDuration: '1.5 hours',
      verificationStatus: newStatus,
      tags: ['Local Favorite', newCat]
    });

    showToast(`Added ${newName} to database!`);
    setActiveTab('places');
    setNewName('');
    setNewAddress('');
    setNewDesc('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl sm:rounded-4xl max-w-5xl w-full my-8 max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Toast */}
        {toast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-neutral-950 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl">
            {toast}
          </div>
        )}

        {/* Top Bar */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold">
              <ShieldAlert size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Section 32 • Operations Desk</span>
              <h3 className="text-xl font-black font-display text-white">
                ADMIN & COMMUNITY MODERATION
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-neutral-200 bg-neutral-50 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('places')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'places' ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Manage Places ({places.length})
          </button>
          <button
            onClick={() => setActiveTab('add_place')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'add_place' ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            + Add New Place
          </button>
          <button
            onClick={() => setActiveTab('locals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'locals' ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Verify Locals ({locals.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'reviews' ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Moderate Reviews ({placeReviews.length})
          </button>
          <button
            onClick={() => setActiveTab('concierge')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'concierge' ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Concierge Requests ({myConciergeRequests.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB: MANAGE PLACES */}
          {activeTab === 'places' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                <span className="text-xs font-semibold text-neutral-500">
                  Data transparency: Check status tags (`verified`, `demo`, `user_generated`, `unverified`).
                </span>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-neutral-400 font-bold">Filter:</span>
                  {['all', 'verified', 'demo', 'user_generated'].map(s => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-2.5 py-1 rounded-lg font-semibold uppercase text-[10px] ${
                        filterStatus === s ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {places
                  .filter(p => filterStatus === 'all' || p.verificationStatus === filterStatus)
                  .map((place) => (
                    <div key={place.id} className="p-4 rounded-2xl border border-neutral-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={place.images[0]} alt={place.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-sm text-neutral-950 truncate">{place.name}</h5>
                            <VerificationBadge status={place.verificationStatus} size="sm" />
                          </div>
                          <div className="text-xs text-neutral-500">{place.city} • {place.category} • Rating: ★{place.rating} ({place.reviewCount} revs)</div>
                        </div>
                      </div>

                      {/* Verification Status Selector */}
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={place.verificationStatus}
                          onChange={(e) => {
                            verifyPlace(place.id, e.target.value as VerificationStatus);
                            showToast(`Updated verification status for ${place.name}`);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900"
                        >
                          <option value="verified">Verified (Ground Checked)</option>
                          <option value="demo">DEMO (Sample Data)</option>
                          <option value="user_generated">Community Added</option>
                          <option value="unverified">Unverified</option>
                        </select>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB: ADD PLACE */}
          {activeTab === 'add_place' && (
            <form onSubmit={handleAddPlaceSubmit} className="space-y-4 max-w-2xl">
              <h4 className="text-lg font-black text-neutral-950 font-display">
                Add Real Place to PlanRupee Database
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600">Place Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Baradari Palace Tea Room"
                    className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600">City</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value as City)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                  >
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Patiala">Patiala</option>
                    <option value="Rajpura">Rajpura</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600">Category</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as PlaceCategory)}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                  >
                    <option value="Food">Food</option>
                    <option value="Café">Café</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Nature">Nature</option>
                    <option value="Spiritual">Spiritual</option>
                    <option value="Hidden Gem">Hidden Gem</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600">Approx Cost (INR)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-600">Address</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Street / Sector address"
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-600">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Short background and architectural/culinary essence"
                  className="w-full p-2.5 border rounded-xl text-xs resize-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-600">Why PlanRupee Recommends This</label>
                <input
                  type="text"
                  value={newWhy}
                  onChange={(e) => setNewWhy(e.target.value)}
                  placeholder="Insider editorial justification"
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-600">Verification Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as VerificationStatus)}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-bold"
                >
                  <option value="verified">Verified</option>
                  <option value="demo">DEMO</option>
                  <option value="user_generated">Community Added</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition"
              >
                Save Place to Platform
              </button>
            </form>
          )}

          {/* TAB: VERIFY LOCALS */}
          {activeTab === 'locals' && (
            <div className="space-y-3">
              {locals.map((local) => (
                <div key={local.id} className="p-4 rounded-2xl border border-neutral-200 bg-white flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={local.avatar} alt={local.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-950">{local.name}</span>
                        <VerificationBadge status={local.verificationStatus} size="sm" />
                      </div>
                      <div className="text-xs text-neutral-500">{local.city} • Fee: ₹{local.consultationFee} • Rating: ★{local.rating}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        verifyLocal(local.id, !local.verified);
                        showToast(`Toggled verification for ${local.name}`);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                        local.verified 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                          : 'bg-neutral-950 text-white'
                      }`}
                    >
                      {local.verified ? '✓ Verified Local' : 'Approve & Verify'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: MODERATE REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-3">
              {placeReviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl border border-neutral-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-neutral-950">{rev.authorName}</span>
                      <span className="text-xs text-neutral-500 ml-2">on place: #{rev.placeId}</span>
                    </div>
                    <VerificationBadge status={rev.verificationType} size="sm" />
                  </div>
                  <p className="text-xs text-neutral-700 italic">"{rev.comment}"</p>
                  <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1 border-t border-neutral-100">
                    <span>Overall: ★{rev.overallRating} • Food: ★{rev.foodRating} • Ambience: ★{rev.ambienceRating}</span>
                    <span className="text-neutral-400">{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: CONCIERGE REQUESTS DISPATCH */}
          {activeTab === 'concierge' && (
            <div className="space-y-3">
              {myConciergeRequests.map((req) => (
                <div key={req.id} className="p-5 rounded-2xl border border-neutral-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-neutral-950 text-white text-[10px] font-bold uppercase">
                        {req.category}
                      </span>
                      <span className="text-xs font-bold text-neutral-900">{req.city}</span>
                      <span className="text-xs text-neutral-400">({req.createdAt})</span>
                    </div>
                    <p className="text-xs text-neutral-800 font-medium mt-1">"{req.query}"</p>
                    <div className="text-xs text-neutral-500 mt-1">
                      Current Stage: <strong className="text-neutral-950">{req.status}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      advanceConciergeStatus(req.id);
                      showToast(`Advanced request to next stage!`);
                    }}
                    className="px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold shrink-0 transition"
                  >
                    Advance Stage →
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
