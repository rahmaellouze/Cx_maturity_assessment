import { apiClient } from "@/lib/apiClient";
import type { Question, QuestionCreateResponse, QuestionPayload } from "../types/question.types";

export async function getQuestions(filters?: { axisId?: number; sectorId?: number; subdimensionId?: number }): Promise<Question[]> {
  const params = new URLSearchParams();
  if (filters?.axisId) params.set("axis_id", String(filters.axisId));
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiClient<Question[]>(`/questions${query}`);
}

export async function createQuestion(payload: QuestionPayload): Promise<QuestionCreateResponse> {
  return apiClient<QuestionCreateResponse>("/questions", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateQuestion(questionId: number, payload: QuestionPayload): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/questions/${questionId}`, { method: "PUT", body: JSON.stringify(payload) });
}

export async function deleteQuestion(questionId: number): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/questions/${questionId}`, { method: "DELETE" });
}
