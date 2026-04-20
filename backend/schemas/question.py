from pydantic import BaseModel, Field
from typing import Optional

class AnswerOptionBase(BaseModel):
    option_label: str
    option_value: str
    option_code: Optional[str] = None
    score: Optional[float] = None
    maturity_level: Optional[int] = None
    display_order: int = 0
    is_active: bool = True

class AnswerOptionCreate(AnswerOptionBase):
    pass

class AnswerOptionOut(AnswerOptionBase):
    id: int
    question_id: int

class DisplayRuleBase(BaseModel):
    expected_option_id: int
    next_question_id: Optional[int] = None
    transition_text: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

class DisplayRuleCreate(DisplayRuleBase):
    pass

class DisplayRuleOut(DisplayRuleBase):
    id: int
    question_id: int

class QuestionBase(BaseModel):
    axis_id: int
    question_code: str
    question_text: str
    helper_text: Optional[str] = None
    answer_type: str
    is_mandatory: bool = True
    is_scored: bool = True
    scoring_strategy: str = "single_option_score"
    weight: Optional[float] = None
    display_order: int = 0
    is_active: bool = True

class QuestionCreate(QuestionBase):
    options: list[AnswerOptionCreate] = Field(default_factory=list)
    display_rules: list[DisplayRuleCreate] = Field(default_factory=list)

class QuestionUpdate(QuestionBase):
    options: list[AnswerOptionCreate] = Field(default_factory=list)
    display_rules: list[DisplayRuleCreate] = Field(default_factory=list)

class QuestionOut(QuestionBase):
    id: int
    options: list[AnswerOptionOut] = Field(default_factory=list)
    display_rules: list[DisplayRuleOut] = Field(default_factory=list)

class QuestionCreateResponse(BaseModel):
    question_id: int
    message: str
