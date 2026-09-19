import { Local } from '../types';

export const INITIAL_LOCALS: Local[] = [
  {
    id: 'local-simran',
    name: 'Simran Kaur',
    city: 'Chandigarh',
    title: 'Chandigarh Local & Culinary Curator',
    verified: true,
    verificationStatus: 'verified',
    avatar: 'https://img.magnific.com/premium-photo/professional-indian-woman-confident-poised-business-portrait_606187-8193.jpg?w=360',
    rating: 4.9,
    reviewCount: 127,
    travelersHelped: 127,
    languages: ['English', 'Hindi', 'Punjabi'],
    expertise: ['Food', 'Cafés', 'Hidden Gems', 'Shopping'],
    consultationFee: 799,
    bio: 'Born and raised in Chandigarh. I know the cafés, food spots and quiet corners that don’t show up on typical tourist lists.',
    whyChooseMe: 'I have explored every single sector in Chandigarh over 26 years. Whether you want an undiscovered outdoor courtyard café, the best authentic butter chicken at midnight, or Le Corbusier secret archives, I tailor your day to your exact vibe.',
    availability: 'Available today • Instant response within 1 hour',
    instagramHandle: '@simran_chandigarhpicks',
    placesILoveIds: ['chd-rock-garden', 'chd-sukhna-lake', 'chd-virgin-courtyard', 'chd-pal-dhaba', 'chd-sector-8-cafes'],
    localPicks: {
      bestBreakfast: {
        label: 'Best Breakfast',
        name: 'Backpackers Cafe Sector 9',
        description: 'Crispy herb waffles and freshly pressed juice under warm timber lights.'
      },
      bestCafe: {
        label: 'Best Café',
        name: 'Virgin Courtyard Sector 7',
        placeId: 'chd-virgin-courtyard',
        description: 'White Mediterranean stone, bougainvillea, and hand-whipped tiramisu.'
      },
      bestSunset: {
        label: 'Best Sunset',
        name: 'Sukhna Lake Bird Sanctuary Trail',
        placeId: 'chd-sukhna-lake',
        description: 'Far quieter than the main promenade; the Shivalik hill shadows turn lilac.'
      },
      bestStreetFood: {
        label: 'Best Street Food',
        name: 'Sector 22 Rehri Market Chaat',
        description: 'Crispy golgappe with 5 types of flavored waters and roasted aloo tikki.'
      },
      bestDateSpot: {
        label: 'Best Date Spot',
        name: 'The Willow Cafe Sector 10',
        description: 'English country-cottage interiors with cozy balcony seating.'
      },
      bestHiddenPlace: {
        label: 'Best Hidden Place',
        name: 'Garden of Silence (Behind Sukhna Lake)',
        description: 'Concentric stone circles surrounding a seated Buddha in complete stillness.'
      }
    },
    reels: [
      {
        id: 'reel-simran-1',
        title: '3 Secret Courtyard Cafes in Chandigarh',
        views: '42.8K',
        duration: '0:38',
        thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
        tag: 'Cafes'
      },
      {
        id: 'reel-simran-2',
        title: 'Midnight Food Run: Pal Dhaba Butter Chicken',
        views: '68.1K',
        duration: '0:45',
        thumbnail: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
        tag: 'Food'
      },
      {
        id: 'reel-simran-3',
        title: 'Golden Hour at Sukhna Lake Quiet Trail',
        views: '31.4K',
        duration: '0:29',
        thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        tag: 'Sunset'
      }
    ]
  },
  {
    id: 'local-gurpreet',
    name: 'Gurpreet Singh',
    city: 'Patiala',
    title: 'Patiala Heritage Historian & Textile Enthusiast',
    verified: true,
    verificationStatus: 'verified',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    rating: 4.95,
    reviewCount: 94,
    travelersHelped: 94,
    languages: ['Punjabi', 'English', 'Hindi'],
    expertise: ['Heritage', 'Architecture', 'Royal Food', 'Textile Markets'],
    consultationFee: 849,
    bio: 'Heritage historian and third-generation Patiala resident. I will show you royal darbars, the finest handloom phulkaris, and true Patiala Shahi lassi.',
    whyChooseMe: 'I have archival access to Patiala’s princely history, relationships with 4th-generation master Phulkari embroiderers, and direct knowledge of royal court cuisine traditions.',
    availability: 'Available tomorrow • Response within 2 hours',
    instagramHandle: '@patiala_heritage_walks',
    placesILoveIds: ['ptl-qila-mubarak', 'ptl-sheesh-mahal', 'ptl-adalat-bazaar', 'ptl-gopal-sweets-lassi', 'ptl-baradari-gardens'],
    localPicks: {
      bestBreakfast: {
        label: 'Best Breakfast',
        name: 'Nagpal Kulche Chhole (Near Adalat Bazaar)',
        description: 'Tandoori layered Amritsari kulchas served with tangy chana and spicy tamarind chutney.'
      },
      bestCafe: {
        label: 'Best Café',
        name: 'Cafe Green Baradari',
        description: 'Historic colonial garden setting with freshly brewed South Indian filter coffee.'
      },
      bestSunset: {
        label: 'Best Sunset',
        name: 'Sheesh Mahal Suspension Bridge',
        placeId: 'ptl-sheesh-mahal',
        description: 'Reflections of the Maharaja’s palace of mirrors in the calm moat water.'
      },
      bestStreetFood: {
        label: 'Best Street Food',
        name: 'Chacha Lassi & Dahi Bhalle',
        placeId: 'ptl-gopal-sweets-lassi',
        description: 'Whipped chilled curd dumplings dusted with roasted cumin and pomegranate seeds.'
      },
      bestDateSpot: {
        label: 'Best Date Spot',
        name: 'Baradari Palace Heritage Lawns',
        placeId: 'ptl-baradari-gardens',
        description: 'Walking beneath 150-year-old mahogany trees under starlight.'
      },
      bestHiddenPlace: {
        label: 'Best Hidden Place',
        name: 'Darbar Hall Royal Armoury Vault',
        placeId: 'ptl-qila-mubarak',
        description: 'Ornate swords of Guru Gobind Singh and Mughal emperors in pure steel and gold.'
      }
    },
    reels: [
      {
        id: 'reel-gurpreet-1',
        title: 'Behind the Gates of Qila Mubarak',
        views: '54.2K',
        duration: '0:50',
        thumbnail: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
        tag: 'Heritage'
      },
      {
        id: 'reel-gurpreet-2',
        title: 'How Real Patiala Phulkari is Hand-Stitched',
        views: '79.5K',
        duration: '0:42',
        thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80',
        tag: 'Artisans'
      }
    ]
  },
  {
    id: 'local-harleen',
    name: 'Harleen Virdi',
    city: 'Chandigarh',
    title: 'Modernist Architect & Highway Explorer',
    verified: true,
    verificationStatus: 'verified',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    rating: 4.88,
    reviewCount: 83,
    travelersHelped: 83,
    languages: ['English', 'Punjabi', 'Hindi'],
    expertise: ['Modernist Architecture', 'Coffee', 'Highway Dhabas', 'Photography'],
    consultationFee: 699,
    bio: 'Architect and coffee enthusiast. I uncover Chandigarh’s Le Corbusier heritage secrets and Rajpura’s authentic post-partition food joints.',
    whyChooseMe: 'I connect the architectural brilliance of Chandigarh with the raw agrarian authenticity of nearby Rajpura and Patiala.',
    availability: 'Available today • Instant booking',
    instagramHandle: '@harleen_spaces',
    placesILoveIds: ['chd-capitol-complex', 'chd-sector-8-cafes', 'raj-kasturba-sewa-mandir', 'raj-gt-road-dhabas'],
    localPicks: {
      bestBreakfast: {
        label: 'Best Breakfast',
        name: 'Kasturba Khadi Organic Kitchen',
        placeId: 'raj-kasturba-sewa-mandir',
        description: 'Farm-fresh organic buttermilk, amla preserve, and handmade wheat chapatis.'
      },
      bestCafe: {
        label: 'Best Café',
        name: 'Midpoint Cafe Sector 8',
        placeId: 'chd-sector-8-cafes',
        description: 'Minimalist pour-overs, natural light, and quiet design books.'
      },
      bestSunset: {
        label: 'Best Sunset',
        name: 'Capitol Complex Open Hand Esplanade',
        placeId: 'chd-capitol-complex',
        description: 'The monumental shadow of the rotating hand aligns with the sunset breeze.'
      },
      bestStreetFood: {
        label: 'Best Street Food',
        name: 'Eagle Dhaba Tandoor (Rajpura NH44)',
        placeId: 'raj-gt-road-dhabas',
        description: 'Charred smoked paneer tikka with raw sliced onions and mint chutney.'
      },
      bestDateSpot: {
        label: 'Best Date Spot',
        name: 'Olive & Herb Sector 7',
        description: 'Intimate terrace garden dining with wood-fired sourdough pizzas.'
      },
      bestHiddenPlace: {
        label: 'Best Hidden Place',
        name: 'Pierre Jeanneret Museum Sector 5',
        description: 'The restored modernist home of Corbusier’s cousin with original teak furniture.'
      }
    },
    reels: [
      {
        id: 'reel-harleen-1',
        title: 'Secrets Inside Chandigarh High Court',
        views: '38.9K',
        duration: '0:35',
        thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        tag: 'Architecture'
      }
    ]
  },
  {
    id: 'local-amanjit',
    name: 'Amanjit Sandhu',
    city: 'Rajpura',
    title: 'GT Road Chronicler & Agrarian Guide',
    verified: true,
    verificationStatus: 'verified',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    rating: 4.85,
    reviewCount: 61,
    travelersHelped: 61,
    languages: ['Punjabi', 'Hindi'],
    expertise: ['GT Road Dhabas', 'Local Markets', 'Rural Experiences', 'Sikh Heritage'],
    consultationFee: 599,
    bio: 'Highway food explorer and cultural storyteller. Grew up along the historic Grand Trunk Road, knowing every dhaba cook and grain market elder.',
    whyChooseMe: 'I will introduce you to true rural hospitality, family-run highway tandoors, and the rich refugee rehabilitation legacy of Rajpura.',
    availability: 'Available today • Response within 30 mins',
    instagramHandle: '@amanjit_gttrail',
    placesILoveIds: ['raj-gt-road-dhabas', 'raj-kasturba-sewa-mandir', 'raj-grain-mandi', 'raj-guru-tegh-bahadur'],
    localPicks: {
      bestBreakfast: {
        label: 'Best Breakfast',
        name: 'Neelam Kachori & Desi Ghee Jalebi',
        placeId: 'raj-neelam-plaza',
        description: 'Fresh piping hot kachoris with fragrant hing-spiced aloo.'
      },
      bestCafe: {
        label: 'Best Café',
        name: 'Chai & Kisaan Hub (NH 44)',
        description: 'Clay kulhad chai made with organic buffalo milk and fresh ginger.'
      },
      bestSunset: {
        label: 'Best Sunset',
        name: 'Fields of Bahadurgarh Border',
        description: 'Golden mustard fields stretching into the horizon with ancient fort ramparts.'
      },
      bestStreetFood: {
        label: 'Best Street Food',
        name: 'Puran Singh Legacy Dhaba Tandoor',
        placeId: 'raj-gt-road-dhabas',
        description: 'Crisp layered tandoori rotis served straight onto steel plates with yellow dal.'
      },
      bestDateSpot: {
        label: 'Best Date Spot',
        name: 'Kasturba Orchard Shaded Canopies',
        placeId: 'raj-kasturba-sewa-mandir',
        description: 'Peaceful afternoon walks under fruit canopies.'
      },
      bestHiddenPlace: {
        label: 'Best Hidden Place',
        name: 'Ancient Mughal Sarai Remains',
        description: '17th-century brick caravanserai arches where medieval travelers rested on the GT Road.'
      }
    },
    reels: [
      {
        id: 'reel-amanjit-1',
        title: '50-Year Old Tandoor Secret on GT Road',
        views: '92.3K',
        duration: '0:48',
        thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        tag: 'Dhabas'
      }
    ]
  }
];
