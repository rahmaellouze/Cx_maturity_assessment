import json
from pathlib import Path
from typing import Any

from db import get_db_cursor
from schemas.assessment import AssessmentAnswerSubmit, AssessmentResultsOut, AssessmentSubmitResponse

FRAMEWORK_PATH = Path(__file__).resolve().parents[1] / "data" / "framework.json"


def _load_framework_config() -> dict[str, Any]:
    return json.loads(FRAMEWORK_PATH.read_text(encoding="utf-8"))


def _to_float(value: Any) -> float | None:
    return None if value is None else float(value)


def _to_iso(value: Any) -> str | None:
    if value is None:
        return None
    return value.isoformat() if hasattr(value, "isoformat") else str(value)


def _score_to_band(score_percent: float | None) -> str | None:
    if score_percent is None:
        return None
    if score_percent < 40:
        return "Low"
    if score_percent < 75:
        return "Medium"
    return "High"


def _overall_maturity(axis_scores: list[dict[str, Any]]) -> str | None:
    vals = [i["score_percent"] for i in axis_scores if i.get("score_percent") is not None]
    if not vals:
        return None
    return _score_to_band(sum(vals) / len(vals))


def _active_options(question: dict[str, Any]) -> list[dict[str, Any]]:
    return [o for o in question.get("options", []) if o.get("is_active")]


def _active_rules(question: dict[str, Any]) -> list[dict[str, Any]]:
    return [r for r in question.get("display_rules", []) if r.get("is_active")]


def _selected_option_scores(question: dict[str, Any], answer: AssessmentAnswerSubmit | None) -> tuple[float | None, float | None]:
    if answer is None:
        return None, None
    options = _active_options(question)
    by_id = {o["id"]: o for o in options}
    strategy = question.get("scoring_strategy")
    if question.get("answer_type") == "single_select":
        if answer.selected_option_id is None:
            return None, None
        opt = by_id.get(answer.selected_option_id)
        if opt is None:
            raise ValueError(f"Invalid option for question {question['id']}")
        max_score = max((_to_float(i.get("score")) or 0 for i in options), default=0)
        return _to_float(opt.get("score")), max_score
    if question.get("answer_type") == "multi_select":
        ids = list(dict.fromkeys(answer.selected_option_ids or []))
        if not ids:
            return None, None
        scores: list[float] = []
        for option_id in ids:
            opt = by_id.get(option_id)
            if opt is None:
                raise ValueError(f"Invalid option for question {question['id']}")
            s = _to_float(opt.get("score"))
            if s is not None:
                scores.append(s)
        if not scores:
            return None, None
        if strategy == "multi_sum":
            score = sum(scores)
            max_score = sum(max(_to_float(o.get("score")) or 0, 0) for o in options)
        elif strategy == "multi_average":
            score = sum(scores) / len(scores)
            max_score = max((_to_float(o.get("score")) or 0 for o in options), default=0)
        else:
            score = max(scores)
            max_score = max((_to_float(o.get("score")) or 0 for o in options), default=0)
        return score, max_score
    return None, None


def _has_answer(question: dict[str, Any], answer: AssessmentAnswerSubmit | None) -> bool:
    if answer is None:
        return False
    if question["answer_type"] == "single_select":
        return answer.selected_option_id is not None
    if question["answer_type"] == "multi_select":
        return len(answer.selected_option_ids) > 0
    return bool((answer.answer_text or "").strip())


def _is_rule_satisfied(rule: dict[str, Any], questions_by_id: dict[int, dict[str, Any]], answers_by_question: dict[int, AssessmentAnswerSubmit]) -> bool:
    return True

def _is_question_visible(question: dict[str, Any], questions_by_id: dict[int, dict[str, Any]], answers_by_question: dict[int, AssessmentAnswerSubmit]) -> bool:
    return True

def _fetch_assessment(cursor: Any, assessment_id: int) -> dict[str, Any] | None:
    cursor.execute(
        """
        SELECT id, company_name, respondent_name, respondent_email, respondent_role_title,
               status, overall_score, maturity_level
        FROM assessments
        WHERE id = %s
        LIMIT 1
        """,
        (assessment_id,),
    )
    row = cursor.fetchone()
    if row and row.get("overall_score") is not None:
        row["overall_score"] = float(row["overall_score"])
    return row


def _load_axes(cursor: Any) -> list[dict[str, Any]]:
    cursor.execute(
        """
        SELECT id, name, code, description, display_order, is_active
        FROM axes
        WHERE is_active = 1
        ORDER BY display_order ASC, id ASC
        """
    )
    rows = cursor.fetchall()
    for row in rows:
        row["is_active"] = bool(row["is_active"])
    return rows


def _load_questions(cursor: Any) -> list[dict[str, Any]]:
    cursor.execute(
        """
        SELECT id, axis_id, question_code, question_text, helper_text, answer_type,
               is_mandatory, is_scored, scoring_strategy, weight, display_order, is_active
        FROM questions
        WHERE is_active = 1
        ORDER BY axis_id ASC, display_order ASC, id ASC
        """
    )
    questions = cursor.fetchall()
    if not questions:
        return []
    ids = [q["id"] for q in questions]
    ph = ",".join(["%s"] * len(ids))
    cursor.execute(
        f"""
        SELECT id, question_id, option_label, option_value, option_code, score, maturity_level, display_order, is_active
        FROM question_answer_options
        WHERE question_id IN ({ph})
        ORDER BY question_id ASC, display_order ASC, id ASC
        """,
        tuple(ids),
    )
    options = cursor.fetchall()
    cursor.execute(
        f"""
        SELECT id, question_id, expected_option_id, next_question_id, transition_text, display_order, is_active
        FROM question_display_rules
        WHERE question_id IN ({ph})
        ORDER BY question_id ASC, id ASC
        """,
        tuple(ids),
    )
    rules = cursor.fetchall()
    opts_by_q: dict[int, list[dict[str, Any]]] = {}
    for opt in options:
        opt["is_active"] = bool(opt["is_active"])
        if opt.get("score") is not None:
            opt["score"] = float(opt["score"])
        opts_by_q.setdefault(opt["question_id"], []).append(opt)
    rules_by_q: dict[int, list[dict[str, Any]]] = {}
    for rule in rules:
        rule["is_active"] = bool(rule["is_active"] )
        rules_by_q.setdefault(rule["question_id"], []).append(rule)
    for q in questions:
        q["is_mandatory"] = bool(q["is_mandatory"])
        q["is_scored"] = bool(q["is_scored"])
        q["is_active"] = bool(q["is_active"])
        if q.get("weight") is not None:
            q["weight"] = float(q["weight"])
        q["options"] = opts_by_q.get(q["id"], [])
        q["display_rules"] = rules_by_q.get(q["id"], [])
    return questions


def _persist_answers(cursor: Any, assessment_id: int, questions_by_id: dict[int, dict[str, Any]], answers_by_question: dict[int, AssessmentAnswerSubmit]) -> None:
    cursor.execute("DELETE FROM assessment_answer_selected_options WHERE assessment_answer_id IN (SELECT id FROM assessment_answers WHERE assessment_id = %s)", (assessment_id,))
    cursor.execute("DELETE FROM assessment_answers WHERE assessment_id = %s", (assessment_id,))
    for question_id, answer in answers_by_question.items():
        question = questions_by_id.get(question_id)
        if question is None:
            continue
        score, _ = _selected_option_scores(question, answer)
        selected_option_id = answer.selected_option_id if question["answer_type"] == "single_select" else None
        cursor.execute(
            """
            INSERT INTO assessment_answers (assessment_id, question_id, selected_option_id, answer_text, numeric_score, answered_at)
            VALUES (%s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
            """,
            (assessment_id, question_id, selected_option_id, answer.answer_text, score),
        )
        answer_id = int(cursor.lastrowid)
        if question["answer_type"] == "multi_select":
            for option_id in list(dict.fromkeys(answer.selected_option_ids or [])):
                cursor.execute(
                    "INSERT INTO assessment_answer_selected_options (assessment_answer_id, question_option_id) VALUES (%s, %s)",
                    (answer_id, option_id),
                )


def _axis_summary_for_score(axis_name: str, raw_score: float | None, cfg: dict[str, Any]) -> dict[str, Any] | None:
    if raw_score is None:
        return None
    entries = cfg.get("axis_recommendations", {}).get(axis_name, [])
    for entry in entries:
        parts = [p.strip() for p in (entry.get("actual_score_range") or "").split("-")]
        if len(parts) != 2:
            continue
        try:
            start = float(parts[0])
            end = float(parts[1])
        except ValueError:
            continue
        if start <= raw_score <= end:
            return entry
    return None


def _build_recommendations(questions: list[dict[str, Any]], axes_by_id: dict[int, dict[str, Any]], answers_by_question: dict[int, AssessmentAnswerSubmit], cfg: dict[str, Any], axis_scores: list[dict[str, Any]]) -> list[dict[str, Any]]:
    recs: list[dict[str, Any]] = []
    detail_lookup: dict[tuple[str, str], dict[str, Any]] = {}
    for entry in cfg.get("answer_recommendations", []):
        detail_lookup[(entry["question_id"], entry["selected_answer"])] = entry
    for question in questions:
        answer = answers_by_question.get(question["id"])
        if answer is None or question["answer_type"] != "single_select" or answer.selected_option_id is None:
            continue
        selected_option = next((o for o in question["options"] if o["id"] == answer.selected_option_id), None)
        if not selected_option:
            continue
        detail = detail_lookup.get((question["question_code"], selected_option["option_label"]))
        if not detail:
            continue
        axis = axes_by_id[question["axis_id"]]
        recs.append({
            "axis_id": axis["id"],
            "axis_name": axis["name"],
            "question_id": question["id"],
            "question_code": question["question_code"],
            "recommendation_type": "answer_detail",
            "recommendation_title": detail["what_this_suggests"],
            "recommendation_text": detail["detailed_recommendation"],
            "priority_level": detail["priority"],
            "source_theme_type": "answer_detail",
        })
    for axis_score in axis_scores:
        summary = _axis_summary_for_score(axis_score["axis_name"], axis_score["raw_score"], cfg)
        if not summary:
            continue
        recs.append({
            "axis_id": axis_score["axis_id"],
            "axis_name": axis_score["axis_name"],
            "question_id": None,
            "question_code": None,
            "recommendation_type": "axis_summary",
            "recommendation_title": f"{axis_score['axis_name']}: {summary['level']}",
            "recommendation_text": summary["recommendations"],
            "priority_level": "High" if summary["level"] == "Low" else ("Medium" if summary["level"] == "Medium" else "Maintain"),
            "source_theme_type": summary["level"].lower(),
        })
    return recs


def _store_axis_scores(cursor: Any, assessment_id: int, axis_scores: list[dict[str, Any]]) -> None:
    cursor.execute("DELETE FROM assessment_axis_scores WHERE assessment_id = %s", (assessment_id,))
    for item in axis_scores:
        cursor.execute(
            """
            INSERT INTO assessment_axis_scores (assessment_id, axis_id, raw_score, max_score, score_percent, maturity_band, calculation_details)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (assessment_id, item["axis_id"], item["raw_score"], item["max_score"], item["score_percent"], item["maturity_band"], item["calculation_details"]),
        )


def _store_recommendations(cursor: Any, assessment_id: int, recommendations: list[dict[str, Any]]) -> None:
    cursor.execute("DELETE FROM assessment_recommendations WHERE assessment_id = %s", (assessment_id,))
    for item in recommendations:
        cursor.execute(
            """
            INSERT INTO assessment_recommendations (assessment_id, axis_id, question_id, recommendation_type, recommendation_title, recommendation_text, priority_level, source_theme_type)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (assessment_id, item["axis_id"], item.get("question_id"), item["recommendation_type"], item["recommendation_title"], item["recommendation_text"], item["priority_level"], item["source_theme_type"]),
        )


def submit_assessment_answers(assessment_id: int, answers: list[AssessmentAnswerSubmit]) -> AssessmentSubmitResponse:
    answers_by_question = {a.question_id: a for a in answers}
    cfg = _load_framework_config()
    with get_db_cursor(dictionary=True) as (_, cursor):
        assessment = _fetch_assessment(cursor, assessment_id)
        if not assessment:
            raise ValueError("Assessment not found")
        axes = _load_axes(cursor)
        questions = _load_questions(cursor)
        if not questions:
            raise ValueError("No active questions found. Seed the new framework first.")
        questions_by_id = {q["id"]: q for q in questions}
        axes_by_id = {a["id"]: a for a in axes}
        
        # Handle profiling questions - update assessment record
        profiling_updates = {}
        for question in questions:
            if question["axis_id"] == 4 and question["question_code"] in ["P1", "P2", "P3", "P4"]:  # Profile axis
                answer = answers_by_question.get(question["id"])
                if answer and answer.answer_text:
                    if question["question_code"] == "P1":
                        profiling_updates["company_name"] = answer.answer_text
                    elif question["question_code"] == "P2":
                        profiling_updates["respondent_name"] = answer.answer_text
                    elif question["question_code"] == "P3":
                        profiling_updates["respondent_email"] = answer.answer_text
                    elif question["question_code"] == "P4":
                        profiling_updates["respondent_role_title"] = answer.answer_text
        
        if profiling_updates:
            update_fields = []
            update_values = []
            for field, value in profiling_updates.items():
                update_fields.append(f"{field} = %s")
                update_values.append(value)
            update_values.append(assessment_id)
            cursor.execute(
                f"UPDATE assessments SET {', '.join(update_fields)} WHERE id = %s",
                update_values
            )
        
        visible_questions = [q for q in questions if _is_question_visible(q, questions_by_id, answers_by_question)]
        missing_required = [q["question_text"] for q in visible_questions if q["is_mandatory"] and not _has_answer(q, answers_by_question.get(q["id"]))]
        if missing_required:
            raise ValueError(f"Missing required answers for: {', '.join(missing_required[:3])}")
        _persist_answers(cursor, assessment_id, questions_by_id, answers_by_question)
        axis_scores: list[dict[str, Any]] = []
        for axis in axes:
            axis_questions = [q for q in visible_questions if q["axis_id"] == axis["id"] and q["is_scored"]]
            raw_score = 0.0
            max_score = 0.0
            for q in axis_questions:
                score, qmax = _selected_option_scores(q, answers_by_question.get(q["id"]))
                if score is not None:
                    raw_score += score
                if qmax is not None:
                    max_score += qmax
            score_percent = round((raw_score / max_score) * 100, 2) if max_score > 0 else None
            axis_scores.append({
                "axis_id": axis["id"],
                "axis_name": axis["name"],
                "raw_score": round(raw_score, 2) if max_score > 0 else None,
                "max_score": round(max_score, 2) if max_score > 0 else None,
                "score_percent": score_percent,
                "maturity_band": _score_to_band(score_percent),
                "calculation_details": f"{round(raw_score,2)} / {round(max_score,2)}" if max_score > 0 else None,
            })
        valid_scores = [i["score_percent"] for i in axis_scores if i["score_percent"] is not None]
        overall_score = round(sum(valid_scores) / len(valid_scores), 2) if valid_scores else None
        maturity_level = _overall_maturity(axis_scores)
        cursor.execute(
            "UPDATE assessments SET overall_score = %s, maturity_level = %s, status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = %s",
            (overall_score, maturity_level, assessment_id),
        )
        _store_axis_scores(cursor, assessment_id, axis_scores)
        recommendations = _build_recommendations(questions, axes_by_id, answers_by_question, cfg, axis_scores)
        _store_recommendations(cursor, assessment_id, recommendations)
        return AssessmentSubmitResponse(assessment_id=assessment_id, overall_score=overall_score, maturity_level=maturity_level, axis_scores=axis_scores, recommendations=recommendations)


def get_assessment_results(assessment_id: int) -> AssessmentResultsOut:
    cfg = _load_framework_config()
    with get_db_cursor(dictionary=True) as (_, cursor):
        assessment = _fetch_assessment(cursor, assessment_id)
        if not assessment:
            raise ValueError("Assessment not found")
        cursor.execute(
            """
            SELECT aas.axis_id, ax.name AS axis_name, ax.code, aas.raw_score, aas.max_score, aas.score_percent, aas.maturity_band
            FROM assessment_axis_scores aas
            JOIN axes ax ON ax.id = aas.axis_id
            WHERE aas.assessment_id = %s
            ORDER BY ax.display_order ASC, ax.id ASC
            """,
            (assessment_id,),
        )
        axis_scores = cursor.fetchall()
        for row in axis_scores:
            row["raw_score"] = _to_float(row.get("raw_score"))
            row["max_score"] = _to_float(row.get("max_score"))
            row["score_percent"] = _to_float(row.get("score_percent"))
        cursor.execute(
            """
            SELECT aa.id AS assessment_answer_id, q.id AS question_id, q.question_code, q.question_text, q.axis_id, ax.name AS axis_name,
                   q.answer_type, q.is_mandatory, q.is_scored, q.scoring_strategy, aa.selected_option_id,
                   qo.option_label AS selected_option_label, qo.option_value AS selected_option_value,
                   aa.answer_text, aa.numeric_score, aa.answered_at
            FROM assessment_answers aa
            JOIN questions q ON q.id = aa.question_id
            JOIN axes ax ON ax.id = q.axis_id
            LEFT JOIN question_answer_options qo ON qo.id = aa.selected_option_id
            WHERE aa.assessment_id = %s
            ORDER BY ax.display_order ASC, q.display_order ASC, q.id ASC
            """,
            (assessment_id,),
        )
        answer_rows = cursor.fetchall()
        for row in answer_rows:
            row["is_mandatory"] = bool(row["is_mandatory"])
            row["is_scored"] = bool(row["is_scored"])
            row["numeric_score"] = _to_float(row.get("numeric_score"))
            row["answered_at"] = _to_iso(row.get("answered_at"))
            row["selected_options"] = []
        if answer_rows:
            ids = [r["assessment_answer_id"] for r in answer_rows]
            ph = ",".join(["%s"] * len(ids))
            cursor.execute(
                f"""
                SELECT aaso.assessment_answer_id, qo.id AS option_id, qo.option_label, qo.option_value, qo.score
                FROM assessment_answer_selected_options aaso
                JOIN question_answer_options qo ON qo.id = aaso.question_option_id
                WHERE aaso.assessment_answer_id IN ({ph})
                ORDER BY aaso.assessment_answer_id ASC, qo.display_order ASC, qo.id ASC
                """,
                tuple(ids),
            )
            selected_rows = cursor.fetchall()
            by_answer: dict[int, list[dict[str, Any]]] = {}
            for item in selected_rows:
                by_answer.setdefault(item["assessment_answer_id"], []).append({
                    "option_id": item["option_id"],
                    "option_label": item["option_label"],
                    "option_value": item["option_value"],
                    "score": _to_float(item.get("score")),
                })
            for row in answer_rows:
                row["selected_options"] = by_answer.get(row["assessment_answer_id"], [])
        cursor.execute(
            """
            SELECT ar.axis_id, ax.name AS axis_name, ar.question_id, q.question_code, ar.recommendation_type, ar.recommendation_title,
                   ar.recommendation_text, ar.priority_level, ar.source_theme_type
            FROM assessment_recommendations ar
            JOIN axes ax ON ax.id = ar.axis_id
            LEFT JOIN questions q ON q.id = ar.question_id
            WHERE ar.assessment_id = %s
            ORDER BY ax.display_order ASC, ar.id ASC
            """,
            (assessment_id,),
        )
        recommendations = cursor.fetchall()
        answers_by_axis: dict[int, list[dict[str, Any]]] = {}
        for row in answer_rows:
            answers_by_axis.setdefault(row["axis_id"], []).append(row)
        recs_by_axis: dict[int, list[dict[str, Any]]] = {}
        for rec in recommendations:
            recs_by_axis.setdefault(rec["axis_id"], []).append(rec)
        axes_out = []
        for axis_score in axis_scores:
            summary = _axis_summary_for_score(axis_score["axis_name"], axis_score["raw_score"], cfg)
            axes_out.append({
                "axis_id": axis_score["axis_id"],
                "code": axis_score["code"],
                "name": axis_score["axis_name"],
                "score_percent": axis_score["score_percent"],
                "raw_score": axis_score["raw_score"],
                "max_score": axis_score["max_score"],
                "maturity_band": axis_score["maturity_band"],
                "description": summary["description"] if summary else None,
                "priority_actions": summary["recommendations"] if summary else None,
                "answers": answers_by_axis.get(axis_score["axis_id"], []),
                "recommendations": recs_by_axis.get(axis_score["axis_id"], []),
            })
        return AssessmentResultsOut(
            assessment_id=assessment["id"],
            company_name=assessment.get("company_name"),
            respondent_name=assessment.get("respondent_name"),
            respondent_email=assessment.get("respondent_email"),
            respondent_role_title=assessment.get("respondent_role_title"),
            status=assessment.get("status"),
            overall_score=assessment.get("overall_score"),
            maturity_level=assessment.get("maturity_level"),
            axes=axes_out,
            recommendations=recommendations,
        )
