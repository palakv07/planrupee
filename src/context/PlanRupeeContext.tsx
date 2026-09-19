import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  City, 
  Place, 
  Local, 
  PlaceReview, 
  LocalReview, 
  Roadmap, 
  ConciergeRequest, 
  ConciergeStatus,
  ConsultationBooking,
  VerificationStatus,
  TripMood,
  Interest,
  BudgetTier,
  TravelerCount,
  RoadmapActivity
} from '../types';
import { INITIAL_PLACES } from '../data/places';
import { INITIAL_LOCALS } from '../data/locals';
import { INITIAL_PLACE_REVIEWS, INITIAL_LOCAL_REVIEWS } from '../data/reviews';
import { generateRoadmap, generateId } from '../data/roadmapGenerator';

interface PlanRupeeContextType {
  // Cities & Filters
  currentCity: City;
  setCurrentCity: (city: City) => void;
  
  // Data
  places: Place[];
  locals: Local[];
  placeReviews: PlaceReview[];
  localReviews: LocalReview[];
  
  // Active Trip & Roadmap
  activeRoadmap: Roadmap | null;
  setActiveRoadmap: (roadmap: Roadmap | null) => void;
  createNewRoadmap: (params: {
    city: City;
    arrivalDate: string;
    departureDate: string;
    arrivalTime?: string;
    departureTime?: string;
    travelers?: TravelerCount;
    budget?: BudgetTier;
    moods?: TripMood[];
    interests?: Interest[];
  }) => Roadmap;
  updateRoadmapActivity: (dayNumber: number, activityId: string, newPlace: Place) => void;
  removeRoadmapActivity: (dayNumber: number, activityId: string) => void;
  addRoadmapActivity: (dayNumber: number, place: Place, slot: 'Morning' | 'Afternoon' | 'Evening' | 'Dinner') => void;
  optimizeDay: (dayNumber: number) => void;
  
  // Saved Items
  savedPlaceIds: string[];
  toggleSavePlace: (placeId: string) => void;
  savedLocalIds: string[];
  toggleSaveLocal: (localId: string) => void;

  // Bookings & Requests
  myConsultations: ConsultationBooking[];
  bookConsultation: (params: {
    local: Local;
    date: string;
    time: string;
    travelers: string;
    question: string;
  }) => ConsultationBooking;
  
  myConciergeRequests: ConciergeRequest[];
  submitConciergeRequest: (params: {
    category: string;
    query: string;
    city: City;
    timing: string;
    budget?: string;
    travelers: string;
    contactName: string;
    contactPhone: string;
  }) => ConciergeRequest;
  advanceConciergeStatus: (requestId: string) => void;

  // Reviews
  submitPlaceReview: (review: Omit<PlaceReview, 'id' | 'date'>) => void;
  submitLocalReview: (review: Omit<LocalReview, 'id' | 'date'>) => void;

  // Modals & UI States
  selectedLocalForModal: Local | null;
  setSelectedLocalForModal: (local: Local | null) => void;
  selectedPlaceForModal: Place | null;
  setSelectedPlaceForModal: (place: Place | null) => void;
  
  isLocalBookingModalOpen: boolean;
  setIsLocalBookingModalOpen: (open: boolean) => void;
  activeLocalToBook: Local | null;
  setActiveLocalToBook: (local: Local | null) => void;

  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  activePlaceToReview: Place | null;
  setActivePlaceToReview: (place: Place | null) => void;

  isBecomeLocalModalOpen: boolean;
  setIsBecomeLocalModalOpen: (open: boolean) => void;

  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;

  isConciergeModalOpen: boolean;
  setIsConciergeModalOpen: (open: boolean) => void;
  conciergePreselectedCategory: string | null;
  setConciergePreselectedCategory: (cat: string | null) => void;

  // Admin Actions
  addNewPlace: (place: Omit<Place, 'id' | 'rating' | 'reviewCount' | 'localRecommendationsCount' | 'userRecommendationsCount' | 'recommendedByLocalIds'>) => void;
  verifyPlace: (placeId: string, status: VerificationStatus) => void;
  verifyLocal: (localId: string, verified: boolean) => void;
}

const PlanRupeeContext = createContext<PlanRupeeContextType | undefined>(undefined);

export const PlanRupeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentCity, setCurrentCity] = useState<City>('Chandigarh');

  // Load from localStorage or defaults
  const [places, setPlaces] = useState<Place[]>(() => {
    const saved = localStorage.getItem('planrupee_places');
    return saved ? JSON.parse(saved) : INITIAL_PLACES;
  });

  const [locals, setLocals] = useState<Local[]>(() => {
    const saved = localStorage.getItem('planrupee_locals');
    return saved ? JSON.parse(saved) : INITIAL_LOCALS;
  });

  const [placeReviews, setPlaceReviews] = useState<PlaceReview[]>(() => {
    const saved = localStorage.getItem('planrupee_place_reviews');
    return saved ? JSON.parse(saved) : INITIAL_PLACE_REVIEWS;
  });

  const [localReviews, setLocalReviews] = useState<LocalReview[]>(() => {
    const saved = localStorage.getItem('planrupee_local_reviews');
    return saved ? JSON.parse(saved) : INITIAL_LOCAL_REVIEWS;
  });

  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('planrupee_saved_places');
    return saved ? JSON.parse(saved) : ['chd-rock-garden', 'chd-pal-dhaba'];
  });

  const [savedLocalIds, setSavedLocalIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('planrupee_saved_locals');
    return saved ? JSON.parse(saved) : ['local-simran'];
  });

  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap | null>(() => {
    const saved = localStorage.getItem('planrupee_active_roadmap');
    if (saved) return JSON.parse(saved);
    // Default 5-Day Chandigarh Roadmap matching requirement 1
    return generateRoadmap({
      city: 'Chandigarh',
      arrivalDate: '2026-09-22',
      departureDate: '2026-09-26',
      arrivalTime: '10:00',
      departureTime: '18:00',
      travelers: '2',
      budget: 'Moderate',
      moods: ['Food', 'Culture', 'Romantic'],
      interests: ['Food', 'Cafés', 'Heritage', 'Hidden Gems']
    });
  });

  const [myConsultations, setMyConsultations] = useState<ConsultationBooking[]>(() => {
    const saved = localStorage.getItem('planrupee_consultations');
    return saved ? JSON.parse(saved) : [];
  });

  const [myConciergeRequests, setMyConciergeRequests] = useState<ConciergeRequest[]>(() => {
    const saved = localStorage.getItem('planrupee_concierge_requests');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'cr-sample-1',
        category: 'Food',
        query: 'Arrange an authentic candlelit table at Virgin Courtyard with curated Italian tasting menu for 2 guests.',
        city: 'Chandigarh',
        timing: 'Tonight, 8:30 PM',
        budget: '₹3,000',
        travelers: '2',
        contactName: 'Aman Varma',
        contactPhone: '+91 98140 XXXXX',
        status: 'LOCAL_PARTNER',
        createdAt: '19 Sep 2026, 07:15 PM',
        updates: [
          {
            timestamp: '07:15 PM',
            stage: 'REQUEST_RECEIVED',
            sender: 'System',
            note: 'Concierge request logged and validated by PlanRupee Priority desk.'
          },
          {
            timestamp: '07:22 PM',
            stage: 'PLANRUPEE_CONCIERGE',
            sender: 'PlanRupee Concierge',
            note: 'Assigned to Senior Concierge Rajesh. Reviewing courtyard table availability at Virgin Courtyard.'
          },
          {
            timestamp: '07:35 PM',
            stage: 'LOCAL_PARTNER',
            sender: 'Local Partner',
            note: 'Virgin Courtyard GM confirmed outdoor bougainvillea pergola table. Finalizing tasting menu pairing.'
          }
        ]
      }
    ];
  });

  // Modal States
  const [selectedLocalForModal, setSelectedLocalForModal] = useState<Local | null>(null);
  const [selectedPlaceForModal, setSelectedPlaceForModal] = useState<Place | null>(null);
  const [isLocalBookingModalOpen, setIsLocalBookingModalOpen] = useState<boolean>(false);
  const [activeLocalToBook, setActiveLocalToBook] = useState<Local | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [activePlaceToReview, setActivePlaceToReview] = useState<Place | null>(null);
  const [isBecomeLocalModalOpen, setIsBecomeLocalModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isConciergeModalOpen, setIsConciergeModalOpen] = useState<boolean>(false);
  const [conciergePreselectedCategory, setConciergePreselectedCategory] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('planrupee_places', JSON.stringify(places));
  }, [places]);

  useEffect(() => {
    localStorage.setItem('planrupee_locals', JSON.stringify(locals));
  }, [locals]);

  useEffect(() => {
    localStorage.setItem('planrupee_place_reviews', JSON.stringify(placeReviews));
  }, [placeReviews]);

  useEffect(() => {
    localStorage.setItem('planrupee_local_reviews', JSON.stringify(localReviews));
  }, [localReviews]);

  useEffect(() => {
    localStorage.setItem('planrupee_saved_places', JSON.stringify(savedPlaceIds));
  }, [savedPlaceIds]);

  useEffect(() => {
    localStorage.setItem('planrupee_saved_locals', JSON.stringify(savedLocalIds));
  }, [savedLocalIds]);

  useEffect(() => {
    if (activeRoadmap) {
      localStorage.setItem('planrupee_active_roadmap', JSON.stringify(activeRoadmap));
    }
  }, [activeRoadmap]);

  useEffect(() => {
    localStorage.setItem('planrupee_consultations', JSON.stringify(myConsultations));
  }, [myConsultations]);

  useEffect(() => {
    localStorage.setItem('planrupee_concierge_requests', JSON.stringify(myConciergeRequests));
  }, [myConciergeRequests]);

  // Saved toggles
  const toggleSavePlace = (placeId: string) => {
    setSavedPlaceIds(prev => 
      prev.includes(placeId) ? prev.filter(id => id !== placeId) : [...prev, placeId]
    );
  };

  const toggleSaveLocal = (localId: string) => {
    setSavedLocalIds(prev => 
      prev.includes(localId) ? prev.filter(id => id !== localId) : [...prev, localId]
    );
  };

  // Roadmap creation & modifications
  const createNewRoadmap = (params: {
    city: City;
    arrivalDate: string;
    departureDate: string;
    arrivalTime?: string;
    departureTime?: string;
    travelers?: TravelerCount;
    budget?: BudgetTier;
    moods?: TripMood[];
    interests?: Interest[];
  }): Roadmap => {
    const roadmap = generateRoadmap(params);
    setActiveRoadmap(roadmap);
    setCurrentCity(params.city);
    return roadmap;
  };

  const updateRoadmapActivity = (dayNumber: number, activityId: string, newPlace: Place) => {
    if (!activeRoadmap) return;
    const updatedDays = activeRoadmap.days.map(day => {
      if (day.dayNumber !== dayNumber) return day;
      const updatedActs = day.activities.map(act => {
        if (act.id !== activityId) return act;
        return {
          ...act,
          placeId: newPlace.id,
          placeName: newPlace.name,
          category: newPlace.category,
          image: newPlace.images[0] || act.image,
          rating: newPlace.rating,
          reviewCount: newPlace.reviewCount,
          shortDescription: newPlace.description,
          whyPlanRupeeRecommends: newPlace.whyPlanRupeeRecommends,
          approxCostInr: newPlace.approxCostInr,
          estimatedDuration: newPlace.estimatedDuration,
        };
      });
      return { ...day, activities: updatedActs };
    });

    setActiveRoadmap({ ...activeRoadmap, days: updatedDays });
  };

  const removeRoadmapActivity = (dayNumber: number, activityId: string) => {
    if (!activeRoadmap) return;
    const updatedDays = activeRoadmap.days.map(day => {
      if (day.dayNumber !== dayNumber) return day;
      return {
        ...day,
        activities: day.activities.filter(act => act.id !== activityId)
      };
    });
    setActiveRoadmap({ ...activeRoadmap, days: updatedDays });
  };

  const addRoadmapActivity = (dayNumber: number, place: Place, slot: 'Morning' | 'Afternoon' | 'Evening' | 'Dinner') => {
    if (!activeRoadmap) return;
    const newAct: RoadmapActivity = {
      id: generateId(`act-${place.id}`),
      placeId: place.id,
      placeName: place.name,
      category: place.category,
      image: place.images[0] || '',
      rating: place.rating,
      reviewCount: place.reviewCount,
      estimatedDuration: place.estimatedDuration,
      approxCostInr: place.approxCostInr,
      distanceFromPrevious: '2.1 km (8 mins)',
      shortDescription: place.description,
      whyPlanRupeeRecommends: place.whyPlanRupeeRecommends,
      timeSlot: slot,
      openingHours: place.openingHours
    };

    const updatedDays = activeRoadmap.days.map(day => {
      if (day.dayNumber !== dayNumber) return day;
      return {
        ...day,
        activities: [...day.activities, newAct]
      };
    });
    setActiveRoadmap({ ...activeRoadmap, days: updatedDays });
  };

  const optimizeDay = (dayNumber: number) => {
    if (!activeRoadmap) return;
    const updatedDays = activeRoadmap.days.map(day => {
      if (day.dayNumber !== dayNumber) return day;
      // Reorganize activities logically: Morning, Afternoon, Evening, Dinner
      const slotOrder: Record<string, number> = { Morning: 1, Afternoon: 2, Evening: 3, Dinner: 4 };
      const sorted = [...day.activities].sort((a, b) => (slotOrder[a.timeSlot] || 5) - (slotOrder[b.timeSlot] || 5));
      // Re-assign optimized distances
      const withDistances = sorted.map((act, idx) => ({
        ...act,
        distanceFromPrevious: idx === 0 ? 'Starting Location' : `${(1.2 + idx * 0.7).toFixed(1)} km (${Math.round(4 + idx * 2.5)} mins optimal transit)`
      }));
      return { ...day, activities: withDistances };
    });
    setActiveRoadmap({ ...activeRoadmap, days: updatedDays });
  };

  // Consultations
  const bookConsultation = (params: {
    local: Local;
    date: string;
    time: string;
    travelers: string;
    question: string;
  }): ConsultationBooking => {
    const newBooking: ConsultationBooking = {
      id: generateId('cons'),
      localId: params.local.id,
      localName: params.local.name,
      localAvatar: params.local.avatar,
      city: params.local.city,
      date: params.date,
      time: params.time,
      travelers: params.travelers,
      question: params.question,
      consultationFee: params.local.consultationFee,
      status: 'Confirmed',
      createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setMyConsultations(prev => [newBooking, ...prev]);
    return newBooking;
  };

  // Concierge
  const submitConciergeRequest = (params: {
    category: string;
    query: string;
    city: City;
    timing: string;
    budget?: string;
    travelers: string;
    contactName: string;
    contactPhone: string;
  }): ConciergeRequest => {
    const newReq: ConciergeRequest = {
      id: generateId('req'),
      category: params.category,
      query: params.query,
      city: params.city,
      timing: params.timing,
      budget: params.budget,
      travelers: params.travelers,
      contactName: params.contactName,
      contactPhone: params.contactPhone,
      status: 'REQUEST_RECEIVED',
      createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      updates: [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stage: 'REQUEST_RECEIVED',
          sender: 'System',
          note: 'Concierge request logged and prioritized by PlanRupee dispatch desk.'
        }
      ]
    };

    setMyConciergeRequests(prev => [newReq, ...prev]);

    // Simulate concierge status pipeline progression over time
    setTimeout(() => {
      setMyConciergeRequests(prev => prev.map(item => {
        if (item.id !== newReq.id) return item;
        return {
          ...item,
          status: 'PLANRUPEE_CONCIERGE',
          updates: [
            ...item.updates,
            {
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              stage: 'PLANRUPEE_CONCIERGE',
              sender: 'PlanRupee Concierge',
              note: `Dedicated concierge agent assigned for ${item.city}. Contacting verified ground partners.`
            }
          ]
        };
      }));
    }, 4000);

    return newReq;
  };

  const advanceConciergeStatus = (requestId: string) => {
    const stages: ConciergeStatus[] = [
      'REQUEST_RECEIVED',
      'PLANRUPEE_CONCIERGE',
      'LOCAL_PARTNER',
      'REQUEST_CONFIRMED',
      'COMPLETED'
    ];

    setMyConciergeRequests(prev => prev.map(item => {
      if (item.id !== requestId) return item;
      const currentIndex = stages.indexOf(item.status);
      const nextIndex = Math.min(currentIndex + 1, stages.length - 1);
      const nextStage = stages[nextIndex];

      const stageNotes: Record<ConciergeStatus, string> = {
        REQUEST_RECEIVED: 'Request verified by system dispatch.',
        PLANRUPEE_CONCIERGE: 'Senior travel concierge assigned to coordinate arrangements.',
        LOCAL_PARTNER: 'Local ground specialist in the city engaged for direct execution.',
        REQUEST_CONFIRMED: 'Reservations & arrangements confirmed with private host.',
        COMPLETED: 'Experience delivered successfully. Welcome to PlanRupee.'
      };

      return {
        ...item,
        status: nextStage,
        updates: [
          ...item.updates,
          {
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            stage: nextStage,
            sender: nextStage === 'LOCAL_PARTNER' ? 'Local Partner' : 'PlanRupee Concierge',
            note: stageNotes[nextStage]
          }
        ]
      };
    }));
  };

  // Real Reviews Submission & Dynamic Rating Calculation
  const submitPlaceReview = (reviewData: Omit<PlaceReview, 'id' | 'date'>) => {
    const newRev: PlaceReview = {
      ...reviewData,
      id: generateId('rev-p'),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updatedReviews = [newRev, ...placeReviews];
    setPlaceReviews(updatedReviews);

    // Dynamic Recalculation of Place aggregate rating
    setPlaces(prevPlaces => prevPlaces.map(place => {
      if (place.id !== reviewData.placeId) return place;
      const matchingReviews = updatedReviews.filter(r => r.placeId === place.id);
      const sumRatings = matchingReviews.reduce((acc, r) => acc + r.overallRating, 0);
      const newRating = Number((sumRatings / matchingReviews.length).toFixed(1));
      return {
        ...place,
        rating: newRating,
        reviewCount: matchingReviews.length,
        userRecommendationsCount: place.userRecommendationsCount + 1
      };
    }));
  };

  const submitLocalReview = (reviewData: Omit<LocalReview, 'id' | 'date'>) => {
    const newRev: LocalReview = {
      ...reviewData,
      id: generateId('rev-l'),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updatedReviews = [newRev, ...localReviews];
    setLocalReviews(updatedReviews);

    // Dynamic Recalculation of Local rating
    setLocals(prevLocals => prevLocals.map(local => {
      if (local.id !== reviewData.localId) return local;
      const matching = updatedReviews.filter(r => r.localId === local.id);
      const sum = matching.reduce((acc, r) => acc + r.overallRating, 0);
      const newRating = Number((sum / matching.length).toFixed(2));
      return {
        ...local,
        rating: newRating,
        reviewCount: matching.length
      };
    }));
  };

  // Admin Actions
  const addNewPlace = (placeData: Omit<Place, 'id' | 'rating' | 'reviewCount' | 'localRecommendationsCount' | 'userRecommendationsCount' | 'recommendedByLocalIds'>) => {
    const newP: Place = {
      ...placeData,
      id: generateId(`place-${placeData.city.toLowerCase()}`),
      rating: 4.8,
      reviewCount: 1,
      localRecommendationsCount: 0,
      userRecommendationsCount: 1,
      recommendedByLocalIds: []
    };
    setPlaces(prev => [newP, ...prev]);
  };

  const verifyPlace = (placeId: string, status: VerificationStatus) => {
    setPlaces(prev => prev.map(p => p.id === placeId ? { ...p, verificationStatus: status } : p));
  };

  const verifyLocal = (localId: string, verified: boolean) => {
    setLocals(prev => prev.map(l => l.id === localId ? { ...l, verified, verificationStatus: verified ? 'verified' : 'unverified' } : l));
  };

  return (
    <PlanRupeeContext.Provider value={{
      currentCity,
      setCurrentCity,
      places,
      locals,
      placeReviews,
      localReviews,
      activeRoadmap,
      setActiveRoadmap,
      createNewRoadmap,
      updateRoadmapActivity,
      removeRoadmapActivity,
      addRoadmapActivity,
      optimizeDay,
      savedPlaceIds,
      toggleSavePlace,
      savedLocalIds,
      toggleSaveLocal,
      myConsultations,
      bookConsultation,
      myConciergeRequests,
      submitConciergeRequest,
      advanceConciergeStatus,
      submitPlaceReview,
      submitLocalReview,
      selectedLocalForModal,
      setSelectedLocalForModal,
      selectedPlaceForModal,
      setSelectedPlaceForModal,
      isLocalBookingModalOpen,
      setIsLocalBookingModalOpen,
      activeLocalToBook,
      setActiveLocalToBook,
      isReviewModalOpen,
      setIsReviewModalOpen,
      activePlaceToReview,
      setActivePlaceToReview,
      isBecomeLocalModalOpen,
      setIsBecomeLocalModalOpen,
      isAdminModalOpen,
      setIsAdminModalOpen,
      isConciergeModalOpen,
      setIsConciergeModalOpen,
      conciergePreselectedCategory,
      setConciergePreselectedCategory,
      addNewPlace,
      verifyPlace,
      verifyLocal
    }}>
      {children}
    </PlanRupeeContext.Provider>
  );
};

export const usePlanRupee = () => {
  const context = useContext(PlanRupeeContext);
  if (!context) {
    throw new Error('usePlanRupee must be used within a PlanRupeeProvider');
  }
  return context;
};
