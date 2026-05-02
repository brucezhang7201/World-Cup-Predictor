## ADDED Requirements

### Requirement: Score input available on knockout matches
The system SHALL allow users to optionally enter a predicted score for any knockout stage match (rounds R32, R16, QF, SF, FINAL, 3PO). Score input SHALL NOT be available on group stage matches.

#### Scenario: Score bubble appears after winner is picked
- **WHEN** a user picks a winner for a knockout match
- **THEN** a score input bubble SHALL appear below the match showing two numeric inputs (one per team)

#### Scenario: Score bubble is hidden before winner is picked
- **WHEN** a knockout match has no winner selected yet
- **THEN** no score input SHALL be visible for that match

#### Scenario: Score input accepts non-negative integers
- **WHEN** a user types a value in either score field
- **THEN** the system SHALL accept only non-negative integers (0, 1, 2, …) and ignore non-numeric characters

#### Scenario: Score is optional
- **WHEN** a user picks a winner but leaves the score inputs empty
- **THEN** the bracket SHALL remain valid and the winner SHALL be recorded without any score

### Requirement: Re-picking winner clears score
The system SHALL clear all score data (score1, score2, isDraw, penaltyWinnerId) when the user picks a different winner for a match.

#### Scenario: Winner changed, score cleared
- **WHEN** a match already has a winner and a score entered
- **AND** the user clicks the other team to change the winner
- **THEN** score1, score2, isDraw, and penaltyWinnerId SHALL all be reset to null/false

### Requirement: Draw prediction with penalty winner
When both score inputs are filled in and the values are equal, the system SHALL treat the result as a draw and prompt the user to select which team won on penalties.

#### Scenario: Equal scores trigger draw state
- **WHEN** a user enters equal non-null scores (e.g. 1–1)
- **THEN** isDraw SHALL be set to true
- **AND** a penalty-winner selector SHALL appear showing both teams as selectable chips

#### Scenario: Penalty winner updates winnerId
- **WHEN** a user selects a team as the penalty winner
- **THEN** winnerId SHALL be updated to that team's ID
- **AND** penaltyWinnerId SHALL be set to that team's ID

#### Scenario: Unequal scores clear draw state
- **WHEN** a user edits scores so they are no longer equal
- **THEN** isDraw SHALL be set to false
- **AND** penaltyWinnerId SHALL be cleared
- **AND** winnerId SHALL reflect the team with the higher score

#### Scenario: 0–0 draw is valid
- **WHEN** both score inputs are 0
- **THEN** the draw state SHALL activate and the penalty-winner selector SHALL appear

### Requirement: Score persisted in share URL
The system SHALL encode non-null score fields (score1, score2, isDraw, penaltyWinnerId) into the bracket share URL so that recipients viewing a shared bracket see the predicted scores.

#### Scenario: Shared bracket shows scores
- **WHEN** a user with predicted scores shares their bracket URL
- **AND** another user opens that URL
- **THEN** the score bubble SHALL be visible on each match that has score data

#### Scenario: Matches with no score omitted from encoding
- **WHEN** a match has null score1 and null score2
- **THEN** no score bytes SHALL be added to the URL for that match
