from pydantic import BaseModel
from typing import Optional

class AxisBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

class AxisCreate(AxisBase):
    pass

class AxisUpdate(AxisBase):
    pass

class AxisOut(AxisBase):
    id: int

class AxisCreateResponse(BaseModel):
    axis_id: int
    message: str
