from sqlalchemy.orm import Session 
from sqlalchemy  import DateTime 
import datetime 
from typing import List , Optional 

import models , schemas 
from models import User 
import bcrypt 


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
def create_user(db: Session , email:str , password:str) : 
    password_hash = hash_password(password)
    user = User(email=email , password_hash = password_hash)
    db.add(user)
    db.commit() 
    db.refresh(user)
    return user 

def get_user_by_email(db:Session , email:str):
    return db.query(User).filter(User.email== email).first()

def authenticate_user(db:Session , email:str,  password: str):
    user = get_user_by_email(db , email)
    if not user : 
        return None 
    if verify_password ( password , user.password_hash):
        return user 
    return None 

def set_reset_token(db:Session , user: User , token : str , expires): 
    user.reset_token = token 
    user.reset_expires = expires
    db.commit() 
    db.refresh() 
    return user 

def reset_password(db: Session, token: str, new_password: str):
    user = db.query(User).filter(
        User.reset_token == token,
        User.reset_expires > datetime.datetime.utcnow()
    ).first()
    if not user:
        return None
    user.password_hash = hash_password(new_password)
    user.reset_token = None
    user.reset_expires = None
    db.commit()
    db.refresh(user)
    return user


def create_form(db: Session, title: str, context_options: List[str], user_id: int):
    db_form = models.Form(
        title=title,
        context_options=",".join(context_options),
        user_id=user_id  # attach user
    )
    db.add(db_form)
    db.commit()
    db.refresh(db_form)
    return db_form

def get_forms_for_user(db: Session, user_id: int):
    return db.query(models.Form).filter(models.Form.user_id == user_id).all()




def create_response(db: Session, response: schemas.ResponseCreate):
    db_response = models.Response(
        form_id=response.form_id,
        text=response.text,
        category=response.category,
        context=response.context,
        severity=response.severity
    )  
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response

def get_responses(db: Session, form_id: int = None):
   return db.query(models.Response).filter(models.Response.form_id == form_id).all()

