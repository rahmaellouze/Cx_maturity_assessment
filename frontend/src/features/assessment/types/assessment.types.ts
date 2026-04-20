export type CreateAssessmentPayload = {
  company_name: string | null;
  respondent_name: string | null;
  respondent_email: string | null;
  respondent_role_title: string | null;
  sector_id?: number | null;
};

export type CreateAssessmentResponse = {
  assessment_id: number;
};

export type Assessment = {
  id: number;
  company_name: string | null;
  respondent_name: string | null;
  respondent_email: string | null;
  respondent_role_title: string | null;
  sector_id?: number | null;
  status: string;
  overall_score: number | null;
  maturity_level: string | null;
};

export type AssessmentAnswerSubmit = {
  question_id: number;
  selected_option_id?: number | null;
  selected_option_ids?: number[];
  answer_text?: string | null;
};

export type AssessmentSubmitPayload = {
  answers: AssessmentAnswerSubmit[];
};

export type AssessmentChatMessageType =
  | "assistant_text"
  | "assistant_question"
  | "user_answer"
  | "system_progress";

export type AssessmentChatMessage = {
  id: string;
  type: AssessmentChatMessageType;
  text: string;
  createdAt: number;
  questionId?: number;
  questionCode?: string | null;
  helperText?: string | null;
  prefaceText?: string | null;
};

export type AssessmentChatProgress = {
  current: number;
  total: number;
  percentage: number;
  label: string;
};

export type AssessmentChatSelectedAnswer = number | number[] | string | null;

export type AssessmentStoredAnswer = {
  questionId: number;
  optionId: number | null;
  optionIds: number[];
  optionLabels: string[];
  optionCodes?: string[];
  answerText: string | null;
  transitionText: string | null;
  nextQuestionId: number | null;
};

export type AssessmentPendingTransition = {
  questionId: number;
  nextQuestionId: number | null;
  transitionText: string | null;
};

export type AssessmentPendingContext = {
  questionId: number;
  contextText: string;
};

export type AssessmentAxisScore = {
  axis_id: number;
  axis_name: string;
  raw_score: number | null;
  max_score: number | null;
  score_percent: number | null;
  maturity_band: string | null;
};

export type AssessmentRecommendation = {
  axis_id: number;
  axis_name: string;
  question_id: number | null;
  question_code?: string | null;
  recommendation_type: string;
  recommendation_title: string;
  recommendation_text: string;
  priority_level: string;
  source_theme_type: string;
};

export type AssessmentSubmitResponse = {
  assessment_id: number;
  overall_score: number | null;
  maturity_level: string | null;
  axis_scores: AssessmentAxisScore[];
  recommendations: AssessmentRecommendation[];
};

export type AssessmentAnswerSelectedOption = {
  option_id: number;
  option_label: string;
  option_value: string;
  score: number | null;
};

export type AssessmentAnswerLog = {
  assessment_answer_id?: number | null;
  question_id: number;
  question_code?: string | null;
  question_text: string;
  axis_id: number;
  axis_name: string;
  answer_type: string;
  is_mandatory: boolean;
  is_scored: boolean;
  scoring_strategy: string;
  selected_option_id?: number | null;
  selected_option_label?: string | null;
  selected_option_value?: string | null;
  selected_options: AssessmentAnswerSelectedOption[];
  answer_text?: string | null;
  numeric_score?: number | null;
  answered_at?: string | null;
};

export type AssessmentAxisResult = {
  axis_id: number;
  code: string;
  name: string;
  score_percent: number | null;
  raw_score: number | null;
  max_score: number | null;
  maturity_band: string | null;
  description: string | null;
  priority_actions: string | null;
  answers: AssessmentAnswerLog[];
  recommendations: AssessmentRecommendation[];
};

export type AssessmentResults = {
  assessment_id: number;
  company_name: string | null;
  respondent_name: string | null;
  respondent_email: string | null;
  respondent_role_title: string | null;
  status: string;
  overall_score: number | null;
  maturity_level: string | null;
  axes: AssessmentAxisResult[];
  recommendations: AssessmentRecommendation[];
};
