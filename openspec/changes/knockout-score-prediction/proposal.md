## Why

Bracket predictions are currently winner-only, which limits engagement and makes all brackets feel generic. Letting users predict scores (including draws resolved by penalties) adds depth and creates more differentiated, memorable brackets.

## What Changes

- Users can optionally input a predicted score for each knockout stage match (R32 through Final and 3rd Place)
- A compact score input bubble appears alongside the match after a winner is selected
- Users can mark a match as a draw (e.g. 1–1 AET) and then pick which team wins on penalties
- Score predictions are stored per-match and included in the shared bracket URL
- Group stage matches are **not** affected — score prediction is knockout rounds only

## Capabilities

### New Capabilities

- `match-score-prediction`: Per-match score input UI and state for knockout stage matches, supporting normal-time scores, draw + penalty winner selection

### Modified Capabilities

- `bracket-display`: The `BracketMatch` component gains an optional score input bubble; the `Match` type gains score prediction fields

## Impact

- **Frontend**: `BracketMatch` component updated with score bubble UI; `types.ts` extended with score fields; `AppContext` gains a `setMatchScore` action
- **State**: `Match` interface gains `score1`, `score2` (nullable numbers), `isDraw` (boolean), `penaltyWinnerId` (nullable string)
- **URL sharing**: `urlEncoding.ts` must encode/decode the new score fields so shared brackets preserve predictions
- **No backend changes** — this is a frontend-only addition
