from fastapi import HTTPException

VALID_ANSWER_TYPES = {"single_select", "multi_select", "text_area"}
VALID_SCORING_STRATEGIES = {
    "none",
    "single_option_score",
    "multi_sum",
    "multi_average",
    "multi_max",
    "manual",
}


def validate_question_payload(payload) -> None:
    if payload.axis_id <= 0:
        raise HTTPException(status_code=400, detail="axis_id must be a positive integer")
    if not payload.question_code.strip():
        raise HTTPException(status_code=400, detail="question_code is required")
    if not payload.question_text.strip():
        raise HTTPException(status_code=400, detail="question_text is required")
    if payload.answer_type not in VALID_ANSWER_TYPES:
        raise HTTPException(status_code=400, detail="Invalid answer_type")
    if payload.scoring_strategy not in VALID_SCORING_STRATEGIES:
        raise HTTPException(status_code=400, detail="Invalid scoring_strategy")
    if payload.answer_type == "text_area":
        if payload.options:
            raise HTTPException(status_code=400, detail="Text area questions cannot have answer options")
    else:
        if not payload.options:
            raise HTTPException(status_code=400, detail="Selectable questions require at least one answer option")
        option_values = set()
        option_codes = set()
        for option in payload.options:
            if not option.option_label.strip():
                raise HTTPException(status_code=400, detail="Option label is required")
            if not option.option_value.strip():
                raise HTTPException(status_code=400, detail="Option value is required")
            if option.option_value in option_values:
                raise HTTPException(status_code=400, detail="Option values must be unique per question")
            option_values.add(option.option_value)
            code = (option.option_code or option.option_value).strip()
            if code in option_codes:
                raise HTTPException(status_code=400, detail="Option codes must be unique per question")
            option_codes.add(code)
    for rule in payload.display_rules:
        if rule.expected_option_id <= 0:
            raise HTTPException(status_code=400, detail="expected_option_id must be a positive integer")
        if rule.next_question_id is not None and rule.next_question_id <= 0:
            raise HTTPException(status_code=400, detail="next_question_id must be a positive integer when provided")
