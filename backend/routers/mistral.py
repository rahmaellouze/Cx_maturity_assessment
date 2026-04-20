from fastapi import APIRouter, HTTPException
from repositories.question_repository import (
    generate_and_cache_transition,
    get_question_by_id,
)
from schemas.mistral import (
    QuestionLLMRequest,
    QuestionLLMResponse,
    ResultsLLMRequest,
    ResultsLLMResponse,
    TransitionLLMRequest,
    TransitionLLMResponse,
)
from services.mistral_service import (
    generate_assistant_question_text,
    generate_assistant_results_insights,
)

router = APIRouter(prefix="/llm", tags=["llm"])

@router.post("/question", response_model=QuestionLLMResponse)
def generate_question_route(payload: QuestionLLMRequest):
    try:
        assistant_text = generate_assistant_question_text(payload.dict())
        return QuestionLLMResponse(assistant_text=assistant_text)
    except EnvironmentError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/results", response_model=ResultsLLMResponse)
def generate_results_route(payload: ResultsLLMRequest):
    try:
        assistant_text = generate_assistant_results_insights(payload.dict())
        return ResultsLLMResponse(assistant_text=assistant_text)
    except EnvironmentError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/transition", response_model=TransitionLLMResponse)
def generate_transition_route(payload: TransitionLLMRequest):
    try:
        # Get the actual question objects
        from_question = get_question_by_id(payload.from_question_id)
        to_question = get_question_by_id(payload.to_question_id)

        if not from_question or not to_question:
            raise HTTPException(status_code=404, detail="One or both questions not found")

        # Generate and cache transition
        context = {"assessment_id": payload.assessment_id} if payload.assessment_id else None
        transition_text = generate_and_cache_transition(
            from_question, to_question, payload.user_answer, payload.assessment_id, context
        )

        if not transition_text:
            raise HTTPException(status_code=502, detail="Failed to generate transition")

        return TransitionLLMResponse(transition_text=transition_text)
    except HTTPException:
        raise
    except EnvironmentError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
