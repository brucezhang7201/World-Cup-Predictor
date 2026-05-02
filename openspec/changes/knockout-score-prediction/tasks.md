## 1. Data Model

- [x] 1.1 Add `score1`, `score2` (`number | null`), `isDraw` (`boolean`), and `penaltyWinnerId` (`string | null`) to the `Match` interface in `src/types.ts`
- [x] 1.2 Update `createInitialMatches` in `src/data/bracket.ts` to initialise the new fields to `null` / `false` on every match

## 2. State Management

- [x] 2.1 Add `setMatchScore(matchId: string, score1: number | null, score2: number | null, penaltyWinnerId?: string | null)` to `AppContextValue` in `src/context/AppContext.tsx`
- [x] 2.2 Implement `setMatchScore` handler: derive `isDraw` from equal non-null scores, update `winnerId` to match the higher-scoring team (or `penaltyWinnerId` on a draw), and clear score fields when winner changes in `pickMatchWinner`
- [x] 2.3 Expose `setMatchScore` through the context value object

## 3. Score Bubble UI

- [x] 3.1 Create `src/components/Bracket/ScoreBubble.tsx` — a compact component that receives `match`, `isViewOnly`, and `onScoreChange` props and renders two number inputs (or static score text in view-only mode)
- [x] 3.2 Add draw/penalty UI inside `ScoreBubble`: when `isDraw` is true show a small "PKs →" label and two team-flag chip buttons for penalty winner selection
- [x] 3.3 Import and render `ScoreBubble` inside `BracketMatch` below the match slots — visible only when `winnerId` is set and both slots have teams

## 4. Styling

- [x] 4.1 Add `.score-bubble` styles to `src/index.css` (or `src/App.css`): compact card, two inline number inputs, muted secondary appearance that doesn't compete with the team slots
- [x] 4.2 Add `.penalty-chips` styles for the penalty-winner row: small flag + team-name chips, highlight the selected penalty winner
- [x] 4.3 Ensure the score bubble is visually hidden / not rendered on TBD matches and on group-stage cards

## 5. URL Encoding

- [x] 5.1 Verify that `encodeState` / `decodeState` in `src/utils/urlEncoding.ts` already handles the new fields via JSON serialisation (they should, since the full `AppState` is serialised)
- [x] 5.2 Confirm shared brackets render score bubbles in read-only mode by testing a round-trip: fill in scores → share → open URL → scores visible as static text

## 6. Integration & Polish

- [x] 6.1 Test winner re-pick clears score: pick a winner, enter a score, pick the other team — score inputs should reset to empty
- [x] 6.2 Test 0–0 draw flow: enter 0 in both inputs → penalty chips appear → select penalty winner → winnerId updates correctly
- [x] 6.3 Verify score bubble does not appear on group-stage `GroupCard` components
- [x] 6.4 Verify score bubble appears on 3rd Place (`3PO`) and Final (`FINAL`) matches
