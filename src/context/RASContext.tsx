import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { RASState, RASAction, DemoScenario, VacationRequest, Destination } from '../types';
import { sampleUsers, generateMockResults, getNextRASRunDate } from '../data/mockData';

const initialState: RASState = {
  currentView: 'browse-or-search',
  user: sampleUsers.regular,
  requests: [],
  results: [],
  rasRunDate: getNextRASRunDate(),
  demoScenario: 'regular',
  isSubmitted: false,
  tokensToUse: sampleUsers.regular.arTokens, // Default to all available tokens
  browseSelectedDestination: null,
  browseSelectedDateRange: null,
};

function rasReducer(state: RASState, action: RASAction): RASState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };

    case 'SET_BROWSE_DESTINATION':
      return { ...state, browseSelectedDestination: action.payload };

    case 'SET_BROWSE_DATE_RANGE':
      return { ...state, browseSelectedDateRange: action.payload };

    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'ADD_REQUEST': {
      const newRequest = {
        ...action.payload,
        rank: state.requests.length + 1,
      };
      return { ...state, requests: [...state.requests, newRequest] };
    }

    case 'UPDATE_REQUEST': {
      const updatedRequests = state.requests.map((req) =>
        req.id === action.payload.id ? action.payload : req
      );
      return { ...state, requests: updatedRequests };
    }

    case 'REMOVE_REQUEST': {
      const filteredRequests = state.requests.filter((req) => req.id !== action.payload);
      // Re-rank remaining requests
      const rerankedRequests = filteredRequests.map((req, idx) => ({
        ...req,
        rank: idx + 1,
      }));
      return { ...state, requests: rerankedRequests };
    }

    case 'REORDER_REQUESTS': {
      // Update ranks based on new order
      const rerankedRequests = action.payload.map((req, idx) => ({
        ...req,
        rank: idx + 1,
      }));
      return { ...state, requests: rerankedRequests };
    }

    case 'SET_RESULTS':
      return { ...state, results: action.payload };

    case 'ACCEPT_RESULT': {
      const updatedResults = state.results.map((result) =>
        result.id === action.payload
          ? { ...result, acceptStatus: 'accepted' as const, acceptedAt: new Date() }
          : result
      );
      // Deduct AR token for accepted result
      const acceptedResult = state.results.find((r) => r.id === action.payload);
      const newArTokens = acceptedResult
        ? Math.max(0, state.user.arTokens - acceptedResult.arTokensUsed)
        : state.user.arTokens;
      return {
        ...state,
        results: updatedResults,
        user: { ...state.user, arTokens: newArTokens },
      };
    }

    case 'DECLINE_RESULT': {
      const updatedResults = state.results.map((result) =>
        result.id === action.payload
          ? { ...result, acceptStatus: 'declined' as const, declinedAt: new Date() }
          : result
      );
      return { ...state, results: updatedResults };
    }

    case 'SET_DEMO_SCENARIO': {
      const newUser = sampleUsers[action.payload];
      const newResults =
        action.payload === 'results-mix' || action.payload === 'no-wins'
          ? generateMockResults(action.payload)
          : [];
      const newView =
        action.payload === 'results-mix' || action.payload === 'no-wins'
          ? 'results'
          : 'browse-or-search';

      return {
        ...state,
        demoScenario: action.payload,
        user: newUser,
        results: newResults,
        currentView: newView,
        requests: [],
        browseSelectedDestination: null,
        browseSelectedDateRange: null,
        isSubmitted: action.payload === 'results-mix' || action.payload === 'no-wins',
        tokensToUse: newUser.arTokens, // Reset to all available tokens for new user
      };
    }

    case 'SET_TOKENS_TO_USE':
      return { ...state, tokensToUse: action.payload };

    case 'SUBMIT_REQUESTS':
      return { ...state, isSubmitted: true };

    case 'RESET':
      return {
        ...initialState,
        user: sampleUsers[state.demoScenario],
        demoScenario: state.demoScenario,
      };

    default:
      return state;
  }
}

interface RASContextType {
  state: RASState;
  dispatch: React.Dispatch<RASAction>;
  // Convenience actions
  setView: (view: RASState['currentView']) => void;
  setBrowseDestination: (destination: Destination | null) => void;
  setBrowseDateRange: (range: { from: Date; to: Date } | null) => void;
  addRequest: (request: VacationRequest) => void;
  updateRequest: (request: VacationRequest) => void;
  removeRequest: (id: string) => void;
  reorderRequests: (requests: VacationRequest[]) => void;
  acceptResult: (id: string) => void;
  declineResult: (id: string) => void;
  setDemoScenario: (scenario: DemoScenario) => void;
  setTokensToUse: (tokens: number) => void;
  submitRequests: () => void;
  reset: () => void;
}

const RASContext = createContext<RASContextType | undefined>(undefined);

export function RASProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(rasReducer, initialState);

  const value: RASContextType = {
    state,
    dispatch,
    setView: (view) => dispatch({ type: 'SET_VIEW', payload: view }),
    setBrowseDestination: (destination) =>
      dispatch({ type: 'SET_BROWSE_DESTINATION', payload: destination }),
    setBrowseDateRange: (range) =>
      dispatch({ type: 'SET_BROWSE_DATE_RANGE', payload: range }),
    addRequest: (request) => dispatch({ type: 'ADD_REQUEST', payload: request }),
    updateRequest: (request) => dispatch({ type: 'UPDATE_REQUEST', payload: request }),
    removeRequest: (id) => dispatch({ type: 'REMOVE_REQUEST', payload: id }),
    reorderRequests: (requests) => dispatch({ type: 'REORDER_REQUESTS', payload: requests }),
    acceptResult: (id) => dispatch({ type: 'ACCEPT_RESULT', payload: id }),
    declineResult: (id) => dispatch({ type: 'DECLINE_RESULT', payload: id }),
    setDemoScenario: (scenario) => dispatch({ type: 'SET_DEMO_SCENARIO', payload: scenario }),
    setTokensToUse: (tokens) => dispatch({ type: 'SET_TOKENS_TO_USE', payload: tokens }),
    submitRequests: () => dispatch({ type: 'SUBMIT_REQUESTS' }),
    reset: () => dispatch({ type: 'RESET' }),
  };

  return <RASContext.Provider value={value}>{children}</RASContext.Provider>;
}

export function useRAS() {
  const context = useContext(RASContext);
  if (context === undefined) {
    throw new Error('useRAS must be used within a RASProvider');
  }
  return context;
}
