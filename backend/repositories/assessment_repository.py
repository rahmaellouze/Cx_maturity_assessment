from typing import Any
from db import get_db_cursor

DEFAULT_COMPANY_NAME = "Pending profile"


def _normalize_profile_value(value: str | None) -> str | None:
    if value is None:
        return None
    cleaned = value.strip()
    return cleaned or None


def create_assessment(
    company_name: str | None,
    respondent_name: str | None,
    respondent_email: str | None,
    respondent_role_title: str | None,
    sector: str | None = None,
) -> int:
    query = """
        INSERT INTO assessments (
            company_name,
            respondent_name,
            respondent_email,
            respondent_role_title,
            sector,
            status
        )
        VALUES (%s, %s, %s, %s, %s, 'in_progress')
    """

    normalized_company_name = _normalize_profile_value(company_name) or DEFAULT_COMPANY_NAME
    normalized_respondent_name = _normalize_profile_value(respondent_name)
    normalized_respondent_email = _normalize_profile_value(respondent_email)
    normalized_respondent_role_title = _normalize_profile_value(respondent_role_title)
    normalized_sector = _normalize_profile_value(sector)

    with get_db_cursor(dictionary=False) as (_, cursor):
        cursor.execute(
            query,
            (
                normalized_company_name,
                normalized_respondent_name,
                normalized_respondent_email,
                normalized_respondent_role_title,
                normalized_sector,
            ),
        )
        return int(cursor.lastrowid)


def update_assessment_profile(
    assessment_id: int,
    company_name: str | None,
    respondent_name: str | None,
    respondent_email: str | None,
    respondent_role_title: str | None,
    sector: str | None,
) -> None:
    query = """
        UPDATE assessments
        SET company_name = %s,
            respondent_name = %s,
            respondent_email = %s,
            respondent_role_title = %s,
            sector = %s
        WHERE id = %s
    """

    normalized_company_name = _normalize_profile_value(company_name) or DEFAULT_COMPANY_NAME
    normalized_respondent_name = _normalize_profile_value(respondent_name)
    normalized_respondent_email = _normalize_profile_value(respondent_email)
    normalized_respondent_role_title = _normalize_profile_value(respondent_role_title)
    normalized_sector = _normalize_profile_value(sector)

    with get_db_cursor(dictionary=False) as (_, cursor):
        cursor.execute(
            query,
            (
                normalized_company_name,
                normalized_respondent_name,
                normalized_respondent_email,
                normalized_respondent_role_title,
                normalized_sector,
                assessment_id,
            ),
        )


def get_assessment_by_id(assessment_id: int) -> dict[str, Any] | None:
    query = """
        SELECT
            id,
            company_name,
            respondent_name,
            respondent_email,
            respondent_role_title,
            sector,
            status,
            overall_score,
            maturity_level,
            started_at,
            completed_at
        FROM assessments
        WHERE id = %s
        LIMIT 1
    """

    with get_db_cursor(dictionary=True) as (_, cursor):
        cursor.execute(query, (assessment_id,))
        row = cursor.fetchone()

    if row and row.get("overall_score") is not None:
        row["overall_score"] = float(row["overall_score"])

    return row