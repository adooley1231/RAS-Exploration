export interface Unit {
  id: string;
  name: string;
  bedrooms: number;
  sleeps: number;
  bathrooms?: number;
  squareFeet?: number;
  features?: string[];
  description?: string;
  imageUrl?: string;
  images?: string[];
}

export type DemandTier = 'super-peak' | 'peak' | 'shoulder' | 'off-season';

export interface Destination {
  id: string;
  name: string;
  imageUrl: string;
  region: string;
  description?: string;
  units: Unit[];
  demandTier?: DemandTier;
  /** For merchandising: highlight in browse. */
  featured?: boolean;
  /** For merchandising: currently available for release. */
  available?: boolean;
  /** Suggested check-in day (0=Sunday, 1=Monday, etc.) for popular locations. */
  suggestedStartDay?: number;
}

export interface PreviousWin {
  destinationId: string;
  unitId?: string;
  date: Date;
  quarterAgo: number;
}

export interface User {
  id: string;
  name: string;
  memberType: 'regular' | 'ultra';
  vacationDays: number; // 1 point per day, base; Ultra gets 1.2x
  arTokens: number;
  maxArTokens: number;
  previousWins: PreviousWin[];
  wishListDestination?: string;
  wishListYears?: number;
  isFirstTime?: boolean;
}

export interface VacationRequest {
  id: string;
  destination: Destination;
  checkInDate: Date;
  checkOutDate: Date;
  /** Single primary unit for backward compat; when preferredUnits is set, prefer that for "any of these" */
  selectedUnit: Unit | null;
  /** When set, member is flexible: any of these units is acceptable. Empty = any unit. */
  preferredUnits?: Unit[];
  flexibleDates: boolean; // ±2 days
  mustIncludeWeekend: boolean;
  pointsAllocated: number; // 0 to remaining points
  rank?: number; // display order
  limitToOneWin?: boolean;
  notes?: string;
  /** Minimum nights for this request. */
  minNights?: number;
  /** True when dates were auto-filled as a placeholder (7 days out, 5 nights). Member should set real dates. */
  isPlaceholderDates?: boolean;
}

export interface RASResult {
  id: string;
  requestId: string;
  destination: Destination;
  unit?: Unit;
  status: 'won' | 'lost';
  matchedDates?: { checkIn: Date; checkOut: Date };
  originalCheckIn: Date;
  originalCheckOut: Date;
  originalRank: number;
  pointsInvested?: number;
  percentOfBudget?: number;
  acceptStatus?: 'pending' | 'accepted' | 'declined';
  acceptedAt?: Date;
  declinedAt?: Date;
  declineDeadline: Date;
  arTokensUsed: number;
}

export interface TRVRInfo {
  hasBoost: boolean;
  hasPenalty: boolean;
  boostPercentage?: number;
  penaltyPercentage?: number;
  reason?: string;
  quartersAgo?: number;
}

export type AppView = 'browse-or-search' | 'request-builder' | 'allocate-points' | 'review' | 'results';
export type DemoScenario = 'regular' | 'ultra' | 'first-time' | 'results-mix' | 'no-wins';

export interface RASState {
  currentView: AppView;
  user: User;
  requests: VacationRequest[];
  results: RASResult[];
  rasRunDate: Date;
  demoScenario: DemoScenario;
  isSubmitted: boolean;
  tokensToUse: number; // How many AR tokens (max wins) the user wants to use this quarter
  /** Pre-selected destination when arriving from Browse step. */
  browseSelectedDestination: Destination | null;
  /** Pre-selected date range when arriving from Search by dates. */
  browseSelectedDateRange: { from: Date; to: Date } | null;
}

export type RASAction =
  | { type: 'SET_VIEW'; payload: AppView }
  | { type: 'SET_BROWSE_DESTINATION'; payload: Destination | null }
  | { type: 'SET_BROWSE_DATE_RANGE'; payload: { from: Date; to: Date } | null }
  | { type: 'SET_USER'; payload: User }
  | { type: 'ADD_REQUEST'; payload: VacationRequest }
  | { type: 'UPDATE_REQUEST'; payload: VacationRequest }
  | { type: 'REMOVE_REQUEST'; payload: string }
  | { type: 'REORDER_REQUESTS'; payload: VacationRequest[] }
  | { type: 'SET_RESULTS'; payload: RASResult[] }
  | { type: 'ACCEPT_RESULT'; payload: string }
  | { type: 'DECLINE_RESULT'; payload: string }
  | { type: 'SET_DEMO_SCENARIO'; payload: DemoScenario }
  | { type: 'SET_TOKENS_TO_USE'; payload: number }
  | { type: 'SUBMIT_REQUESTS' }
  | { type: 'RESET' };
