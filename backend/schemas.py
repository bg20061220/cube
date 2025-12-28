from pydantic import BaseModel
from typing import List , Optional 

# Form Schemas 
class FormCreate(BaseModel):
    title: str
    context_options: List[str] = []


class FormRead(BaseModel):
    id: int
    title: str
    context_options: List[str] = []

    class Config:
        orm_mode = True



# Response Schemas 

class ResponseCreate(BaseModel):
    form_id: int
    text: str
    category: str
    context: Optional[str] = None
    severity: Optional[str] = None

class ResponseRead(BaseModel):
    id: int
    form_id: int
    text: str
    category: str
    context: Optional[str]
    severity: Optional[str]

    class Config:
        orm_mode = True
