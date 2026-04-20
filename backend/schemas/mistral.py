from pydantic import BaseModel
from typing import Any

class AssessmentContext(BaseModel):
    company_name: str | None = None
    respondent_name: str | None = None

class QuestionLLMRequest(BaseModel):
    id: int
    question_code: str | None = None
    question_text: str
    helper_text: str | None = None
    answer_type: str
    options: list[dict] = []
    context_text: str | None = None
    assessment_context: AssessmentContext | None = None

class QuestionLLMResponse(BaseModel):
    assistant_text: str

class ResultsQuestionSummary(BaseModel):
    question_code: str | None = None
    question_text: str
    answer_text: str | None = None
    selected_option_labels: list[str] = []
    axis_name: str

class ResultsProfilingSummary(BaseModel):
    question_code: str | None = None
    question_text: str
    answer_text: str | None = None
    selected_option_labels: list[str] = []

class ResultsAxisSummary(BaseModel):
    axis_id: int
    axis_name: str
    score_percent: float | None = None
    maturity_band: str | None = None

class ResultsLLMRequest(BaseModel):
    assessment_id: int
    company_name: str | None = None
    respondent_name: str | None = None
    overall_score: float | None = None
    maturity_level: str | None = None
    axes: list[ResultsAxisSummary] = []
    answers: list[ResultsQuestionSummary] = []
    profiling: list[ResultsProfilingSummary] = []

class ResultsLLMResponse(BaseModel):
    assistant_text: str

class TransitionLLMRequest(BaseModel):
    from_question_id: int
    to_question_id: int
    user_answer: str
    assessment_id: int | None = None
    company_name: str | None = None
    assessment_progress: str | None = None

class TransitionLLMResponse(BaseModel):
    transition_text: str

