import { City, BudgetTier, TravelerCount, TripMood, Interest, Roadmap, RoadmapDay, RoadmapActivity, Place } from '../types';
import { INITIAL_PLACES } from './places';

// Helper to generate a unique ID
export const generateId = (prefix = 'id'): string => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export function generateRoadmap({
  city,
  arrivalDate,
  departureDate,
  arrivalTime = '10:00',
  departureTime = '18:00',
  travelers = '2',
  budget = 'Moderate',
  moods = ['Food', 'Culture'],
  interests = ['Food', 'Cafés', 'Heritage'],
}: {
  city: City;
  arrivalDate: string;
  departureDate: string;
  arrivalTime?: string;
  departureTime?: string;
  travelers?: TravelerCount;
  budget?: BudgetTier;
  moods?: TripMood[];
  interests?: Interest[];
}): Roadmap {
  // Calculate day count
  const start = new Date(arrivalDate || Date.now());
  const end = new Date(departureDate || Date.now() + 86400000 * 3);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  let totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  if (isNaN(totalDays) || totalDays < 1) totalDays = 3;
  if (totalDays > 7) totalDays = 7; // Cap at 7 days for UI perfection

  // Filter available places for this city
  const cityPlaces = INITIAL_PLACES.filter(p => p.city === city);

  // Day templates according to city
  const dayThemes: Record<City, { title: string; subtitle: string }[]> = {
    Chandigarh: [
      { title: 'Discover The Modernist Grid', subtitle: 'Sculpture gardens, tranquil lake sunsets & pedestrian boulevards' },
      { title: 'Food & Culinary Heritage', subtitle: 'Legendary butter chicken, artisan courtyard cafes & street chaat' },
      { title: 'Hidden Chandigarh & Corbusier', subtitle: 'UNESCO Capitol complex, French architecture & quiet gardens' },
      { title: 'Shopping, Boutiques & Markets', subtitle: 'Sector 8 espresso bars, fashion arcades & local handicrafts' },
      { title: 'Slow Morning, Nature & Departure', subtitle: 'Rose garden strolls, organic breakfast & farewell coffee' },
      { title: 'Art & Cultural Immersion', subtitle: 'Government art museum, Tagore theatre & craft bazaars' },
      { title: 'Surrounding Foothills & Relaxation', subtitle: 'Pinjore gardens gateway and scenic valley drives' }
    ],
    Patiala: [
      { title: 'Royal Princely Splendor', subtitle: 'Qila Mubarak darbars, Belgian chandeliers & royal armory' },
      { title: 'Phulkari Crafts & Artisan Bazaars', subtitle: 'Adalat Bazaar handloom master-weavers & Patiala Shahi juttis' },
      { title: 'Palaces, Mirrors & Lakes', subtitle: 'Sheesh Mahal suspension bridge, Kangra frescoes & sunset walks' },
      { title: 'Spiritual Solace & Royal Flavors', subtitle: 'Gurdwara Dukh Niwaran Sahib & iconic malai lassi' },
      { title: 'Baradari Gardens & Departure', subtitle: 'Colonial pavilions, 150-year-old trees & heritage breakfast' },
      { title: 'Hidden Haveli Architecture', subtitle: 'Old walled city gates and traditional brass-work lanes' },
      { title: 'Fortress Excursion & Folk Music', subtitle: 'Bahadurgarh fort ramparts and Malwa folk stories' }
    ],
    Rajpura: [
      { title: 'Historic GT Road & Highway Flavors', subtitle: '50-year-old coal-fired dhabas, tandoori treats & highway stories' },
      { title: 'Gandhian Legacy & Rural Artisans', subtitle: 'Kasturba Sewa Mandir khadi spinning, orchards & partition heritage' },
      { title: 'Agrarian Heart & Morning Mandi', subtitle: 'Bustling grain auctions, spice merchants & kadak kulhad chai' },
      { title: 'Spiritual Solace & Heritage Trails', subtitle: 'Gurdwara Sri Guru Tegh Bahadur Sahib & peaceful community langar' },
      { title: 'Local Delicacies & Farewell', subtitle: 'Neelam fresh dal kachoris, desi ghee jalebis & highway souvenirs' },
      { title: 'Mughal Caravanserai Remains', subtitle: 'Ancient GT Road brick arches and local folklore' },
      { title: 'Farming Traditions & Countryside', subtitle: 'Mustard field walks and rural community hospitality' }
    ]
  };

  const days: RoadmapDay[] = [];

  for (let i = 0; i < totalDays; i++) {
    const theme = dayThemes[city][i % dayThemes[city].length];
    
    // Pick activities for Morning, Afternoon, Evening, Dinner
    const morningPlace = pickPlaceForSlot(cityPlaces, 'Morning', i, moods);
    const afternoonPlace = pickPlaceForSlot(cityPlaces, 'Afternoon', i + 1, moods);
    const eveningPlace = pickPlaceForSlot(cityPlaces, 'Evening', i + 2, moods);
    const dinnerPlace = pickPlaceForSlot(cityPlaces, 'Dinner', i + 3, moods);

    const activities: RoadmapActivity[] = [
      createActivity(morningPlace, 'Morning', 'Starting point', '09:00 AM – 12:00 PM'),
      createActivity(afternoonPlace, 'Afternoon', '2.8 km (10 mins drive)', '01:00 PM – 03:30 PM'),
      createActivity(eveningPlace, 'Evening', '3.4 km (12 mins drive)', '04:30 PM – 07:00 PM'),
      createActivity(dinnerPlace, 'Dinner', '1.9 km (7 mins drive)', '08:00 PM – 10:30 PM'),
    ];

    days.push({
      dayNumber: i + 1,
      title: theme.title,
      subtitle: theme.subtitle,
      activities
    });
  }

  return {
    id: generateId(`roadmap-${city.toLowerCase()}`),
    city,
    title: `${totalDays} DAYS IN ${city.toUpperCase()}`,
    tagline: 'Your personalized day-by-day roadmap curated by PlanRupee community & ground locals.',
    totalDays,
    travelers,
    budget,
    moods,
    interests,
    arrivalDate,
    departureDate,
    arrivalTime,
    departureTime,
    createdAt: new Date().toISOString(),
    days
  };
}

function pickPlaceForSlot(places: Place[], slot: 'Morning' | 'Afternoon' | 'Evening' | 'Dinner', indexOffset: number, moods: TripMood[]): Place {
  if (places.length === 0) {
    return INITIAL_PLACES[0];
  }

  if (slot === 'Dinner' || slot === 'Morning' && moods.includes('Food')) {
    const foodPlaces = places.filter(p => p.category === 'Food' || p.category === 'Café');
    if (foodPlaces.length > 0) {
      return foodPlaces[indexOffset % foodPlaces.length];
    }
  }

  if (slot === 'Morning') {
    const morningCandidates = places.filter(p => p.category === 'Heritage' || p.category === 'Nature' || p.category === 'Spiritual');
    if (morningCandidates.length > 0) {
      return morningCandidates[indexOffset % morningCandidates.length];
    }
  }

  if (slot === 'Evening') {
    const eveningCandidates = places.filter(p => p.category === 'Shopping' || p.category === 'Nature' || p.category === 'Café');
    if (eveningCandidates.length > 0) {
      return eveningCandidates[indexOffset % eveningCandidates.length];
    }
  }

  return places[indexOffset % places.length];
}

function createActivity(place: Place, timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Dinner', distance: string, timeWindow: string): RoadmapActivity {
  return {
    id: generateId(`act-${place.id}`),
    placeId: place.id,
    placeName: place.name,
    category: place.category,
    image: place.images[0] || 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1000&q=80',
    rating: place.rating,
    reviewCount: place.reviewCount,
    estimatedDuration: place.estimatedDuration,
    approxCostInr: place.approxCostInr,
    distanceFromPrevious: distance,
    shortDescription: place.description,
    whyPlanRupeeRecommends: place.whyPlanRupeeRecommends,
    timeSlot,
    openingHours: `${timeWindow} (${place.openingHours})`
  };
}
