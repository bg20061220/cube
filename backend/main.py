from fastapi import FastAPI , Depends 
from sqlalchemy.orm import Session
import models , schemas , crud , database
models.Base.metadata.create_all(bind=database.engine)
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI()

app.add_middleware(
    CORSMiddleware , 
    allow_origins = ["*"],
    allow_credentials = True ,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/forms/", response_model=schemas.FormRead)
def create_form_endpoint(form: schemas.FormCreate, db: Session = Depends(get_db)):
    db_form = crud.create_form(db, form)
    
    # Convert context CSV to list
    context_list = db_form.context_options.split(",") if db_form.context_options else []

    # Create Pydantic response object
    response = schemas.FormRead(
        id=db_form.id,
        title=db_form.title,
        context_options=context_list
    )
    return response



@app.get("/forms/", response_model=list[schemas.FormRead])
def get_forms_endpoint(db: Session = Depends(get_db)):
    forms = crud.get_forms(db)
    response_list = []
    for f in forms:
        response_list.append(
            schemas.FormRead(
                id=f.id,
                title=f.title,
                context_options=f.context_options.split(",") if f.context_options else []
            )
        )
    return response_list


@app.post("/responses/", response_model=schemas.ResponseRead)
def create_response_endpoint(response: schemas.ResponseCreate, db: Session = Depends(get_db)):
    db_response = crud.create_response(db , response)
    return db_response 

@app.get("/responses/", response_model=list[schemas.ResponseRead])
def get_responses_endpoint(form_id: int = None, db: Session = Depends(get_db)):
    responses = crud.get_responses(db , form_id)
    return responses 


