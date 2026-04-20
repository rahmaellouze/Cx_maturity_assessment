-- Cleanup for the current assessment flow.
-- Keeps the active transition cache and removes unused formulation cache artifacts.

DROP TABLE IF EXISTS question_formulation_cache;
