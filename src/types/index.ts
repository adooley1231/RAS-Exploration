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
  /** Indicates whether this request was submitted by the member directly or by their ambassador. */
  submittedBy?: 'member' | 'ambassador';
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
  cancelWaitlistOptIn?: boolean;
}

export interface TRVRInfo {
  hasBoost: boolean;
  hasPenalty: boolean;
  boostPercentage?: number;
  penaltyPercentage?: number;
  reason?: string;
  quartersAgo?: number;
}

export type AppView = 'browse-or-search' | 'request-builder' | 'allocate-points' | 'review' | 'results' | 'ambassador-dashboard';
export type DemoScenario = 'regular' | 'ultra' | 'first-time' | 'results-mix' | 'no-wins';
export type AppMode = 'member' | 'ambassador' | 'lottery-logic';

export type AnnotationCalloutId =
  | 'member-continue-allocate'
  | 'member-continue-review'
  | 'member-confirm-submit'
  | 'member-results-accept'
  | 'member-results-decline'
  | 'member-waitlist-submit'
  | 'ambassador-submit-on-behalf'
  | 'ambassador-accept-on-behalf'
  | 'ambassador-release-history';

/** A single request entry within a historical release record. */
export interface HistoricalReleaseRequest {
  destinationId: string;
  destinationName: string;
  region: string;
  demandTier?: DemandTier;
  rank: number;
  pointsAllocated: number;
  status: 'won' | 'lost';
  submittedBy: 'member' | 'ambassador';
}

/** Full record of a member's participation in one past RAS release quarter. */
export interface HistoricalRelease {
  quarter: string;       // e.g. "Q1 2025"
  releaseId: string;
  participated: boolean;
  requests: HistoricalReleaseRequest[];
  wins: number;
  totalPoints: number;
  pointsBudget: number;
  submittedBy?: 'member' | 'ambassador' | 'mixed';
}

/** Per-member record used inside an AmbassadorProfile. */
export interface ManagedMember {
  user: User;
  requests: VacationRequest[];
  results: RASResult[];
  /** High-level submission state for this release. */
  rasStatus: 'not-started' | 'in-progress' | 'submitted' | 'results-available';
  /** Total points budget for this member this quarter. */
  pointsBudget: number;
  lastActivity?: Date;
  /** Past release participation history, most recent first. */
  history?: HistoricalRelease[];
  /** Set when this quarter’s list was finalized via ambassador submit-on-behalf (prototype). */
  lastSubmission?: {
    at: Date;
    by: 'ambassador';
  };
}

/** Ambassador's full profile including their member portfolio. */
export interface AmbassadorProfile {
  id: string;
  name: string;
  members: ManagedMember[];
}

export interface RASState {
  currentView: AppView;
  appMode: AppMode;
  /** ID of the ManagedMember currently being viewed/edited in ambassador mode. */
  activeMemberId: string | null;
  /** Which backend annotation modal is currently open (if any). */
  annotationCalloutId: AnnotationCalloutId | null;
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
  | { type: 'SET_APP_MODE'; payload: AppMode }
  | { type: 'SET_ACTIVE_MEMBER'; payload: string | null }
  | { type: 'SET_ANNOTATION_CALLOUT'; payload: AnnotationCalloutId | null }
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
