import type { Destination, User, RASResult, PreviousWin, Unit, DemandTier, VacationRequest, AmbassadorProfile, HistoricalRelease } from '../types';
import { addDays, subQuarters } from 'date-fns';

// Unit image URLs by type
const unitImages: Record<string, string[]> = {
  beach: [
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  ],
  mountain: [
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80',
    'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80',
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80',
  ],
  luxury: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
  ],
  vineyard: [
    'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  ],
  lake: [
    'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80',
  ],
  desert: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80',
  ],
  historic: [
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
  ],
};

// Helper to create units for destinations
interface UnitConfig {
  bedrooms: number;
  sleeps: number;
  bathrooms?: number;
  squareFeet?: number;
  features?: string[];
  description?: string;
}

const createUnits = (baseName: string, imageType: string, configs: UnitConfig[]): Unit[] => {
  const images = unitImages[imageType] || unitImages.luxury;
  return configs.map((config, index) => ({
    id: `unit-${baseName}-${index + 1}`,
    name: `${config.bedrooms === 1 ? 'One' : config.bedrooms === 2 ? 'Two' : config.bedrooms === 3 ? 'Three' : 'Four'} Bedroom ${config.bedrooms === 1 ? 'Suite' : 'Residence'}`,
    bedrooms: config.bedrooms,
    sleeps: config.sleeps,
    bathrooms: config.bathrooms || config.bedrooms,
    squareFeet: config.squareFeet || (800 + config.bedrooms * 400),
    features: config.features || [],
    description: config.description || `A beautiful ${config.bedrooms}-bedroom accommodation perfect for up to ${config.sleeps} guests.`,
    imageUrl: images[index % images.length],
    images: images,
  }));
};

export const destinations: Destination[] = [
  {
    id: 'dest-1',
    name: 'Maui Oceanfront Villa',
    imageUrl: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800&q=80',
    region: 'Hawaii',
    description: 'Stunning beachfront property with panoramic ocean views',
    units: createUnits('maui', 'beach', [
      { bedrooms: 2, sleeps: 4, bathrooms: 2, squareFeet: 1200, features: ['Ocean View', 'Private Lanai', 'Full Kitchen', 'Washer/Dryer'], description: 'Wake up to stunning Pacific views in this elegant two-bedroom suite featuring a spacious private lanai, perfect for morning coffee while watching the sunrise.' },
      { bedrooms: 3, sleeps: 6, bathrooms: 3, squareFeet: 1800, features: ['Ocean View', 'Private Pool', 'Chef Kitchen', 'Outdoor Shower'], description: 'Expansive three-bedroom residence with a private infinity pool overlooking the ocean. The gourmet chef kitchen is perfect for entertaining.' },
      { bedrooms: 4, sleeps: 8, bathrooms: 4, squareFeet: 2800, features: ['Oceanfront', 'Private Pool', 'Butler Service', 'Home Theater'], description: 'Our premier oceanfront estate offers unparalleled luxury with direct beach access, dedicated butler service, and resort-style amenities.' },
    ]),
    demandTier: 'peak' as DemandTier,
    featured: true,
    suggestedStartDay: 0,
  },
  {
    id: 'dest-2',
    name: 'Aspen Mountain Lodge',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    region: 'Colorado',
    description: 'Luxury ski-in/ski-out accommodation in the heart of Aspen',
    units: createUnits('aspen', 'mountain', [
      { bedrooms: 2, sleeps: 4, bathrooms: 2, squareFeet: 1100, features: ['Ski-in/Ski-out', 'Fireplace', 'Boot Warmers', 'Mountain View'], description: 'Cozy ski-in/ski-out retreat with a crackling fireplace and stunning mountain vistas. Step directly onto the slopes from your door.' },
      { bedrooms: 3, sleeps: 6, bathrooms: 3, squareFeet: 1600, features: ['Ski-in/Ski-out', 'Hot Tub', 'Mountain View', 'Gourmet Kitchen'], description: 'Spacious three-bedroom lodge with a private hot tub to soak in after a day on the slopes. Panoramic mountain views from every room.' },
      { bedrooms: 4, sleeps: 10, bathrooms: 4, squareFeet: 2400, features: ['Ski-in/Ski-out', 'Private Hot Tub', 'Game Room', 'Wine Cellar'], description: 'The ultimate ski retreat featuring a private game room, wine cellar, and hot tub. Perfect for families or groups seeking the finest Aspen experience.' },
    ]),
    demandTier: 'super-peak' as DemandTier,
    featured: true,
    available: true,
    suggestedStartDay: 0,
  },
  {
    id: 'dest-3',
    name: 'Napa Valley Estate',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    region: 'California',
    description: 'Private vineyard retreat with wine tasting experiences',
    units: createUnits('napa', 'vineyard', [
      { bedrooms: 1, sleeps: 2, bathrooms: 1, squareFeet: 800, features: ['Vineyard View', 'Wine Cellar Access', 'Soaking Tub', 'Fireplace'], description: 'Romantic one-bedroom suite overlooking rolling vineyards. Includes complimentary wine cellar access and a luxurious soaking tub.' },
      { bedrooms: 2, sleeps: 4, bathrooms: 2, squareFeet: 1400, features: ['Vineyard View', 'Private Terrace', 'Wine Fridge', 'Outdoor Dining'], description: 'Elegant two-bedroom residence with a private terrace perfect for al fresco dining among the vines. Curated wine selection included.' },
      { bedrooms: 3, sleeps: 6, bathrooms: 3, squareFeet: 2200, features: ['Estate House', 'Pool', 'Wine Tasting Room', 'Chef Kitchen'], description: 'Exclusive estate house with private pool and dedicated wine tasting room. Host your own private tastings with our sommelier.' },
    ]),
    demandTier: 'shoulder' as DemandTier,
  },
  {
    id: 'dest-4',
    name: 'Miami South Beach Penthouse',
    imageUrl: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&q=80',
    region: 'Florida',
    description: 'Art Deco luxury with stunning city and ocean views',
    units: createUnits('miami', 'luxury', [
      { bedrooms: 2, sleeps: 4, bathrooms: 2, squareFeet: 1300, features: ['Ocean View', 'Rooftop Access', 'Designer Interiors', 'Smart Home'], description: 'Stylish Art Deco-inspired residence with panoramic ocean views and exclusive rooftop pool access. Experience the best of South Beach.' },
      { bedrooms: 3, sleeps: 6, bathrooms: 3, squareFeet: 2000, features: ['Penthouse', 'Private Terrace', 'City View', 'Concierge'], description: 'Stunning penthouse with wraparound terrace offering 360-degree views of Miami skyline and ocean. Dedicated concierge service included.' },
    ]),
    demandTier: 'peak' as DemandTier,
    suggestedStartDay: 0,
  },
  {
    id: 'dest-5',
    name: 'Lake Tahoe Cabin',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    region: 'California/Nevada',
    description: 'Rustic elegance on the shores of crystal-clear Lake Tahoe',
    units: createUnits('tahoe', 'lake', [
      { bedrooms: 2, sleeps: 4, bathrooms: 2, squareFeet: 1200, features: ['Lake View', 'Fireplace', 'Deck', 'Kayak Access'], description: 'Charming lakeside cabin with stunning Tahoe views. Cozy up by the stone fireplace or enjoy the deck overlooking the crystal-clear waters.' },
      { bedrooms: 3, sleeps: 6, bathrooms: 2, squareFeet: 1800, features: ['Lakefront', 'Private Dock', 'Hot Tub', 'Fire Pit'], description: 'Lakefront retreat with private dock and hot tub. Spend evenings around the fire pit watching the sunset over the Sierra Nevada.' },
      { bedrooms: 4, sleeps: 8, bathrooms: 4, squareFeet: 3000, features: ['Lakefront Estate', 'Private Beach', 'Boat House', 'Game Room'], description: 'Magnificent lakefront estate with private beach and boat house. The ultimate Tahoe experience for families and groups.' },
    ]),
    demandTier: 'shoulder' as DemandTier,
  },
  {
    id: 'dest-6',
    name: 'Scottsdale Desert Oasis',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    region: 'Arizona',
    description: 'Modern desert retreat with private pool and mountain views',
    units: createUnits('scottsdale', 'desert', [
      { bedrooms: 2, sleeps: 4, bathrooms: 2, squareFeet: 1400, features: ['Mountain View', 'Private Patio', 'Desert Garden', 'Spa Bath'], description: 'Modern desert hideaway with stunning Camelback Mountain views. Relax on your private patio surrounded by native desert landscaping.' },
      { bedrooms: 3, sleeps: 6, bathrooms: 3, squareFeet: 2000, features: ['Private Pool', 'Outdoor Kitchen', 'Fire Pit', 'Casita'], description: 'Southwestern-style residence with sparkling private pool and outdoor kitchen. Perfect for enjoying Arizona\'s famous sunsets.' },
      { bedrooms: 4, sleeps: 8, bathrooms: 4, squareFeet: 3200, features: ['Private Pool', 'Spa', 'Golf Cart', 'Putting Green'], description: 'Luxurious desert compound with private pool, spa, and putting green. Golf cart included for exploring the resort.' },
    ]),
    demandTier: 'off-season' as DemandTier,
  },
  {
    id: 'dest-7',
    name: 'Cape Cod Beach House',
    imageUrl: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
    region: 'Massachusetts',
    description: 'Classic New England charm steps from the Atlantic',
    units: createUnits('capecod', 'beach', [
      { bedrooms: 2, sleeps: 4, bathrooms: 2, squareFeet: 1100, features: ['Ocean View', 'Wraparound Porch', 'Outdoor Shower', 'Beach Gear'], description: 'Quintessential Cape Cod cottage with ocean views and classic wraparound porch. Beach chairs and umbrellas provided.' },
      { bedrooms: 3, sleeps: 6, bathrooms: 2, squareFeet: 1600, features: ['Beachfront', 'Private Beach Access', 'Deck', 'Lobster Pot'], description: 'Beachfront home with private path to the sand. Includes lobster pot and gear for authentic New England seafood feasts.' },
      { bedrooms: 4, sleeps: 8, bathrooms: 4, squareFeet: 2800, features: ['Estate', 'Pool', 'Tennis Court', 'Guest House'], description: 'Grand Cape Cod estate with pool, tennis court, and separate guest house. The perfect setting for a memorable family reunion.' },
    ]),
    demandTier: 'peak' as DemandTier,
    suggestedStartDay: 0,
  },
  {
    id: 'dest-8',
    name: 'Park City Ski Chalet',
    imageUrl: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=800&q=80',
    region: 'Utah',
    description: "Slope-side luxury in America's premier ski destination",
    units: createUnits('parkcity', 'mountain', [
      { bedrooms: 2, sleeps: 4, bathrooms: 2, squareFeet: 1200, features: ['Ski-in/Ski-out', 'Heated Floors', 'Fireplace', 'Ski Locker'], description: 'Cozy slope-side chalet with heated floors to warm your feet after a day on the mountain. Ski-in/ski-out access to Park City\'s best runs.' },
      { bedrooms: 3, sleeps: 6, bathrooms: 3, squareFeet: 1800, features: ['Ski-in/Ski-out', 'Private Hot Tub', 'Mountain View', 'Mudroom'], description: 'Mountain modern residence with private hot tub and stunning views of the Wasatch Range. Generous mudroom for all your gear.' },
      { bedrooms: 4, sleeps: 10, bathrooms: 4, squareFeet: 3500, features: ['Ski-in/Ski-out', 'Cinema Room', 'Wine Cellar', 'Elevator'], description: 'Ultimate ski mansion with private cinema, wine cellar, and elevator. The pinnacle of Park City luxury.' },
    ]),
    demandTier: 'super-peak' as DemandTier,
    suggestedStartDay: 0,
  },
  {
    id: 'dest-9',
    name: 'Charleston Historic Manor',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    region: 'South Carolina',
    description: 'Southern elegance in the heart of historic Charleston',
    units: createUnits('charleston', 'historic', [
      { bedrooms: 2, sleeps: 4, bathrooms: 2, squareFeet: 1300, features: ['Garden View', 'Historic Details', 'Piazza', 'Clawfoot Tub'], description: 'Beautifully restored historic residence featuring original heart pine floors, antique furnishings, and a charming garden piazza.' },
      { bedrooms: 3, sleeps: 6, bathrooms: 3, squareFeet: 2000, features: ['Courtyard', 'Private Garden', 'Chef Kitchen', 'Carriage House'], description: 'Elegant manor house with private courtyard garden and attached carriage house. Experience Charleston\'s legendary hospitality.' },
    ]),
    demandTier: 'shoulder' as DemandTier,
  },
  {
    id: 'dest-10',
    name: 'San Diego Coastal Retreat',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    region: 'California',
    description: 'Beachside paradise with year-round perfect weather',
    units: createUnits('sandiego', 'beach', [
      { bedrooms: 2, sleeps: 4, bathrooms: 2, squareFeet: 1200, features: ['Ocean View', 'Balcony', 'Beach Access', 'Surf Storage'], description: 'Coastal contemporary with stunning ocean views and direct beach access. Includes surfboard storage for wave enthusiasts.' },
      { bedrooms: 3, sleeps: 6, bathrooms: 2, squareFeet: 1700, features: ['Beachfront', 'Private Patio', 'BBQ', 'Fire Pit'], description: 'Beachfront home with private patio, BBQ, and fire pit. Perfect for sunset gatherings and beach bonfires.' },
      { bedrooms: 4, sleeps: 8, bathrooms: 4, squareFeet: 2800, features: ['Beachfront Estate', 'Pool', 'Outdoor Living', 'Guest Suite'], description: 'Magnificent beachfront estate with infinity pool and expansive outdoor living areas. Separate guest suite offers privacy for larger groups.' },
    ]),
    demandTier: 'peak' as DemandTier,
  },
];

const now = new Date();

// Sample previous wins for TRVR calculation
const regularPreviousWins: PreviousWin[] = [
  { destinationId: 'dest-1', date: subQuarters(now, 2), quarterAgo: 2 },
  { destinationId: 'dest-3', date: subQuarters(now, 4), quarterAgo: 4 },
];

const ultraPreviousWins: PreviousWin[] = [
  { destinationId: 'dest-2', date: subQuarters(now, 1), quarterAgo: 1 },
  { destinationId: 'dest-5', date: subQuarters(now, 3), quarterAgo: 3 },
  { destinationId: 'dest-7', date: subQuarters(now, 5), quarterAgo: 5 },
];

const VACATION_DAYS_DEFAULT = 20;

export const sampleUsers: Record<string, User> = {
  regular: {
    id: 'user-1',
    name: 'Sarah Johnson',
    memberType: 'regular',
    vacationDays: VACATION_DAYS_DEFAULT,
    arTokens: 3,
    maxArTokens: 5,
    previousWins: regularPreviousWins,
    wishListDestination: 'dest-1', // Maui
    wishListYears: 3,
    isFirstTime: false,
  },
  ultra: {
    id: 'user-2',
    name: 'Michael Chen',
    memberType: 'ultra',
    vacationDays: VACATION_DAYS_DEFAULT,
    arTokens: 8,
    maxArTokens: 10,
    previousWins: ultraPreviousWins,
    isFirstTime: false,
  },
  'first-time': {
    id: 'user-3',
    name: 'Emily Rodriguez',
    memberType: 'regular',
    vacationDays: VACATION_DAYS_DEFAULT,
    arTokens: 5,
    maxArTokens: 5,
    previousWins: [],
    isFirstTime: true,
  },
  'results-mix': {
    id: 'user-4',
    name: 'David Park',
    memberType: 'regular',
    vacationDays: VACATION_DAYS_DEFAULT,
    arTokens: 2,
    maxArTokens: 5,
    previousWins: regularPreviousWins,
    isFirstTime: false,
  },
  'no-wins': {
    id: 'user-5',
    name: 'Lisa Thompson',
    memberType: 'regular',
    vacationDays: VACATION_DAYS_DEFAULT,
    arTokens: 4,
    maxArTokens: 5,
    previousWins: [],
    isFirstTime: false,
  },
};

// Generate mock results for different scenarios
export const generateMockResults = (scenario: string): RASResult[] => {
  const baseDate = new Date();
  const deadline = addDays(baseDate, 2); // 48-hour deadline

  switch (scenario) {
    case 'results-mix':
      return [
        {
          id: 'result-1',
          requestId: 'req-1',
          destination: destinations[0], // Maui
          unit: destinations[0].units[1], // 3BR
          status: 'won',
          matchedDates: {
            checkIn: addDays(baseDate, 30),
            checkOut: addDays(baseDate, 37),
          },
          originalCheckIn: addDays(baseDate, 28), // Different - used flexibility
          originalCheckOut: addDays(baseDate, 35),
          originalRank: 1,
          pointsInvested: 7,
          percentOfBudget: 35,
          acceptStatus: 'pending',
          declineDeadline: deadline,
          arTokensUsed: 1,
        },
        {
          id: 'result-2',
          requestId: 'req-2',
          destination: destinations[2], // Napa
          status: 'lost',
          originalCheckIn: addDays(baseDate, 45),
          originalCheckOut: addDays(baseDate, 49),
          originalRank: 2,
          pointsInvested: 5,
          percentOfBudget: 25,
          declineDeadline: deadline,
          arTokensUsed: 0,
        },
        {
          id: 'result-3',
          requestId: 'req-3',
          destination: destinations[4], // Lake Tahoe
          unit: destinations[4].units[0], // 2BR
          status: 'won',
          matchedDates: {
            checkIn: addDays(baseDate, 60),
            checkOut: addDays(baseDate, 65),
          },
          originalCheckIn: addDays(baseDate, 60),
          originalCheckOut: addDays(baseDate, 65),
          originalRank: 3,
          pointsInvested: 5,
          percentOfBudget: 25,
          acceptStatus: 'pending',
          declineDeadline: deadline,
          arTokensUsed: 1,
        },
        {
          id: 'result-4',
          requestId: 'req-4',
          destination: destinations[6], // Cape Cod
          status: 'lost',
          originalCheckIn: addDays(baseDate, 75),
          originalCheckOut: addDays(baseDate, 81),
          originalRank: 4,
          pointsInvested: 3,
          percentOfBudget: 15,
          declineDeadline: deadline,
          arTokensUsed: 0,
        },
      ];

    case 'no-wins':
      return [
        {
          id: 'result-1',
          requestId: 'req-1',
          destination: destinations[0],
          status: 'lost',
          originalCheckIn: addDays(baseDate, 30),
          originalCheckOut: addDays(baseDate, 37),
          originalRank: 1,
          pointsInvested: 8,
          percentOfBudget: 40,
          declineDeadline: deadline,
          arTokensUsed: 0,
        },
        {
          id: 'result-2',
          requestId: 'req-2',
          destination: destinations[2],
          status: 'lost',
          originalCheckIn: addDays(baseDate, 45),
          originalCheckOut: addDays(baseDate, 50),
          originalRank: 2,
          pointsInvested: 6,
          percentOfBudget: 30,
          declineDeadline: deadline,
          arTokensUsed: 0,
        },
      ];

    default:
      return [];
  }
};

// ─── Ambassador mock data ──────────────────────────────────────────────────

const ambBase = new Date();
const ambDeadline = addDays(ambBase, 2);

// Member 1: Alice Thornton — Regular — results available (self-submitted, won Aspen)
const aliceUser: User = {
  id: 'amb-member-1',
  name: 'Alice Thornton',
  memberType: 'regular',
  vacationDays: 20,
  arTokens: 3,
  maxArTokens: 5,
  previousWins: [{ destinationId: 'dest-7', date: subQuarters(ambBase, 3), quarterAgo: 3 }],
  isFirstTime: false,
};

const aliceRequests: VacationRequest[] = [
  {
    id: 'alice-req-1',
    destination: destinations[1], // Aspen (super-peak)
    checkInDate: addDays(ambBase, 35),
    checkOutDate: addDays(ambBase, 42),
    selectedUnit: destinations[1].units[1],
    flexibleDates: false,
    mustIncludeWeekend: true,
    pointsAllocated: 10,
    rank: 1,
    submittedBy: 'member',
  },
  {
    id: 'alice-req-2',
    destination: destinations[0], // Maui (peak)
    checkInDate: addDays(ambBase, 55),
    checkOutDate: addDays(ambBase, 62),
    selectedUnit: null,
    flexibleDates: true,
    mustIncludeWeekend: false,
    pointsAllocated: 6,
    rank: 2,
    submittedBy: 'member',
  },
  {
    id: 'alice-req-3',
    destination: destinations[4], // Lake Tahoe (shoulder)
    checkInDate: addDays(ambBase, 70),
    checkOutDate: addDays(ambBase, 75),
    selectedUnit: null,
    flexibleDates: false,
    mustIncludeWeekend: false,
    pointsAllocated: 4,
    rank: 3,
    submittedBy: 'member',
  },
];

const aliceResults: RASResult[] = [
  {
    id: 'alice-result-1',
    requestId: 'alice-req-1',
    destination: destinations[1], // Aspen
    unit: destinations[1].units[1],
    status: 'won',
    matchedDates: { checkIn: addDays(ambBase, 35), checkOut: addDays(ambBase, 42) },
    originalCheckIn: addDays(ambBase, 35),
    originalCheckOut: addDays(ambBase, 42),
    originalRank: 1,
    pointsInvested: 10,
    percentOfBudget: 50,
    acceptStatus: 'pending',
    declineDeadline: ambDeadline,
    arTokensUsed: 1,
  },
  {
    id: 'alice-result-2',
    requestId: 'alice-req-2',
    destination: destinations[0], // Maui
    status: 'lost',
    originalCheckIn: addDays(ambBase, 55),
    originalCheckOut: addDays(ambBase, 62),
    originalRank: 2,
    pointsInvested: 6,
    percentOfBudget: 30,
    declineDeadline: ambDeadline,
    arTokensUsed: 0,
  },
  {
    id: 'alice-result-3',
    requestId: 'alice-req-3',
    destination: destinations[4], // Lake Tahoe
    status: 'lost',
    originalCheckIn: addDays(ambBase, 70),
    originalCheckOut: addDays(ambBase, 75),
    originalRank: 3,
    pointsInvested: 4,
    percentOfBudget: 20,
    declineDeadline: ambDeadline,
    arTokensUsed: 0,
  },
];

// Member 2: Marcus Webb — Ultra — submitted (self-submitted, awaiting results)
const marcusUser: User = {
  id: 'amb-member-2',
  name: 'Marcus Webb',
  memberType: 'ultra',
  vacationDays: 20,
  arTokens: 8,
  maxArTokens: 10,
  previousWins: [
    { destinationId: 'dest-2', date: subQuarters(ambBase, 1), quarterAgo: 1 },
    { destinationId: 'dest-8', date: subQuarters(ambBase, 4), quarterAgo: 4 },
  ],
  isFirstTime: false,
};

const marcusRequests: VacationRequest[] = [
  {
    id: 'marcus-req-1',
    destination: destinations[7], // Park City (super-peak)
    checkInDate: addDays(ambBase, 40),
    checkOutDate: addDays(ambBase, 47),
    selectedUnit: destinations[7].units[2],
    flexibleDates: false,
    mustIncludeWeekend: true,
    pointsAllocated: 9,
    rank: 1,
    submittedBy: 'member',
  },
  {
    id: 'marcus-req-2',
    destination: destinations[1], // Aspen (super-peak)
    checkInDate: addDays(ambBase, 50),
    checkOutDate: addDays(ambBase, 57),
    selectedUnit: null,
    flexibleDates: true,
    mustIncludeWeekend: false,
    pointsAllocated: 7,
    rank: 2,
    submittedBy: 'member',
  },
  {
    id: 'marcus-req-3',
    destination: destinations[3], // Miami (peak)
    checkInDate: addDays(ambBase, 62),
    checkOutDate: addDays(ambBase, 69),
    selectedUnit: null,
    flexibleDates: false,
    mustIncludeWeekend: false,
    pointsAllocated: 5,
    rank: 3,
    submittedBy: 'member',
  },
  {
    id: 'marcus-req-4',
    destination: destinations[9], // San Diego (peak)
    checkInDate: addDays(ambBase, 80),
    checkOutDate: addDays(ambBase, 87),
    selectedUnit: null,
    flexibleDates: true,
    mustIncludeWeekend: false,
    pointsAllocated: 3,
    rank: 4,
    submittedBy: 'member',
  },
];

// Member 3: Caroline Park — Regular — in-progress (mix of member + ambassador)
const carolineUser: User = {
  id: 'amb-member-3',
  name: 'Caroline Park',
  memberType: 'regular',
  vacationDays: 20,
  arTokens: 4,
  maxArTokens: 5,
  previousWins: [],
  isFirstTime: false,
};

const carolineRequests: VacationRequest[] = [
  {
    id: 'caroline-req-1',
    destination: destinations[6], // Cape Cod (peak)
    checkInDate: addDays(ambBase, 45),
    checkOutDate: addDays(ambBase, 52),
    selectedUnit: null,
    flexibleDates: false,
    mustIncludeWeekend: true,
    pointsAllocated: 8,
    rank: 1,
    submittedBy: 'member',
  },
  {
    id: 'caroline-req-2',
    destination: destinations[2], // Napa (shoulder)
    checkInDate: addDays(ambBase, 58),
    checkOutDate: addDays(ambBase, 63),
    selectedUnit: null,
    flexibleDates: true,
    mustIncludeWeekend: false,
    pointsAllocated: 7,
    rank: 2,
    submittedBy: 'ambassador',
  },
  {
    id: 'caroline-req-3',
    destination: destinations[8], // Charleston (shoulder)
    checkInDate: addDays(ambBase, 70),
    checkOutDate: addDays(ambBase, 75),
    selectedUnit: null,
    flexibleDates: false,
    mustIncludeWeekend: false,
    pointsAllocated: 5,
    rank: 3,
    submittedBy: 'ambassador',
  },
];

// Member 4: Derek Mills — Regular — submitted (all ambassador-submitted)
const derekUser: User = {
  id: 'amb-member-4',
  name: 'Derek Mills',
  memberType: 'regular',
  vacationDays: 20,
  arTokens: 3,
  maxArTokens: 5,
  previousWins: [{ destinationId: 'dest-5', date: subQuarters(ambBase, 2), quarterAgo: 2 }],
  isFirstTime: false,
};

const derekRequests: VacationRequest[] = [
  {
    id: 'derek-req-1',
    destination: destinations[0], // Maui (peak)
    checkInDate: addDays(ambBase, 38),
    checkOutDate: addDays(ambBase, 45),
    selectedUnit: destinations[0].units[0],
    flexibleDates: false,
    mustIncludeWeekend: false,
    pointsAllocated: 8,
    rank: 1,
    submittedBy: 'ambassador',
  },
  {
    id: 'derek-req-2',
    destination: destinations[5], // Scottsdale (off-season)
    checkInDate: addDays(ambBase, 52),
    checkOutDate: addDays(ambBase, 57),
    selectedUnit: null,
    flexibleDates: true,
    mustIncludeWeekend: false,
    pointsAllocated: 6,
    rank: 2,
    submittedBy: 'ambassador',
  },
  {
    id: 'derek-req-3',
    destination: destinations[9], // San Diego (peak)
    checkInDate: addDays(ambBase, 65),
    checkOutDate: addDays(ambBase, 72),
    selectedUnit: null,
    flexibleDates: false,
    mustIncludeWeekend: false,
    pointsAllocated: 4,
    rank: 3,
    submittedBy: 'ambassador',
  },
  {
    id: 'derek-req-4',
    destination: destinations[8], // Charleston (shoulder)
    checkInDate: addDays(ambBase, 80),
    checkOutDate: addDays(ambBase, 85),
    selectedUnit: null,
    flexibleDates: false,
    mustIncludeWeekend: false,
    pointsAllocated: 2,
    rank: 4,
    submittedBy: 'ambassador',
  },
];

// Member 5: Elena Kovacs — Regular — not started
const elenaUser: User = {
  id: 'amb-member-5',
  name: 'Elena Kovacs',
  memberType: 'regular',
  vacationDays: 20,
  arTokens: 5,
  maxArTokens: 5,
  previousWins: [],
  isFirstTime: true,
};

// Member 6: James Whitfield — Ultra — not started
const jamesUser: User = {
  id: 'amb-member-6',
  name: 'James Whitfield',
  memberType: 'ultra',
  vacationDays: 20,
  arTokens: 6,
  maxArTokens: 10,
  previousWins: [{ destinationId: 'dest-1', date: subQuarters(ambBase, 2), quarterAgo: 2 }],
  isFirstTime: false,
};

// ─── Historical release data ──────────────────────────────────────────────────

const aliceHistory: HistoricalRelease[] = [
  {
    quarter: 'Q1 2025',
    releaseId: 'q1-2025',
    participated: true,
    submittedBy: 'member',
    wins: 1,
    totalPoints: 18,
    pointsBudget: 20,
    requests: [
      { destinationId: 'dest-2', destinationName: 'Aspen Mountain Lodge', region: 'Colorado', demandTier: 'super-peak', rank: 1, pointsAllocated: 10, status: 'won', submittedBy: 'member' },
      { destinationId: 'dest-1', destinationName: 'Maui Oceanfront Villa', region: 'Hawaii', demandTier: 'peak', rank: 2, pointsAllocated: 5, status: 'lost', submittedBy: 'member' },
      { destinationId: 'dest-5', destinationName: 'Lake Tahoe Cabin', region: 'California/Nevada', demandTier: 'shoulder', rank: 3, pointsAllocated: 3, status: 'lost', submittedBy: 'member' },
    ],
  },
  {
    quarter: 'Q4 2024',
    releaseId: 'q4-2024',
    participated: true,
    submittedBy: 'member',
    wins: 0,
    totalPoints: 15,
    pointsBudget: 20,
    requests: [
      { destinationId: 'dest-7', destinationName: 'Cape Cod Beach House', region: 'Massachusetts', demandTier: 'peak', rank: 1, pointsAllocated: 8, status: 'lost', submittedBy: 'member' },
      { destinationId: 'dest-4', destinationName: 'Miami South Beach Penthouse', region: 'Florida', demandTier: 'peak', rank: 2, pointsAllocated: 7, status: 'lost', submittedBy: 'member' },
    ],
  },
  {
    quarter: 'Q3 2024',
    releaseId: 'q3-2024',
    participated: true,
    submittedBy: 'ambassador',
    wins: 1,
    totalPoints: 20,
    pointsBudget: 20,
    requests: [
      { destinationId: 'dest-8', destinationName: 'Park City Ski Chalet', region: 'Utah', demandTier: 'super-peak', rank: 1, pointsAllocated: 12, status: 'lost', submittedBy: 'ambassador' },
      { destinationId: 'dest-9', destinationName: 'Charleston Historic Manor', region: 'South Carolina', demandTier: 'shoulder', rank: 2, pointsAllocated: 5, status: 'won', submittedBy: 'ambassador' },
      { destinationId: 'dest-6', destinationName: 'Scottsdale Desert Oasis', region: 'Arizona', demandTier: 'off-season', rank: 3, pointsAllocated: 3, status: 'lost', submittedBy: 'ambassador' },
    ],
  },
];

const marcusHistory: HistoricalRelease[] = [
  {
    quarter: 'Q1 2025',
    releaseId: 'q1-2025',
    participated: true,
    submittedBy: 'member',
    wins: 2,
    totalPoints: 24,
    pointsBudget: 24,
    requests: [
      { destinationId: 'dest-8', destinationName: 'Park City Ski Chalet', region: 'Utah', demandTier: 'super-peak', rank: 1, pointsAllocated: 9, status: 'won', submittedBy: 'member' },
      { destinationId: 'dest-2', destinationName: 'Aspen Mountain Lodge', region: 'Colorado', demandTier: 'super-peak', rank: 2, pointsAllocated: 7, status: 'lost', submittedBy: 'member' },
      { destinationId: 'dest-1', destinationName: 'Maui Oceanfront Villa', region: 'Hawaii', demandTier: 'peak', rank: 3, pointsAllocated: 5, status: 'won', submittedBy: 'member' },
      { destinationId: 'dest-10', destinationName: 'San Diego Coastal Retreat', region: 'California', demandTier: 'peak', rank: 4, pointsAllocated: 3, status: 'lost', submittedBy: 'member' },
    ],
  },
  {
    quarter: 'Q4 2024',
    releaseId: 'q4-2024',
    participated: true,
    submittedBy: 'member',
    wins: 1,
    totalPoints: 22,
    pointsBudget: 24,
    requests: [
      { destinationId: 'dest-2', destinationName: 'Aspen Mountain Lodge', region: 'Colorado', demandTier: 'super-peak', rank: 1, pointsAllocated: 12, status: 'won', submittedBy: 'member' },
      { destinationId: 'dest-4', destinationName: 'Miami South Beach Penthouse', region: 'Florida', demandTier: 'peak', rank: 2, pointsAllocated: 7, status: 'lost', submittedBy: 'member' },
      { destinationId: 'dest-3', destinationName: 'Napa Valley Estate', region: 'California', demandTier: 'shoulder', rank: 3, pointsAllocated: 3, status: 'lost', submittedBy: 'member' },
    ],
  },
  {
    quarter: 'Q3 2024',
    releaseId: 'q3-2024',
    participated: true,
    submittedBy: 'member',
    wins: 1,
    totalPoints: 18,
    pointsBudget: 24,
    requests: [
      { destinationId: 'dest-8', destinationName: 'Park City Ski Chalet', region: 'Utah', demandTier: 'super-peak', rank: 1, pointsAllocated: 10, status: 'won', submittedBy: 'member' },
      { destinationId: 'dest-7', destinationName: 'Cape Cod Beach House', region: 'Massachusetts', demandTier: 'peak', rank: 2, pointsAllocated: 8, status: 'lost', submittedBy: 'member' },
    ],
  },
];

const carolineHistory: HistoricalRelease[] = [
  {
    quarter: 'Q1 2025',
    releaseId: 'q1-2025',
    participated: true,
    submittedBy: 'mixed',
    wins: 0,
    totalPoints: 16,
    pointsBudget: 20,
    requests: [
      { destinationId: 'dest-7', destinationName: 'Cape Cod Beach House', region: 'Massachusetts', demandTier: 'peak', rank: 1, pointsAllocated: 9, status: 'lost', submittedBy: 'member' },
      { destinationId: 'dest-5', destinationName: 'Lake Tahoe Cabin', region: 'California/Nevada', demandTier: 'shoulder', rank: 2, pointsAllocated: 7, status: 'lost', submittedBy: 'ambassador' },
    ],
  },
  {
    quarter: 'Q4 2024',
    releaseId: 'q4-2024',
    participated: false,
    wins: 0,
    totalPoints: 0,
    pointsBudget: 20,
    requests: [],
  },
  {
    quarter: 'Q3 2024',
    releaseId: 'q3-2024',
    participated: true,
    submittedBy: 'ambassador',
    wins: 1,
    totalPoints: 20,
    pointsBudget: 20,
    requests: [
      { destinationId: 'dest-3', destinationName: 'Napa Valley Estate', region: 'California', demandTier: 'shoulder', rank: 1, pointsAllocated: 10, status: 'won', submittedBy: 'ambassador' },
      { destinationId: 'dest-9', destinationName: 'Charleston Historic Manor', region: 'South Carolina', demandTier: 'shoulder', rank: 2, pointsAllocated: 6, status: 'lost', submittedBy: 'ambassador' },
      { destinationId: 'dest-6', destinationName: 'Scottsdale Desert Oasis', region: 'Arizona', demandTier: 'off-season', rank: 3, pointsAllocated: 4, status: 'lost', submittedBy: 'ambassador' },
    ],
  },
];

const derekHistory: HistoricalRelease[] = [
  {
    quarter: 'Q1 2025',
    releaseId: 'q1-2025',
    participated: true,
    submittedBy: 'ambassador',
    wins: 1,
    totalPoints: 19,
    pointsBudget: 20,
    requests: [
      { destinationId: 'dest-1', destinationName: 'Maui Oceanfront Villa', region: 'Hawaii', demandTier: 'peak', rank: 1, pointsAllocated: 10, status: 'won', submittedBy: 'ambassador' },
      { destinationId: 'dest-10', destinationName: 'San Diego Coastal Retreat', region: 'California', demandTier: 'peak', rank: 2, pointsAllocated: 6, status: 'lost', submittedBy: 'ambassador' },
      { destinationId: 'dest-6', destinationName: 'Scottsdale Desert Oasis', region: 'Arizona', demandTier: 'off-season', rank: 3, pointsAllocated: 3, status: 'lost', submittedBy: 'ambassador' },
    ],
  },
  {
    quarter: 'Q4 2024',
    releaseId: 'q4-2024',
    participated: true,
    submittedBy: 'ambassador',
    wins: 0,
    totalPoints: 20,
    pointsBudget: 20,
    requests: [
      { destinationId: 'dest-2', destinationName: 'Aspen Mountain Lodge', region: 'Colorado', demandTier: 'super-peak', rank: 1, pointsAllocated: 12, status: 'lost', submittedBy: 'ambassador' },
      { destinationId: 'dest-5', destinationName: 'Lake Tahoe Cabin', region: 'California/Nevada', demandTier: 'shoulder', rank: 2, pointsAllocated: 8, status: 'lost', submittedBy: 'ambassador' },
    ],
  },
  {
    quarter: 'Q3 2024',
    releaseId: 'q3-2024',
    participated: false,
    wins: 0,
    totalPoints: 0,
    pointsBudget: 20,
    requests: [],
  },
];

const elenaHistory: HistoricalRelease[] = [
  {
    quarter: 'Q1 2025',
    releaseId: 'q1-2025',
    participated: false,
    wins: 0,
    totalPoints: 0,
    pointsBudget: 20,
    requests: [],
  },
  {
    quarter: 'Q4 2024',
    releaseId: 'q4-2024',
    participated: false,
    wins: 0,
    totalPoints: 0,
    pointsBudget: 20,
    requests: [],
  },
  {
    quarter: 'Q3 2024',
    releaseId: 'q3-2024',
    participated: false,
    wins: 0,
    totalPoints: 0,
    pointsBudget: 20,
    requests: [],
  },
];

const jamesHistory: HistoricalRelease[] = [
  {
    quarter: 'Q1 2025',
    releaseId: 'q1-2025',
    participated: false,
    wins: 0,
    totalPoints: 0,
    pointsBudget: 24,
    requests: [],
  },
  {
    quarter: 'Q4 2024',
    releaseId: 'q4-2024',
    participated: true,
    submittedBy: 'member',
    wins: 1,
    totalPoints: 20,
    pointsBudget: 24,
    requests: [
      { destinationId: 'dest-1', destinationName: 'Maui Oceanfront Villa', region: 'Hawaii', demandTier: 'peak', rank: 1, pointsAllocated: 12, status: 'won', submittedBy: 'member' },
      { destinationId: 'dest-9', destinationName: 'Charleston Historic Manor', region: 'South Carolina', demandTier: 'shoulder', rank: 2, pointsAllocated: 8, status: 'lost', submittedBy: 'member' },
    ],
  },
  {
    quarter: 'Q3 2024',
    releaseId: 'q3-2024',
    participated: false,
    wins: 0,
    totalPoints: 0,
    pointsBudget: 24,
    requests: [],
  },
];

export const ambassadorProfile: AmbassadorProfile = {
  id: 'ambassador-1',
  name: 'Jessica Martinez',
  members: [
    {
      user: aliceUser,
      requests: aliceRequests,
      results: aliceResults,
      rasStatus: 'results-available',
      pointsBudget: 20,
      lastActivity: addDays(ambBase, -1),
      history: aliceHistory,
    },
    {
      user: marcusUser,
      requests: marcusRequests,
      results: [],
      rasStatus: 'submitted',
      pointsBudget: 24,
      lastActivity: addDays(ambBase, -2),
      history: marcusHistory,
    },
    {
      user: carolineUser,
      requests: carolineRequests,
      results: [],
      rasStatus: 'in-progress',
      pointsBudget: 20,
      lastActivity: addDays(ambBase, -3),
      history: carolineHistory,
    },
    {
      user: derekUser,
      requests: derekRequests,
      results: [],
      rasStatus: 'submitted',
      pointsBudget: 20,
      lastActivity: addDays(ambBase, -4),
      history: derekHistory,
    },
    {
      user: elenaUser,
      requests: [],
      results: [],
      rasStatus: 'not-started',
      pointsBudget: 20,
      history: elenaHistory,
    },
    {
      user: jamesUser,
      requests: [],
      results: [],
      rasStatus: 'not-started',
      pointsBudget: 24,
      history: jamesHistory,
    },
  ],
};

// RAS run date (next quarter)
export const getNextRASRunDate = (): Date => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const quarterEndMonth = Math.floor(currentMonth / 3) * 3 + 2;
  const rasDate = new Date(now.getFullYear(), quarterEndMonth, 15, 12, 0, 0);

  if (rasDate <= now) {
    rasDate.setMonth(rasDate.getMonth() + 3);
  }

  return rasDate;
};
