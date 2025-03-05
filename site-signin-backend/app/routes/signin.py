from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import SignInLog, Worker
from datetime import datetime

router = APIRouter()

@router.post("/signin/{worker_id}")
def sign_in(worker_id: int, db: Session = Depends(get_db)):
    log = SignInLog(worker_id=worker_id, status="IN", timestamp=datetime.utcnow())
    db.add(log)
    db.commit()
    return {"message": "Sign-in recorded"}

@router.post("/signout/{worker_id}")
def sign_out(worker_id: int, db: Session = Depends(get_db)):
    log = SignInLog(worker_id=worker_id, status="OUT", timestamp=datetime.utcnow())
    db.add(log)
    db.commit()
    return {"message": "Sign-out recorded"}
