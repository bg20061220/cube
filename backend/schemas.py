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

class UserCreate(BaseModel):
    email : str 
    password : str 

class UserLogin(BaseModel):
    email : str 
    password : str 

class PasswordResetRequest(BaseModel):
    email : str 

class PasswordReset(BaseModel):
    token : str 
    new_password : str 