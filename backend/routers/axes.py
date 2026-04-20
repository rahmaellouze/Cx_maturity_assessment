from fastapi import APIRouter, HTTPException
from repositories.axis_repository import (
    create_axis,
    delete_axis,
    get_all_axes,
    get_axis_by_id,
    toggle_axis_status,
    update_axis,
)
from schemas.axis import AxisCreate, AxisCreateResponse, AxisOut, AxisUpdate

router = APIRouter(prefix="/axes", tags=["axes"])

@router.get("", response_model=list[AxisOut])
def get_axes_route():
    try:
        return get_all_axes()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{axis_id}", response_model=AxisOut)
def get_axis_route(axis_id: int):
    try:
        axis = get_axis_by_id(axis_id)
        if not axis:
            raise HTTPException(status_code=404, detail="Axis not found")
        return axis
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=AxisCreateResponse)
def create_axis_route(payload: AxisCreate):
    try:
        axis_id = create_axis(payload)
        return AxisCreateResponse(axis_id=axis_id, message="Axis created successfully")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{axis_id}")
def update_axis_route(axis_id: int, payload: AxisUpdate):
    try:
        updated = update_axis(axis_id, payload)
        if not updated:
            raise HTTPException(status_code=404, detail="Axis not found")
        return {"message": "Axis updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{axis_id}/toggle")
def toggle_axis_route(axis_id: int):
    try:
        updated = toggle_axis_status(axis_id)
        if not updated:
            raise HTTPException(status_code=404, detail="Axis not found")
        return {"message": "Axis status updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{axis_id}")
def delete_axis_route(axis_id: int):
    try:
        deleted = delete_axis(axis_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Axis not found")
        return {"message": "Axis deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
