export type City = 'Chandigarh' | 'Patiala' | 'Rajpura';

export type VerificationStatus = 'verified' | 'user_generated' | 'demo' | 'unverified';

export type PlaceCategory = 
  | 'Food' 
  | 'Café' 
  | 'Heritage' 
  | 'Shopping' 
  | 'Nature' 
  | 'Nightlife' 
  | 'Spiritual' 
  | 'Family' 
  | 'Photography' 
  | 'Hidden Gem';

export type TripMood = 
  | 'Romantic'
  | 'Family'
  | 'Spiritual'
  | 'Food'
  | 'Adventure'
  | 'Culture'
  | 'Nightlife'
  | 'Shopping'
  | 'Relaxation'
  | 'Photography';

export type Interest = 
  | 'Food'
  | 'Cafés'
  | 'Shopping'
  | 'Culture'
  | 'Heritage'
  | 'Nature'
  | 'Nightlife'
  | 'Photography'
  | 'Hidden Gems'
  | 'Spiritual Places'
  | 'Family Activities'
  | 'Local Experiences';

export type BudgetTier = 'Budget' | 'Moderate' | 'Premium' | 'Luxury';

export type TravelerCount = 'Solo' | '2' | '3–5' | '6+';

export interface PlaceReview {
  id: string;
  placeId: string;
  authorName: string;
  authorLocation?: string;
  date: string;
  overallRating: number;
  foodRating: number;
  ambienceRating: number;
  valueRating: number;
  cleanlinessRating: number;
  experienceRating: number;
  comment: string;
  photoUrl?: string;
  verificationType: 'verified_visit' | 'demo' | 'unverified';
}

export interface Place {
  id: string;
  name: string;
  city: City;
  category: PlaceCategory;
  address: string;
  coordinates?: { lat: number; lng: number };
  images: string[];
  description: string;
  openingHours: string;
  priceLevel: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  approxCostInr: number;
  rating: number; // dynamically computed or base verified
  reviewCount: number;
  localRecommendationsCount: number;
  userRecommendationsCount: number;
  recommendedByLocalIds: string[];
  verificationStatus: VerificationStatus;
  whyPlanRupeeRecommends: string;
  bestTimeToVisit: string;
  estimatedDuration: string;
  tags: string[];
}

export interface LocalPickItem {
  label: string;
  name: string;
  placeId?: string;
  description: string;
}

export interface LocalReel {
  id: string;
  title: string;
  views: string;
  duration: string;
  thumbnail: string;
  tag: string;
}

export interface LocalReview {
  id: string;
  localId: string;
  authorName: string;
  authorCity?: string;
  date: string;
  overallRating: number;
  knowledgeRating: number;
  helpfulnessRating: number;
  responsivenessRating: number;
  recommendationQualityRating: number;
  comment: string;
  verificationType: 'verified_consultation' | 'demo' | 'unverified';
}

export interface Local {
  id: string;
  name: string;
  city: City;
  title: string;
  verified: boolean;
  avatar: string;
  rating: number;
  reviewCount: number;
  travelersHelped: number;
  languages: string[];
  expertise: string[];
  consultationFee: number;
  bio: string;
  whyChooseMe: string;
  availability: string;
  instagramHandle: string;
  placesILoveIds: string[];
  localPicks: {
    bestBreakfast: LocalPickItem;
    bestCafe: LocalPickItem;
    bestSunset: LocalPickItem;
    bestStreetFood: LocalPickItem;
    bestDateSpot: LocalPickItem;
    bestHiddenPlace: LocalPickItem;
  };
  reels: LocalReel[];
  verificationStatus: VerificationStatus;
}

export interface RoadmapActivity {
  id: string;
  placeId: string;
  placeName: string;
  category: PlaceCategory;
  image: string;
  rating: number;
  reviewCount: number;
  estimatedDuration: string;
  approxCostInr: number;
  distanceFromPrevious: string;
  shortDescription: string;
  whyPlanRupeeRecommends: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Dinner';
  openingHours: string;
}

export interface RoadmapDay {
  dayNumber: number;
  title: string;
  subtitle: string;
  activities: RoadmapActivity[];
}

export interface Roadmap {
  id: string;
  city: City;
  title: string;
  tagline: string;
  totalDays: number;
  travelers: TravelerCount;
  budget: BudgetTier;
  moods: TripMood[];
  interests: Interest[];
  arrivalDate: string;
  departureDate: string;
  arrivalTime: string;
  departureTime: string;
  createdAt: string;
  days: RoadmapDay[];
}

export type ConciergeStatus = 
  | 'REQUEST_RECEIVED' 
  | 'PLANRUPEE_CONCIERGE' 
  | 'LOCAL_PARTNER' 
  | 'REQUEST_CONFIRMED' 
  | 'COMPLETED';

export interface ConciergeUpdate {
  timestamp: string;
  stage: ConciergeStatus;
  sender: 'PlanRupee Concierge' | 'Local Partner' | 'System';
  note: string;
}

export interface ConciergeRequest {
  id: string;
  category: string;
  query: string;
  city: City;
  timing: string;
  budget?: string;
  travelers: string;
  contactName: string;
  contactPhone: string;
  status: ConciergeStatus;
  createdAt: string;
  updates: ConciergeUpdate[];
}

export interface ConsultationBooking {
  id: string;
  localId: string;
  localName: string;
  localAvatar: string;
  city: City;
  date: string;
  time: string;
  travelers: string;
  question: string;
  consultationFee: number;
  status: 'Confirmed' | 'Completed' | 'Upcoming';
  createdAt: string;
}
