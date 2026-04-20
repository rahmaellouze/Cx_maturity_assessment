export type AnswerType = "single_select" | "multi_select" | "text_area";
export type ScoringStrategy = "none" | "single_option_score" | "multi_sum" | "multi_average" | "multi_max" | "manual";
export type DisplayRuleOperator = "equals" | "not_equals" | "in" | "not_in" | "score_gte" | "score_lte" | "score_between";

export type AnswerOption = {
  id?: number;
  question_id?: number;
  option_label: string;
  option_value: string;
  option_code?: string | null;
  score: number | null;
  maturity_level: number | null;
  display_order?: number;
  is_active: boolean;
};

export type DisplayRule = {
  id?: number;
  question_id?: number;
  depends_on_question_id?: number;
  operator?: DisplayRuleOperator;
  expected_option_id: number | null;
  expected_value?: string | null;
  min_score?: number | null;
  max_score?: number | null;
  rule_group?: string | null;
  next_question_id?: number | null;
  transition_text?: string | null;
  display_order?: number;
  is_active: boolean;
};

export type Question = {
  id: number;
  axis_id?: number;
  question_code?: string;
  sector_id?: number | null;
  subdimension_id?: number | null;
  context_text?: string | null;
  question_text: string;
  helper_text: string | null;
  answer_type: AnswerType;
  is_mandatory: boolean;
  is_scored: boolean;
  scoring_strategy: ScoringStrategy;
  weight: number | null;
  display_order?: number;
  is_active: boolean;
  llm_conversational_text?: string | null;
  options: AnswerOption[];
  display_rules: DisplayRule[];
};

export type QuestionPayload = Omit<Question, "id" | "options" | "display_rules"> & {
  options: AnswerOption[];
  display_rules: DisplayRule[];
};

export type QuestionCreateResponse = { question_id: number; message: string };
