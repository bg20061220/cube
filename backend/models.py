from sqlalchemy  import Column, Integer, String, Text , ForeignKey , DateTime 
from sqlalchemy.orm import relationship 
from database import Base 
import datetime 

class Form(Base) :
    __tablename__ = "forms"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    context_options = Column(String , nullable=True)
    user_id  = Column(Integer , ForeignKey("users.id") , nullable =  False)
    responses = relationship("Response", backref = "form")

class Response(Base) :
    __tablename__ = "responses"

    id = Column(Integer, primary_key = True , index = True)
    form_id = Column(Integer, ForeignKey("forms.id"), nullable=False)
    text = Column(Text, nullable = False)
    category = Column(String , nullable = False)
    context = Column(String , nullable = True)
    severity = Column(String , nullable = True)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    reset_token = Column(String, nullable=True)
    reset_expires = Column(DateTime, nullable=True)

    forms = relationship("Form", backref="owner")

