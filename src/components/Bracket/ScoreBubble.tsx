import type { Match } from '../../types';
import { TEAM_MAP } from '../../data/teams';

interface ScoreBubbleProps {
  match: Match;
  isViewOnly: boolean;
  onScoreChange: (score1: number | null, score2: number | null, penaltyWinnerId?: string | null) => void;
}

export function ScoreBubble({ match, isViewOnly, onScoreChange }: ScoreBubbleProps) {
  const team1 = match.slot1.teamId ? TEAM_MAP[match.slot1.teamId] : null;
  const team2 = match.slot2.teamId ? TEAM_MAP[match.slot2.teamId] : null;

  if (!team1 || !team2) return null;

  const handleScoreInput = (slot: 1 | 2, value: string) => {
    const parsed = value === '' ? null : parseInt(value, 10);
    if (parsed !== null && (isNaN(parsed) || parsed < 0)) return;

    const newScore1 = slot === 1 ? parsed : match.score1;
    const newScore2 = slot === 2 ? parsed : match.score2;
    onScoreChange(newScore1, newScore2, match.penaltyWinnerId);
  };

  const handlePenaltyPick = (teamId: string) => {
    onScoreChange(match.score1, match.score2, teamId);
  };

  if (isViewOnly) {
    if (match.score1 === null && match.score2 === null) return null;
    return (
      <div className="score-bubble score-bubble-readonly">
        <div className="score-display">
          <span className="score-team-flag">{team1.flag}</span>
          <span className="score-value">{match.score1 ?? '–'}</span>
          <span className="score-separator">–</span>
          <span className="score-value">{match.score2 ?? '–'}</span>
          <span className="score-team-flag">{team2.flag}</span>
        </div>
        {match.isDraw && match.penaltyWinnerId && (
          <div className="penalty-label-row">
            <span className="penalty-label-text">
              {TEAM_MAP[match.penaltyWinnerId]?.flag} wins on PKs
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="score-bubble">
      <div className="score-inputs">
        <span className="score-team-flag">{team1.flag}</span>
        <input
          type="number"
          className="score-input"
          min={0}
          value={match.score1 ?? ''}
          onChange={(e) => handleScoreInput(1, e.target.value)}
          placeholder="–"
        />
        <span className="score-separator">–</span>
        <input
          type="number"
          className="score-input"
          min={0}
          value={match.score2 ?? ''}
          onChange={(e) => handleScoreInput(2, e.target.value)}
          placeholder="–"
        />
        <span className="score-team-flag">{team2.flag}</span>
      </div>
      {match.isDraw && (
        <div className="penalty-chips">
          <span className="penalty-label">PKs</span>
          <button
            type="button"
            className={`penalty-chip ${match.penaltyWinnerId === match.slot1.teamId ? 'selected' : ''}`}
            onClick={() => handlePenaltyPick(match.slot1.teamId!)}
          >
            {team1.flag}
          </button>
          <button
            type="button"
            className={`penalty-chip ${match.penaltyWinnerId === match.slot2.teamId ? 'selected' : ''}`}
            onClick={() => handlePenaltyPick(match.slot2.teamId!)}
          >
            {team2.flag}
          </button>
        </div>
      )}
    </div>
  );
}
