import json
import os
import urllib.request
from typing import Any, Dict, List

MISTRAL_API_KEY = os.environ.get("MISTRAL_API_KEY")
MISTRAL_MODEL = os.environ.get("MISTRAL_MODEL", "mistral-7b-instruct")
MISTRAL_API_BASE_URL = os.environ.get(
    "MISTRAL_API_BASE_URL",
    f"https://api.mistral.ai/v1/models/{MISTRAL_MODEL}/generate",
)


def _truncate(text: str, max_chars: int = 220) -> str:
    if not text:
        return ""
    return text if len(text) <= max_chars else text[:max_chars].rstrip() + "..."


def _build_option_list(options: List[Dict[str, Any]]) -> List[str]:
    lines: List[str] = []
    for option in options:
        label = option.get("option_label") or option.get("option_value") or ""
        if label:
            lines.append(f"- {label}")
    return lines


def build_assistant_prompt(question: Dict[str, Any]) -> str:
    question_text = _truncate(question.get("question_text", ""), max_chars=240)
    helper_text = _truncate(question.get("helper_text") or "", max_chars=140)
    context_text = _truncate(question.get("context_text") or "", max_chars=180)
    answer_type = question.get("answer_type", "text_area")
    options = question.get("options", []) or []
    assessment_context = question.get("assessment_context") or {}

    lines: List[str] = [
        "You are a concise CX assessment guide.",
        "Rewrite the question below as a friendly, conversational prompt.",
        "Keep it short, use natural language, and preserve the original meaning.",
        "If answer options are available, include them briefly.",
        "",
        f"Question: {question_text}",
    ]

    if helper_text:
        lines.append(f"Note: {helper_text}")

    if context_text:
        lines.append(f"Context: {context_text}")

    if assessment_context.get("company_name"):
        lines.append(f"Assessment company: {assessment_context['company_name']}")

    lines.append(f"Answer type: {answer_type}")

    if options:
        lines.append("Options:")
        lines.extend(_build_option_list(options))

    lines.append("")
    lines.append("Return only the assistant prompt text. No extra commentary.")

    return "\n".join(lines)


def _short_answer(answer: str | None) -> str:
    if not answer or not answer.strip():
        return "No answer provided"
    return _truncate(answer.strip(), max_chars=180)


def _build_answer_block(answers: List[Dict[str, Any]], label: str) -> str:
    lines: List[str] = [f"{label}:"]
    for answer in answers[:10]:
        question_code = answer.get("question_code") or "Question"
        question_text = _truncate(answer.get("question_text", ""), max_chars=160)
        selected_labels = answer.get("selected_option_labels", []) or []
        answer_text = _short_answer(answer.get("answer_text"))

        lines.append(f"- {question_code}: {question_text}")
        if selected_labels:
            lines.append(f"  Answer: {', '.join(selected_labels)}")
        elif answer_text:
            lines.append(f"  Answer: {answer_text}")
    return "\n".join(lines)


def build_results_prompt(payload: Dict[str, Any]) -> str:
    lines: List[str] = [
        "You are a CX benchmarking advisor.",
        "Based on the assessment summary below, provide:",
        "1. A concise benchmark statement.",
        "2. Two main strengths.",
        "3. Two improvement opportunities.",
        "4. One practical recommendation with a placeholder link.",
        "",
    ]

    if payload.get("company_name"):
        lines.append(f"Company: {payload['company_name']}")
    if payload.get("respondent_name"):
        lines.append(f"Respondent: {payload['respondent_name']}")

    if payload.get("overall_score") is not None:
        lines.append(f"Overall score: {payload['overall_score']}")
    if payload.get("maturity_level"):
        lines.append(f"Maturity level: {payload['maturity_level']}")

    if payload.get("axes"):
        lines.append("\nAxis summaries:")
        for axis in payload["axes"][:5]:
            lines.append(
                f"- {axis.get('axis_name')} | Score: {axis.get('score_percent')} | Band: {axis.get('maturity_band')}"
            )

    if payload.get("profiling"):
        lines.append("\nProfiling insights:")
        lines.append(_build_answer_block(payload["profiling"], "Profiling answers"))

    if payload.get("answers"):
        lines.append("\nSelected assessment answers:")
        lines.append(_build_answer_block(payload["answers"], "Assessment answers"))

    lines.append("")
    lines.append(
        "Focus on relevance and brevity. Do not repeat raw data verbatim. Use the summary to create an actionable benchmark recommendation with a placeholder link such as https://example.com/cx-benchmark."
    )

    return "\n".join(lines)


def call_mistral(prompt: str) -> Dict[str, Any]:
    if not MISTRAL_API_KEY:
        raise EnvironmentError("MISTRAL_API_KEY is not set in the environment.")

    payload = {
        "model": MISTRAL_MODEL,
        "messages": [
            {
                "role": "user",
                "content": prompt,
            }
        ],
        "max_tokens": 180,
        "temperature": 0.55,
        "top_p": 0.9,
    }

    request = urllib.request.Request(
        MISTRAL_API_BASE_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
        },
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def parse_mistral_response(response_data: Dict[str, Any]) -> str:
    if not isinstance(response_data, dict):
        raise ValueError("Unexpected Mistral response format")

    if "choices" in response_data:
        choices = response_data["choices"]
        if isinstance(choices, list) and choices:
            first_choice = choices[0]
            if isinstance(first_choice, dict):
                message = first_choice.get("message")
                if isinstance(message, dict):
                    content = message.get("content")
                    if isinstance(content, str):
                        return content.strip()

    raise ValueError("Could not parse Mistral response")


def generate_assistant_question_text(question: Dict[str, Any]) -> str:
    prompt = build_assistant_prompt(question)
    response_data = call_mistral(prompt)
    return parse_mistral_response(response_data)


def generate_assistant_results_insights(payload: Dict[str, Any]) -> str:
    prompt = build_results_prompt(payload)
    response_data = call_mistral(prompt)
    return parse_mistral_response(response_data)


def build_question_formulation_prompt(question: Dict[str, Any], context: Dict[str, Any] = None) -> str:
    """Build prompt for natural language question formulation."""
    lines = [
        "You are a CX maturity assessment expert. Reformulate this assessment question in natural, conversational language.",
        "Make it engaging and easy to understand while preserving the original meaning and scoring intent.",
        "",
        "ORIGINAL QUESTION:",
        f"Code: {question.get('question_code', 'N/A')}",
        f"Text: {question.get('question_text', '')}",
        f"Helper: {question.get('helper_text', '')}",
        "",
        "OPTIONS:",
    ]

    options = question.get("options", [])
    for option in options[:4]:  # Limit to first 4 options for token efficiency
        lines.append(f"- {option.get('option_label', '')}")

    lines.append("")
    lines.append("CONTEXT:")
    if context:
        if context.get("company_name"):
            lines.append(f"Company: {context['company_name']}")
        if context.get("previous_answers"):
            lines.append("Previous answers in this assessment:")
            for prev in context["previous_answers"][-2:]:  # Last 2 answers for context
                lines.append(f"- {prev.get('question_code')}: {prev.get('answer_summary', '')}")

    lines.append("")
    lines.append("INSTRUCTIONS:")
    lines.append("- Reformulate in natural, conversational language")
    lines.append("- Keep it concise but engaging")
    lines.append("- Preserve the assessment intent")
    lines.append("- Make it feel like a natural conversation")
    lines.append("- Do not include the options in your response - just the question text")
    lines.append("")
    lines.append("Reformulated question:")

    return "\n".join(lines)


def build_transition_prompt(from_question: Dict[str, Any], to_question: Dict[str, Any],
                          user_answer: str, context: Dict[str, Any] = None) -> str:
    """Build prompt for contextual transition between questions."""
    lines = [
        "You are guiding someone through a CX maturity assessment.",
        "Write a short lead-in that will appear immediately before the next canonical question.",
        "Do not rewrite, paraphrase, quote, or preview the next question itself.",
        "The UI will render your lead-in and then the official question text below it.",
        "",
        "PREVIOUS QUESTION:",
        f"Code: {from_question.get('question_code', 'N/A')}",
        f"Topic: {_truncate(from_question.get('question_text', ''), 100)}",
        "",
        "USER'S ANSWER:",
        f"{user_answer}",
        "",
        "NEXT QUESTION:",
        f"Code: {to_question.get('question_code', 'N/A')}",
        f"Topic: {_truncate(to_question.get('question_text', ''), 100)}",
        "",
        "CONTEXT:",
    ]

    if context:
        if context.get("company_name"):
            lines.append(f"Company: {context['company_name']}")
        if context.get("assessment_progress"):
            lines.append(f"Assessment progress: {context['assessment_progress']}")

    lines.append("")
    lines.append("INSTRUCTIONS:")
    lines.append("- Return one short paragraph of 1 to 2 sentences")
    lines.append("- Keep it under 45 words")
    lines.append("- Acknowledge the answer without repeating it verbatim")
    lines.append("- Bridge naturally to the next topic")
    lines.append("- Keep the tone polished, clear, and consultant-like")
    lines.append("- Avoid bullets, labels, quotation marks, markdown, and emojis")
    lines.append("- End cleanly without a colon")
    lines.append("")
    lines.append("Lead-in text:")

    return "\n".join(lines)


def generate_question_formulation(question: Dict[str, Any], context: Dict[str, Any] = None) -> str:
    """Generate natural language formulation of a question."""
    prompt = build_question_formulation_prompt(question, context)
    response_data = call_mistral(prompt)
    return parse_mistral_response(response_data)


def generate_transition_text(from_question: Dict[str, Any], to_question: Dict[str, Any],
                           user_answer: str, context: Dict[str, Any] = None) -> str:
    """Generate contextual transition between questions."""
    prompt = build_transition_prompt(from_question, to_question, user_answer, context)
    response_data = call_mistral(prompt)
    return parse_mistral_response(response_data)

