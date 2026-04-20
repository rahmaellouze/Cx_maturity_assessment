from typing import Any
from db import get_db_cursor
from schemas.axis import AxisCreate, AxisUpdate


def _normalize_axis_row(row: dict[str, Any]) -> dict[str, Any]:
    row["is_active"] = bool(row["is_active"])
    return row


def get_all_axes() -> list[dict[str, Any]]:
    query = """
        SELECT id, name, code, description, display_order, is_active
        FROM axes
        ORDER BY display_order ASC, id ASC
    """
    with get_db_cursor(dictionary=True) as (_, cursor):
        cursor.execute(query)
        return [_normalize_axis_row(row) for row in cursor.fetchall()]


def get_axis_by_id(axis_id: int) -> dict[str, Any] | None:
    query = """
        SELECT id, name, code, description, display_order, is_active
        FROM axes
        WHERE id = %s
        LIMIT 1
    """
    with get_db_cursor(dictionary=True) as (_, cursor):
        cursor.execute(query, (axis_id,))
        row = cursor.fetchone()
    return _normalize_axis_row(row) if row else None


def create_axis(payload: AxisCreate) -> int:
    query = """
        INSERT INTO axes (name, code, description, display_order, is_active)
        VALUES (%s, %s, %s, %s, %s)
    """
    with get_db_cursor(dictionary=False) as (_, cursor):
        cursor.execute(query, (payload.name, payload.code, payload.description, payload.display_order, payload.is_active))
        return int(cursor.lastrowid)


def update_axis(axis_id: int, payload: AxisUpdate) -> bool:
    query = """
        UPDATE axes
        SET name = %s, code = %s, description = %s, display_order = %s, is_active = %s
        WHERE id = %s
    """
    with get_db_cursor(dictionary=False) as (_, cursor):
        cursor.execute(query, (payload.name, payload.code, payload.description, payload.display_order, payload.is_active, axis_id))
        return cursor.rowcount > 0


def toggle_axis_status(axis_id: int) -> bool:
    with get_db_cursor(dictionary=False) as (_, cursor):
        cursor.execute("UPDATE axes SET is_active = NOT is_active WHERE id = %s", (axis_id,))
        return cursor.rowcount > 0


def delete_axis(axis_id: int) -> bool:
    with get_db_cursor(dictionary=False) as (_, cursor):
        cursor.execute("DELETE FROM axes WHERE id = %s", (axis_id,))
        return cursor.rowcount > 0
