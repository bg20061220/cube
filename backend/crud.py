from sqlalchemy.orm import Session 
import models , schemas 

def create_form(db: Session, form: schemas.FormCreate):
    context_csv = ",".join(form.context_options or [])
    db_form = models.Form(title=form.title, context_options=context_csv)
    db.add(db_form)
    db.commit()
    db.refresh(db_form)
    return db_form


def get_forms(db: Session):
    return db.query(models.Form).all()



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
