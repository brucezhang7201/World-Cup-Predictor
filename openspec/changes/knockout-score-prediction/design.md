## Context

The app is a frontend-only React + TypeScript bracket predictor. Knockout matches are rendered by `BracketMatch` in [src/components/Bracket/BracketMatch.tsx](src/components/Bracket/BracketMatch.tsx). Match state lives in `AppContext` (`src/context/AppContext.tsx`) as a flat `Record<string, Match>`. URL sharing serializes the entire `AppState` via `src/utils/urlEncoding.ts`.

Currently, `Match` only tracks `winnerId`. There is no concept of a score or draw — winner selection is a single click on a team slot.

## Goals / Non-Goals

**Goals:**
- Add optional score input (team 1 goals, team 2 goals) to every knockout match
- Support draw prediction (equal scores) with a separate penalty-winner picker
- Keep score input non-blocking — users can predict a winner without ever filling in a score
- Encode score data in the share URL so shared brackets show predictions

**Non-Goals:**
- Score prediction for group stage matches
- Validation against real-world score limits
- Any backend or persistence changes
- Score-based leaderboard or point calculation (future feature)

## Decisions

### 1. Extend `Match` type rather than a parallel structure

Add `score1`, `score2` (nullable `number`), `isDraw` (boolean, default `false`), and `penaltyWinnerId` (nullable `string`) directly to the `Match` interface.

**Why**: The match is already the unit of state; co-locating score with `winnerId` keeps serialization, URL encoding, and propagation logic in one place. A separate `scores` map would require keeping IDs in sync and complicates the share URL.

**Alternative considered**: A `Record<string, MatchScore>` parallel to `matches`. Rejected — more indirection, same data.

### 2. Score bubble appears only after a winner is picked

The score input is revealed (slides in) only once `winnerId` is set on a match. Picking a different winner clears the score.

**Why**: Enforces the logical order (pick winner → optionally add score) and avoids UI clutter on TBD matches. Clearing on re-pick prevents stale data (e.g., a 2–0 score with the losing team later switched as winner).

### 3. Draw flow: equal score auto-sets `isDraw = true`, then a penalty-winner chip appears

When `score1 === score2` and both are non-null, `isDraw` is set automatically and a small "Who wins on penalties?" row appears inside the bubble, showing the two team flags as selectable chips. Selecting one sets `penaltyWinnerId` and also updates `winnerId` to match.

**Why**: Asking "is this a draw?" as a separate toggle is an extra step. Deriving it from equal scores is more intuitive. The penalty-winner picker replaces the normal winner click in this scenario, keeping a single source of truth for `winnerId`.

**Alternative considered**: A separate "draw?" checkbox. Rejected — redundant when scores are equal.

### 4. Score bubble as an inline collapsible within `BracketMatch`

The bubble sits directly below the match slots inside the existing `bracket-match` card. It is a small, visually secondary element (lighter background, smaller font).

**Why**: Keeps the bracket layout stable — no extra columns or popovers that could break the SVG-free CSS grid layout. A popover/tooltip approach would require z-index management across the deeply nested bracket grid.

### 5. `setMatchScore` action in `AppContext`

A single new action `setMatchScore(matchId, score1, score2, penaltyWinnerId?)` updates the match in state and handles the `isDraw` derivation.

**Why**: Mirrors the existing `pickMatchWinner` pattern. Keeps mutation logic out of the component.

## Risks / Trade-offs

- **URL length**: Score fields add ~4 bytes per match × 63 matches ≈ ~250 bytes before base64. At worst this adds ~340 chars to the URL hash — acceptable for modern browsers (limit ~2000 chars for hash).  
  → Mitigation: Only encode non-null scores; use compact integer encoding.

- **Score clearing on winner re-pick**: Users who enter a score then change their mind about the winner lose the score. This is intentional but could feel annoying.  
  → Mitigation: Only clear score if the new winner differs from the current one.

- **`isDraw` derived from equal scores**: A 0–0 scoreline with no winner is technically valid (though rare in predictions). If `score1 === score2 === 0` and both are set, the draw flow triggers.  
  → Mitigation: 0–0 is a legitimate draw prediction; penalty winner prompt handles it correctly.

## Open Questions

- Should the score bubble also display on view-only (shared) brackets? **Proposed: yes, read-only.** Adds value without complexity.
- Should re-picking a winner that differs from `penaltyWinnerId` reset the draw state? **Proposed: yes** — if you change the winner click, clear score entirely.
