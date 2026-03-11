import { format, differenceInDays, differenceInHours, addDays, isWeekend, isSaturday, isSunday } from 'date-fns';
import type { TRVRInfo, User, Destination, VacationRequest } from '../types';

export const formatDate = (date: Date): string => {
  return format(date, 'MMM d, yyyy');
};

export const formatDateShort = (date: Date): string => {
  return format(date, 'MMM d');
};

export const formatDateRange = (checkIn: Date, checkOut: Date): string => {
  return `${formatDateShort(checkIn)} - ${formatDateShort(checkOut)}`;
};

export const formatDateRangeFromNights = (checkIn: Date, nights: number): string => {
  const checkOut = addDays(checkIn, nights);
  return `${formatDateShort(checkIn)} - ${formatDateShort(checkOut)}`;
};

export const getNights = (checkIn: Date, checkOut: Date): number => {
  return differenceInDays(checkOut, checkIn);
};

export const getCheckOutDate = (checkIn: Date, nights: number): Date => {
  return addDays(checkIn, nights);
};

export const includesWeekend = (checkIn: Date, checkOut: Date): boolean => {
  const nights = differenceInDays(checkOut, checkIn);
  for (let i = 0; i < nights; i++) {
    if (isWeekend(addDays(checkIn, i))) {
      return true;
    }
  }
  return false;
};

export const countWeekendNights = (checkIn: Date, checkOut: Date): number => {
  const nights = differenceInDays(checkOut, checkIn);
  let count = 0;
  for (let i = 0; i < nights; i++) {
    const day = addDays(checkIn, i);
    if (isSaturday(day) || isSunday(day)) {
      count++;
    }
  }
  return count;
};

// TRVR (Time since Recent Vacation at Resort) calculation
export const calculateTRVR = (user: User, destinationId: string): TRVRInfo => {
  const previousWinAtDestination = user.previousWins.find(
    (win) => win.destinationId === destinationId
  );

  if (!previousWinAtDestination) {
    // Never won this destination - might have boost if first-time or long-time member
    if (user.isFirstTime) {
      return {
        hasBoost: true,
        hasPenalty: false,
        boostPercentage: 15,
        reason: 'First-time member bonus',
      };
    }
    return {
      hasBoost: true,
      hasPenalty: false,
      boostPercentage: 10,
      reason: 'Never won this destination',
    };
  }

  const quartersAgo = previousWinAtDestination.quarterAgo;

  if (quartersAgo <= 2) {
    // Recent win - penalty
    const penaltyPercent = quartersAgo === 1 ? 50 : 25;
    return {
      hasBoost: false,
      hasPenalty: true,
      penaltyPercentage: penaltyPercent,
      reason: `Won ${quartersAgo} quarter${quartersAgo > 1 ? 's' : ''} ago`,
      quartersAgo,
    };
  }

  if (quartersAgo >= 6) {
    // Long time ago - small boost
    return {
      hasBoost: true,
      hasPenalty: false,
      boostPercentage: 5,
      reason: `Last win was ${quartersAgo} quarters ago`,
      quartersAgo,
    };
  }

  // Middle ground - no boost or penalty
  return {
    hasBoost: false,
    hasPenalty: false,
    quartersAgo,
  };
};

// Check if destination is on user's wish list
export const isWishListDestination = (user: User, destinationId: string): boolean => {
  return user.wishListDestination === destinationId;
};

// Get wish list boost info
export const getWishListBoost = (user: User, destinationId: string): number | null => {
  if (!isWishListDestination(user, destinationId)) return null;
  if (!user.wishListYears) return 5; // Base boost for wish list
  // Additional boost for longer wish list duration
  return Math.min(5 + user.wishListYears * 2, 20);
};

// Calculate max possible wins based on AR tokens
export const calculateMaxWins = (user: User, requests: VacationRequest[]): number => {
  if (user.memberType === 'ultra') {
    return requests.length; // Ultra members have no limit
  }
  return Math.min(user.arTokens, requests.length);
};

// Format countdown time
export const formatCountdown = (deadline: Date): { text: string; isUrgent: boolean } => {
  const now = new Date();
  const hoursLeft = differenceInHours(deadline, now);
  const daysLeft = differenceInDays(deadline, now);

  if (hoursLeft <= 0) {
    return { text: 'Expired', isUrgent: true };
  }

  if (hoursLeft < 12) {
    return { text: `${hoursLeft}h left`, isUrgent: true };
  }

  if (hoursLeft < 24) {
    return { text: `${hoursLeft} hours left`, isUrgent: true };
  }

  return { text: `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`, isUrgent: false };
};

// Generate unique ID
export const generateId = (): string => {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get destinations grouped by region
export const groupDestinationsByRegion = (
  destinations: Destination[]
): Record<string, Destination[]> => {
  return destinations.reduce((acc, dest) => {
    if (!acc[dest.region]) {
      acc[dest.region] = [];
    }
    acc[dest.region].push(dest);
    return acc;
  }, {} as Record<string, Destination[]>);
};

// Calculate AR tokens needed for requests
export const calculateARTokensNeeded = (requests: VacationRequest[]): number => {
  // Each request costs 1 AR token to potentially win
  return requests.length;
};

// Check for duplicate destinations
export const hasDuplicateDestinations = (requests: VacationRequest[]): boolean => {
  const destinationIds = requests.map((r) => r.destination.id);
  return new Set(destinationIds).size !== destinationIds.length;
};

// Get duplicate destination IDs
export const getDuplicateDestinationIds = (requests: VacationRequest[]): Set<string> => {
  const counts = requests.reduce((acc, req) => {
    acc[req.destination.id] = (acc[req.destination.id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return new Set(Object.keys(counts).filter((id) => counts[id] > 1));
};

// Format unit info for display (single unit)
export const formatUnitInfo = (unit: { bedrooms: number; sleeps: number } | null): string => {
  if (!unit) return 'Any Unit';
  return `${unit.bedrooms} BR · Sleeps ${unit.sleeps}`;
};

// Format unit preference for a request (single unit, multiple preferred, or any)
export const formatUnitPreference = (request: {
  selectedUnit: { bedrooms: number; sleeps: number } | null;
  preferredUnits?: { bedrooms: number; sleeps: number }[];
}): string => {
  const preferred = request.preferredUnits ?? (request.selectedUnit ? [request.selectedUnit] : []);
  if (preferred.length === 0) return 'Any Unit';
  if (preferred.length === 1) return formatUnitInfo(preferred[0]);
  return `Any of ${preferred.length} units`;
};

// Points-based RAS: member total points (1 per vacation day, Ultra 1.2x)
export const getMemberPoints = (user: User): number => {
  const base = user.vacationDays ?? 20;
  const multiplier = user.memberType === 'ultra' ? 1.2 : 1;
  return Math.round(base * multiplier);
};

// Sum of points allocated across requests
export const getPointsAllocated = (requests: VacationRequest[]): number => {
  return requests.reduce((sum, r) => sum + (r.pointsAllocated ?? 0), 0);
};

// Points remaining to allocate
export const getPointsRemaining = (user: User, requests: VacationRequest[]): number => {
  return Math.max(0, getMemberPoints(user) - getPointsAllocated(requests));
};

export type EfficiencyLevel = 'good' | 'moderate' | 'low';

// Efficiency: good odds (green), moderate (yellow), low (red) for points invested vs demand tier
export const getEfficiencyLevel = (
  destination: Destination,
  pointsAllocated: number,
  _user: User
): EfficiencyLevel => {
  const tier = destination.demandTier ?? 'shoulder';
  const effectivePoints = pointsAllocated;

  if (tier === 'super-peak') {
    if (effectivePoints >= 5) return 'good';
    if (effectivePoints >= 3) return 'moderate';
    return 'low';
  }
  if (tier === 'peak') {
    if (effectivePoints >= 4) return 'good';
    if (effectivePoints >= 2) return 'moderate';
    return 'low';
  }
  if (tier === 'shoulder') {
    if (effectivePoints >= 3) return 'good';
    if (effectivePoints >= 1) return 'moderate';
    return 'low';
  }
  // off-season
  if (effectivePoints >= 2) return 'good';
  if (effectivePoints >= 1) return 'moderate';
  return 'low';
};

// --- Weighting model ---
// Demand multipliers from prompt
const getDemandMultiplier = (destination: Destination): number => {
  const tier = destination.demandTier ?? 'shoulder';
  switch (tier) {
    case 'super-peak':
      return 4.0;
    case 'peak':
      return 2.5;
    case 'shoulder':
      return 1.5;
    case 'off-season':
    default:
      return 1.0;
  }
};

// Ultra vs regular
const getUltraMultiplier = (user: User): number => {
  return user.memberType === 'ultra' ? 1.2 : 1.0;
};

// Flexibility: 1.5x if flexible dates
const getFlexibilityMultiplier = (request: VacationRequest): number => {
  return request.flexibleDates ? 1.5 : 1.0;
};

// TRVR modifier: 0.5x if recent win penalty, 1.5x if never-won/high boost, else 1.0
const getTRVRMultiplier = (trvr: TRVRInfo): number => {
  if (trvr.hasPenalty) {
    return 0.5;
  }
  if (trvr.hasBoost) {
    return 1.5;
  }
  return 1.0;
};

// Final Weight = Points × Demand × Ultra × Flexibility × TRVR
export const computeRequestWeight = (user: User, request: VacationRequest): number => {
  const points = request.pointsAllocated ?? 0;
  if (points <= 0) return 0;

  const demand = getDemandMultiplier(request.destination);
  const ultra = getUltraMultiplier(user);
  const flex = getFlexibilityMultiplier(request);
  const trvr = getTRVRMultiplier(calculateTRVR(user, request.destination.id));

  const weight = points * demand * ultra * flex * trvr;
  // Round to one decimal place for display
  return Math.round(weight * 10) / 10;
};

