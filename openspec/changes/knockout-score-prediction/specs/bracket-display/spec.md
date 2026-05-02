## MODIFIED Requirements

### Requirement: Knockout match card shows score bubble
The `BracketMatch` component SHALL render a compact score input bubble below the team slots for knockout stage matches whenever the match has a selected winner. In view-only mode the bubble SHALL be rendered as read-only text.

#### Scenario: Score bubble in edit mode
- **WHEN** a knockout match has a winner selected and the bracket is in edit mode
- **THEN** two small numeric inputs SHALL appear side-by-side below the match slots
- **AND** each input SHALL be labelled with the corresponding team flag

#### Scenario: Score bubble in view-only mode
- **WHEN** a shared (view-only) bracket is opened
- **AND** a match has score data
- **THEN** the score SHALL be displayed as static text (e.g. "2 – 1") instead of inputs

#### Scenario: Penalty label shown on draw
- **WHEN** a knockout match has isDraw = true and a penaltyWinnerId is set
- **THEN** the score display SHALL include a small "PKs" label next to the penalty-winning team

#### Scenario: No score bubble on TBD matches
- **WHEN** one or both slots of a knockout match are TBD
- **THEN** no score bubble SHALL be shown regardless of winnerId state
