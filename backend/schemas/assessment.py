from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class AssessmentCreate(BaseModel):
    company_name: Optional[str] = None
    respondent_name: Optional[str] = None
    respondent_email: Optional[EmailStr] = None
    respondent_role_title: Optional[str] = None

class AssessmentCreateResponse(BaseModel):
    assessment_id: int
    message: str

class AssessmentOut(BaseModel):
    id: int
    company_name: Optional[str] = None
    respondent_name: Optional[str] = None
    respondent_email: Optional[EmailStr] = None
    respondent_role_title: Optional[str] = None
    status: str
    overall_score: Optional[float] = None
    maturity_level: Optional[str] = None

class AssessmentAnswerSubmit(BaseModel):
    question_id: int
    selected_option_id: Optional[int] = None
    selected_option_ids: list[int] = Field(default_factory=list)
    answer_text: Optional[str] = None

class AssessmentSubmitRequest(BaseModel):
    answers: list[AssessmentAnswerSubmit] = Field(default_factory=list)

class AssessmentAxisScoreOut(BaseModel):
    axis_id: int
    axis_name: str
    raw_score: Optional[float] = None
    max_score: Optional[float] = None
    score_percent: Optional[float] = None
    maturity_band: Optional[str] = None

class AssessmentRecommendationOut(BaseModel):
    axis_id: int
    axis_name: str
    recommendation_type: str
    recommendation_title: str
    recommendation_text: str
    priority_level: str
    source_theme_type: str
    question_id: Optional[int] = None
    question_code: Optional[str] = None

class AssessmentSubmitResponse(BaseModel):
    assessment_id: int
    overall_score: Optional[float] = None
    maturity_level: Optional[str] = None
    axis_scores: list[AssessmentAxisScoreOut] = Field(default_factory=list)
    recommendations: list[AssessmentRecommendationOut] = Field(default_factory=list)

class AssessmentAnswerSelectedOptionOut(BaseModel):
    option_id: int
    option_label: str
    option_value: str
    score: Optional[float] = None

class AssessmentAnswerLogOut(BaseModel):
    assessment_answer_id: Optional[int] = None
    question_id: int
    question_code: Optional[str] = None
    question_text: str
    axis_id: int
    axis_name: str
    answer_type: str
    is_mandatory: bool
    is_scored: bool
    scoring_strategy: str
    selected_option_id: Optional[int] = None
    selected_option_label: Optional[str] = None
    selected_option_value: Optional[str] = None
    selected_options: list[AssessmentAnswerSelectedOptionOut] = Field(default_factory=list)
    answer_text: Optional[str] = None
    numeric_score: Optional[float] = None
    answered_at: Optional[str] = None

class AssessmentAxisResultOut(BaseModel):
    axis_id: int
    code: str
    name: str
    score_percent: Optional[float] = None
    raw_score: Optional[float] = None
    max_score: Optional[float] = None
    maturity_band: Optional[str] = None
    description: Optional[str] = None
    priority_actions: Optional[str] = None
    answers: list[AssessmentAnswerLogOut] = Field(default_factory=list)
    recommendations: list[AssessmentRecommendationOut] = Field(default_factory=list)

class AssessmentResultsOut(BaseModel):
    assessment_id: int
    company_name: Optional[str] = None
    respondent_name: Optional[str] = None
    respondent_email: Optional[EmailStr] = None
    respondent_role_title: Optional[str] = None
    status: str
    overall_score: Optional[float] = None
    maturity_level: Optional[str] = None
    axes: list[AssessmentAxisResultOut] = Field(default_factory=list)
    recommendations: list[AssessmentRecommendationOut] = Field(default_factory=list)
