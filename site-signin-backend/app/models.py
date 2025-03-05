from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class Worker(Base):
    __tablename__ = "workers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    employee_id = Column(String, unique=True, nullable=False)

class SignInLog(Base):
    __tablename__ = "signin_logs"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("workers.id"))
    timestamp = Column(DateTime, default=func.now())
    status = Column(String, nullable=False)  # "IN" or "OUT"
