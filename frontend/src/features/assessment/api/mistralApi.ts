import { apiClient } from "@/lib/apiClient";
import type { Question } from "@/features/questions/types/question.types";

export type QuestionLLMRequest = {
  id: number;
  question_code?: string | null;
  question_text: string;
  helper_text?: string | null;
  answer_type: string;
  options: Array<{
    id?: number;
    option_label: string;
    option_value: string;
    option_code?: string | null;
  }>;
  context_text?: string | null;
  assessment_context?: {
    company_name?: string | null;
  };
};

export type ResultsQuestionSummary = {
  question_code?: string | null;
  question_text: string;
  answer_text?: string | null;
  selected_option_labels: string[];
  axis_name: string;
};

export type ResultsProfilingSummary = {
  question_code?: string | null;
  question_text: string;
  answer_text?: string | null;
  selected_option_labels: string[];
};

export type ResultsAxisSummary = {
  axis_id: number;
  axis_name: string;
  score_percent?: number | null;
  maturity_band?: string | null;
};

export type ResultsLLMRequest = {
  assessment_id: number;
  company_name?: string | null;
  respondent_name?: string | null;
  overall_score?: number | null;
  maturity_level?: string | null;
  axes: ResultsAxisSummary[];
  answers: ResultsQuestionSummary[];
  profiling: ResultsProfilingSummary[];
};

export type QuestionLLMResponse = {
  assistant_text: string;
};

export type ResultsLLMResponse = {
  assistant_text: string;
};

export async function generateAssistantQuestion(
  question: Question,
  assessmentContext?: { company_name?: string | null },
): Promise<QuestionLLMResponse> {
  const payload: QuestionLLMRequest = {
    id: question.id,
    question_code: question.question_code,
    question_text: question.question_text,
    helper_text: question.helper_text,
    answer_type: question.answer_type,
    options: question.options.map((option) => ({
      id: option.id,
      option_label: option.option_label,
      option_value: option.option_value,
      option_code: option.option_code,
    })),
    context_text: question.context_text,
    assessment_context: assessmentContext,
  };

  return apiClient<QuestionLLMResponse>("/llm/question", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function generateAssessmentResultsInsights(
  payload: ResultsLLMRequest,
): Promise<ResultsLLMResponse> {
  return apiClient<ResultsLLMResponse>("/llm/results", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type TransitionLLMRequest = {
  from_question_id: number;
  to_question_id: number;
  user_answer: string;
  assessment_id?: number | null;
  company_name?: string | null;
  assessment_progress?: string | null;
};

export type TransitionLLMResponse = {
  transition_text: string;
};

export async function generateTransition(
  payload: TransitionLLMRequest,
): Promise<TransitionLLMResponse> {
  return apiClient<TransitionLLMResponse>("/llm/transition", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

