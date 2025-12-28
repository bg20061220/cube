from sqlalchemy  import Column, Integer, String, Text , ForeignKey
from sqlalchemy.orm import relationship 
from database import Base 

class Form(Base) :
    __tablename__ = "forms"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    context_options = Column(String , nullable=True)
    responses = relationship("Response", backref = "form")

class Response(Base) :
    __tablename__ = "responses"

    id = Column(Integer, primary_key = True , index = True)
    form_id = Column(Integer, ForeignKey("forms.id"), nullable=False)
    text = Column(Text, nullable = False)
    category = Column(String , nullable = False)
    context = Column(String , nullable = True)
    severity = Column(String , nullable = True)


