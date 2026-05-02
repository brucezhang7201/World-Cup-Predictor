import { type ReactNode, createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AppState } from '../types';
import { createInitialGroups } from '../data/teams';
import { createInitialMatches, BRACKET_FEED } from '../data/bracket';
import { assignThirdPlaceTeams } from '../utils/thirdPlaceAssignment';
import { getSharedStateFromUrl } from '../utils/urlEncoding';

function buildInitialState(): AppState {
  return {
    step: 'intro',
    bracketName: '',
    groups: createInitialGroups(),
    selectedThirdPlace: [],
    thirdPlaceAssignment: {},
    matches: createInitialMatches(),
  };
}

interface AppContextValue {
  state: AppState;
  isViewOnly: boolean;
  setBracketName: (name: string) => void;
  startBracket: (name: string) => void;
  updateGroupRankings: (groupId: string, rankings: string[]) => void;
  markGroupComplete: (groupId: string) => void;
  goToThirdPlace: () => void;
  toggleThirdPlace: (groupId: string) => void;
  confirmThirdPlace: () => void;
  goBackToGroups: () => void;
  pickMatchWinner: (matchId: string, winnerId: string) => void;
  setMatchScore: (matchId: string, score1: number | null, score2: number | null, penaltyWinnerId?: string | null) => void;
  goToShare: () => void;
  resetApp: () => void;
  recomputeBracket: () => void;
  loadBracket: (newState: AppState) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const sharedState = getSharedStateFromUrl();
  const isViewOnly = sharedState !== null;

  const [state, setState] = useState<AppState>(() => sharedState ?? buildInitialState());

  // If URL changes, check again
  useEffect(() => {
    const handleHashChange = () => {
      const s = getSharedStateFromUrl();
      if (s) {
        setState(s);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setBracketName = useCallback((name: string) => {
    setState(prev => ({ ...prev, bracketName: name }));
  }, []);

  const startBracket = useCallback((name: string) => {
    setState(prev => ({ ...prev, bracketName: name, step: 'groups' }));
  }, []);

  const updateGroupRankings = useCallback((groupId: string, rankings: string[]) => {
    setState(prev => ({
      ...prev,
      groups: {
        ...prev.groups,
        [groupId]: {
          ...prev.groups[groupId],
          rankings,
          completed: true,
        },
      },
    }));
  }, []);

  const markGroupComplete = useCallback((groupId: string) => {
    setState(prev => ({
      ...prev,
      groups: {
        ...prev.groups,
        [groupId]: { ...prev.groups[groupId], completed: true },
      },
    }));
  }, []);

  const goToThirdPlace = useCallback(() => {
    setState(prev => ({ ...prev, step: 'third-place' }));
  }, []);

  const toggleThirdPlace = useCallback((groupId: string) => {
    setState(prev => {
      const current = prev.selectedThirdPlace;
      if (current.includes(groupId)) {
        return { ...prev, selectedThirdPlace: current.filter(g => g !== groupId) };
      } else if (current.length < 8) {
        return { ...prev, selectedThirdPlace: [...current, groupId] };
      }
      return prev;
    });
  }, []);

  const confirmThirdPlace = useCallback(() => {
    setState(prev => {
      if (prev.selectedThirdPlace.length !== 8) return prev;

      const assignment = assignThirdPlaceTeams(prev.selectedThirdPlace);
      if (!assignment) return prev;

      // Build R32 slots from group rankings + third place assignment
      const newMatches = { ...prev.matches };

      // Helper to get team id by group and rank (0-indexed)
      const getTeamByRank = (groupId: string, rank: number): string | null => {
        const group = prev.groups[groupId];
        if (!group || group.rankings.length <= rank) return null;
        return group.rankings[rank];
      };

      // M1: Winner Group E vs 3rd from assigned group
      newMatches['M1'] = { ...newMatches['M1'],
        slot1: { teamId: getTeamByRank('E', 0), source: 'Winner Group E' },
        slot2: { teamId: assignment['M1'] ? getTeamByRank(assignment['M1'], 2) : null, source: `3rd Group ${assignment['M1'] ?? ''}` },
        winnerId: null,
      };
      // M2: Winner Group I vs 3rd
      newMatches['M2'] = { ...newMatches['M2'],
        slot1: { teamId: getTeamByRank('I', 0), source: 'Winner Group I' },
        slot2: { teamId: assignment['M2'] ? getTeamByRank(assignment['M2'], 2) : null, source: `3rd Group ${assignment['M2'] ?? ''}` },
        winnerId: null,
      };
      // M3: Runner-up A vs Runner-up B
      newMatches['M3'] = { ...newMatches['M3'],
        slot1: { teamId: getTeamByRank('A', 1), source: 'Runner-up Group A' },
        slot2: { teamId: getTeamByRank('B', 1), source: 'Runner-up Group B' },
        winnerId: null,
      };
      // M4: Winner Group F vs Runner-up C
      newMatches['M4'] = { ...newMatches['M4'],
        slot1: { teamId: getTeamByRank('F', 0), source: 'Winner Group F' },
        slot2: { teamId: getTeamByRank('C', 1), source: 'Runner-up Group C' },
        winnerId: null,
      };
      // M5: Runner-up K vs Runner-up L
      newMatches['M5'] = { ...newMatches['M5'],
        slot1: { teamId: getTeamByRank('K', 1), source: 'Runner-up Group K' },
        slot2: { teamId: getTeamByRank('L', 1), source: 'Runner-up Group L' },
        winnerId: null,
      };
      // M6: Winner Group H vs Runner-up J
      newMatches['M6'] = { ...newMatches['M6'],
        slot1: { teamId: getTeamByRank('H', 0), source: 'Winner Group H' },
        slot2: { teamId: getTeamByRank('J', 1), source: 'Runner-up Group J' },
        winnerId: null,
      };
      // M7: Winner Group D vs 3rd
      newMatches['M7'] = { ...newMatches['M7'],
        slot1: { teamId: getTeamByRank('D', 0), source: 'Winner Group D' },
        slot2: { teamId: assignment['M7'] ? getTeamByRank(assignment['M7'], 2) : null, source: `3rd Group ${assignment['M7'] ?? ''}` },
        winnerId: null,
      };
      // M8: Winner Group G vs 3rd
      newMatches['M8'] = { ...newMatches['M8'],
        slot1: { teamId: getTeamByRank('G', 0), source: 'Winner Group G' },
        slot2: { teamId: assignment['M8'] ? getTeamByRank(assignment['M8'], 2) : null, source: `3rd Group ${assignment['M8'] ?? ''}` },
        winnerId: null,
      };
      // M9: Winner Group C vs Runner-up F
      newMatches['M9'] = { ...newMatches['M9'],
        slot1: { teamId: getTeamByRank('C', 0), source: 'Winner Group C' },
        slot2: { teamId: getTeamByRank('F', 1), source: 'Runner-up Group F' },
        winnerId: null,
      };
      // M10: Runner-up E vs Runner-up I
      newMatches['M10'] = { ...newMatches['M10'],
        slot1: { teamId: getTeamByRank('E', 1), source: 'Runner-up Group E' },
        slot2: { teamId: getTeamByRank('I', 1), source: 'Runner-up Group I' },
        winnerId: null,
      };
      // M11: Winner Group A vs 3rd
      newMatches['M11'] = { ...newMatches['M11'],
        slot1: { teamId: getTeamByRank('A', 0), source: 'Winner Group A' },
        slot2: { teamId: assignment['M11'] ? getTeamByRank(assignment['M11'], 2) : null, source: `3rd Group ${assignment['M11'] ?? ''}` },
        winnerId: null,
      };
      // M12: Winner Group L vs 3rd
      newMatches['M12'] = { ...newMatches['M12'],
        slot1: { teamId: getTeamByRank('L', 0), source: 'Winner Group L' },
        slot2: { teamId: assignment['M12'] ? getTeamByRank(assignment['M12'], 2) : null, source: `3rd Group ${assignment['M12'] ?? ''}` },
        winnerId: null,
      };
      // M13: Winner Group J vs Runner-up H
      newMatches['M13'] = { ...newMatches['M13'],
        slot1: { teamId: getTeamByRank('J', 0), source: 'Winner Group J' },
        slot2: { teamId: getTeamByRank('H', 1), source: 'Runner-up Group H' },
        winnerId: null,
      };
      // M14: Runner-up D vs Runner-up G
      newMatches['M14'] = { ...newMatches['M14'],
        slot1: { teamId: getTeamByRank('D', 1), source: 'Runner-up Group D' },
        slot2: { teamId: getTeamByRank('G', 1), source: 'Runner-up Group G' },
        winnerId: null,
      };
      // M15: Winner Group B vs 3rd
      newMatches['M15'] = { ...newMatches['M15'],
        slot1: { teamId: getTeamByRank('B', 0), source: 'Winner Group B' },
        slot2: { teamId: assignment['M15'] ? getTeamByRank(assignment['M15'], 2) : null, source: `3rd Group ${assignment['M15'] ?? ''}` },
        winnerId: null,
      };
      // M16: Winner Group K vs 3rd
      newMatches['M16'] = { ...newMatches['M16'],
        slot1: { teamId: getTeamByRank('K', 0), source: 'Winner Group K' },
        slot2: { teamId: assignment['M16'] ? getTeamByRank(assignment['M16'], 2) : null, source: `3rd Group ${assignment['M16'] ?? ''}` },
        winnerId: null,
      };

      return {
        ...prev,
        thirdPlaceAssignment: assignment,
        matches: newMatches,
        step: 'bracket',
      };
    });
  }, []);

  const goBackToGroups = useCallback(() => {
    setState(prev => ({ ...prev, step: 'groups' }));
  }, []);

  const recomputeBracket = useCallback(() => {
    // Recompute all downstream match slots based on winners
    setState(prev => {
      const newMatches = { ...prev.matches };

      // For each match in BRACKET_FEED, update slot based on feeder match winners
      for (const [matchId, [feed1, feed2]] of Object.entries(BRACKET_FEED)) {
        const winner1 = newMatches[feed1]?.winnerId ?? null;
        const winner2 = newMatches[feed2]?.winnerId ?? null;
        newMatches[matchId] = {
          ...newMatches[matchId],
          slot1: { teamId: winner1, source: `Winner ${feed1}` },
          slot2: { teamId: winner2, source: `Winner ${feed2}` },
        };
      }

      // 3PO: SF losers
      const sf1 = newMatches['SF1'];
      const sf2 = newMatches['SF2'];
      const sf1Loser = sf1.winnerId
        ? (sf1.winnerId === sf1.slot1.teamId ? sf1.slot2.teamId : sf1.slot1.teamId)
        : null;
      const sf2Loser = sf2.winnerId
        ? (sf2.winnerId === sf2.slot1.teamId ? sf2.slot2.teamId : sf2.slot1.teamId)
        : null;
      newMatches['3PO'] = {
        ...newMatches['3PO'],
        slot1: { teamId: sf1Loser, source: 'SF1 Loser' },
        slot2: { teamId: sf2Loser, source: 'SF2 Loser' },
      };

      return { ...prev, matches: newMatches };
    });
  }, []);

  const pickMatchWinner = useCallback((matchId: string, winnerId: string) => {
    setState(prev => {
      const newMatches = { ...prev.matches };
      const currentMatch = newMatches[matchId];
      // Clear score data if the winner changed
      if (currentMatch.winnerId !== winnerId) {
        newMatches[matchId] = { ...currentMatch, winnerId, score1: null, score2: null, isDraw: false, penaltyWinnerId: null };
      } else {
        newMatches[matchId] = { ...currentMatch, winnerId };
      }

      // Propagate: update downstream match slots
      for (const [upMatchId, [feed1, feed2]] of Object.entries(BRACKET_FEED)) {
        const winner1 = newMatches[feed1]?.winnerId ?? null;
        const winner2 = newMatches[feed2]?.winnerId ?? null;
        newMatches[upMatchId] = {
          ...newMatches[upMatchId],
          slot1: { teamId: winner1, source: `Winner ${feed1}` },
          slot2: { teamId: winner2, source: `Winner ${feed2}` },
        };
      }

      // 3PO: SF losers
      const sf1 = newMatches['SF1'];
      const sf2 = newMatches['SF2'];
      const sf1Loser = sf1.winnerId
        ? (sf1.winnerId === sf1.slot1.teamId ? sf1.slot2.teamId : sf1.slot1.teamId)
        : null;
      const sf2Loser = sf2.winnerId
        ? (sf2.winnerId === sf2.slot1.teamId ? sf2.slot2.teamId : sf2.slot1.teamId)
        : null;
      newMatches['3PO'] = {
        ...newMatches['3PO'],
        slot1: { teamId: sf1Loser, source: 'SF1 Loser' },
        slot2: { teamId: sf2Loser, source: 'SF2 Loser' },
      };

      return { ...prev, matches: newMatches };
    });
  }, []);

  const setMatchScore = useCallback((matchId: string, score1: number | null, score2: number | null, penaltyWinnerId?: string | null) => {
    setState(prev => {
      const newMatches = { ...prev.matches };
      const match = newMatches[matchId];
      const isDraw = score1 !== null && score2 !== null && score1 === score2;

      let winnerId = match.winnerId;
      if (isDraw) {
        // On a draw, winner is determined by penalty selection;
        // keep existing winnerId if no penalty pick yet (so the UI stays visible)
        winnerId = penaltyWinnerId ?? match.winnerId;
      } else if (score1 !== null && score2 !== null) {
        // Non-draw with scores: winner is the higher-scoring team
        winnerId = score1 > score2 ? match.slot1.teamId : match.slot2.teamId;
      }

      newMatches[matchId] = {
        ...match,
        score1,
        score2,
        isDraw,
        penaltyWinnerId: isDraw ? (penaltyWinnerId ?? null) : null,
        winnerId,
      };

      // Propagate downstream
      for (const [upMatchId, [feed1, feed2]] of Object.entries(BRACKET_FEED)) {
        const winner1 = newMatches[feed1]?.winnerId ?? null;
        const winner2 = newMatches[feed2]?.winnerId ?? null;
        newMatches[upMatchId] = {
          ...newMatches[upMatchId],
          slot1: { teamId: winner1, source: `Winner ${feed1}` },
          slot2: { teamId: winner2, source: `Winner ${feed2}` },
        };
      }

      // 3PO: SF losers
      const sf1 = newMatches['SF1'];
      const sf2 = newMatches['SF2'];
      const sf1Loser = sf1.winnerId
        ? (sf1.winnerId === sf1.slot1.teamId ? sf1.slot2.teamId : sf1.slot1.teamId)
        : null;
      const sf2Loser = sf2.winnerId
        ? (sf2.winnerId === sf2.slot1.teamId ? sf2.slot2.teamId : sf2.slot1.teamId)
        : null;
      newMatches['3PO'] = {
        ...newMatches['3PO'],
        slot1: { teamId: sf1Loser, source: 'SF1 Loser' },
        slot2: { teamId: sf2Loser, source: 'SF2 Loser' },
      };

      return { ...prev, matches: newMatches };
    });
  }, []);

  const goToShare = useCallback(() => {
    setState(prev => ({ ...prev, step: 'share' }));
  }, []);

  const loadBracket = useCallback((newState: AppState) => {
    window.location.hash = '';
    setState(newState);
  }, []);

  const resetApp = useCallback(() => {
    window.location.hash = '';
    setState(buildInitialState());
  }, []);

  const value: AppContextValue = {
    state,
    isViewOnly,
    setBracketName,
    startBracket,
    updateGroupRankings,
    markGroupComplete,
    goToThirdPlace,
    toggleThirdPlace,
    confirmThirdPlace,
    goBackToGroups,
    pickMatchWinner,
    setMatchScore,
    goToShare,
    resetApp,
    recomputeBracket,
    loadBracket,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
