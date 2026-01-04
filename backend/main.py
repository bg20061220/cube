from fastapi import FastAPI , Depends , HTTPException , status 
from sqlalchemy.orm import Session
from sqlalchemy  import DateTime , func 
import datetime 
from typing import List , Optional 
from collections import defaultdict 
import models , schemas , crud , database
from database import Base , engine 
Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI()

app.add_middleware(
    CORSMiddleware , 
    allow_origins = ["*"],
    allow_credentials = False,
    allow_methods = ["*"],
    allow_headers = ["*"],
)


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(db: Session = Depends(get_db)):
    return db.query(models.User).first()  # always returns the first user

def add_to_group(group , key , value) : 
    if value is None or value.strip() == "" : 
        return 
    group.setdefault(value , []).append(key)
@app.post("/forms/", response_model=schemas.FormRead)
def create_form_endpoint(form: schemas.FormCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    db_form = crud.create_form(db, form.title, form.context_options, user.id)
    return schemas.FormRead(
        id = db_form.id , 
        title = db_form.title ,
        context_options= db_form.context_options.split(",") if db_form.context_options else [],
        user_id = db_form.user_id 
    )


@app.get("/forms/public/{form_id}" , response_model = schemas.FormRead)
def get_public_form(form_id : int  , db: Session = Depends(get_db)):
    form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not form : 
        raise HTTPException(status_code = 404 , detail = "Form not found")
    return schemas.FormRead(
        id = form.id , 
        title = form.title , 
        context_options = form.context_options.split(",") if form.context_options else [])
    

@app.get("/my/forms/", response_model=List[schemas.FormRead])
def get_forms_endpoint(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    forms = crud.get_forms_for_user(db, user.id)   
    if not forms : 
        return [] 
    return [
        schemas.FormRead(
            id=f.id,
            title=f.title,
            context_options=f.context_options.split(",") if f.context_options else [],
            user_id=f.user_id
        )
        for f in forms
    ]


@app.post("/responses/", response_model=schemas.ResponseRead)
def create_response_endpoint(response: schemas.ResponseCreate, db: Session = Depends(get_db)):
    db_response = crud.create_response(db , response)
    return db_response 

@app.get("/responses/", response_model=List[schemas.ResponseRead])
def get_responses_endpoint(
    form_id: int = int,  # form_id is required
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)  # ensure user is logged in
):
    
    # Fetch responses for that form
    responses = crud.get_responses(db, form_id)
    return responses

@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = crud.create_user(db, user.email, user.password)
    return {"id": new_user.id, "email": new_user.email}

@app.post("/login")
def login(user : schemas.UserLogin , db : Session = Depends(get_db)):
    db_user = crud.authenticate_user(db , user.email , user.password)
    if not db_user : 
        raise HTTPException(status_code = 401 , detail = " Invalid credentials")
    
    print("User Logged in ")
    print("Email : " , user.email )
    return {"id" : db_user.id , "email" : db_user.email}

@app.post("/forgot-password")
def forgot_password(request: schemas.PasswordResetRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, request.email)
    if not user:
        # Don't reveal existence of email
        return {"msg": "If an account exists, a reset link has been sent"}
    
    token = crud.secrets.token_hex(32)
    expires = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    crud.set_reset_token(db, user, token, expires)

    # TODO: send email with reset link containing `token`
    print(f"Reset link: https://yourfrontend.com/reset-password?token={token}")
    
    return {"msg": "If an account exists, a reset link has been sent"}

@app.post("/reset-password")
def reset_password_endpoint(data: schemas.PasswordReset, db: Session = Depends(get_db)):
    user = crud.reset_password(db, data.token, data.new_password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    return {"msg": "Password reset successfully"}

@app.get("/analytics/{form_id}")
def get_form_analytics(
    form_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    # Fetch form and check ownership
    form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    if form.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    responses = (
        db.query(models.Response)
        .filter(
            models.Response.form_id == form_id,
        )
        .all()
    )

    by_severity = {}
    by_category = {}
    by_context = {}

    for r in responses:
        if r.severity and r.severity != "none":
            by_severity.setdefault(r.severity, []).append(r.text)

        if r.category and r.category != "none":
            by_category.setdefault(r.category, []).append(r.text)

        if r.context and r.context != "none":
            by_context.setdefault(r.context, []).append(r.text)

    return {
        "total_responses": len(responses),
        "by_severity": by_severity,
        "by_category": by_category,
        "by_context": by_context,
    }