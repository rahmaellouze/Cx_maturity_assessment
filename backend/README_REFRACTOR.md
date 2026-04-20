# CX framework refactor

This version converts the assessment from the old structure:

- sector
- dimension
- subdimension
- question

into the new structure:

- axis
- question

## What changed

- Added `axes` API, schema, and repository
- Replaced `sector_id` and `subdimension_id` in questions with `axis_id`
- Added `question_code` for `Q1`, `Q2`, etc.
- Replaced dimension/subdimension scoring with `assessment_axis_scores`
- Rewrote the scoring service to calculate results by axis
- Added `backend/data/framework.json` derived from the uploaded workbook
- Added `backend/sql/framework_seed_data.sql` to seed the 3 axes and 12 questions

## Suggested DB migration order

1. Apply `backend/sql/questions_schema.sql`
2. Apply `backend/sql/assessment_scoring_schema.sql`
3. Apply `backend/sql/framework_seed_data.sql`
4. Archive the old sector/dimension/subdimension scripts

## Notes

The backend and data model are the main part of this refactor. The original frontend admin area was deeply tied to sectors, dimensions, and subdimensions, so it still needs a full UI cleanup if you want the old admin routes completely replaced end-to-end.

## 2026-04-17 flow update

This refactor now seeds conversational flow transitions as answer-level next-step prompts.

Key changes:
- `question_answer_options` now stores `option_code`
- `question_display_rules` is now used as a transition table:
  - `question_id` = current question
  - `expected_option_id` = selected answer option
  - `next_question_id` = next question in the guided flow
  - `transition_text` = answer-specific handoff prompt
- `framework_seed_data.sql` now inserts 38 transition rows from `framework.json`

Apply in this order on MySQL:
1. `backend/sql/questions_schema.sql`
2. `backend/sql/assessment_scoring_schema.sql`
3. `backend/sql/framework_seed_data.sql`

Quick verification:
```sql
SELECT COUNT(*) AS rules_count FROM question_display_rules;
SELECT q.question_code, o.option_value, nr.question_code AS next_question, r.transition_text
FROM question_display_rules r
JOIN questions q ON q.id = r.question_id
JOIN question_answer_options o ON o.id = r.expected_option_id
LEFT JOIN questions nr ON nr.id = r.next_question_id
ORDER BY q.display_order, r.display_order;
```
