from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from models import Accident
from schemas import (
    Accident as AccidentSchema,
    AccidentCreate,
    AccidentUpdate,
)
from database import get_db

router = APIRouter()


@router.get("/accidents", response_model=List[AccidentSchema])
def get_accidents(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(
        get_db,
    ),
):
    accidents = db.query(Accident).offset(skip).limit(limit).all()
    return accidents


@router.get("/accidents/{accident_id}", response_model=AccidentSchema)
def get_accident(
    accident_id: int,
    db: Session = Depends(
        get_db,
    ),
):
    accident = db.query(Accident).filter(Accident.id == accident_id).first()
    if accident is None:
        raise HTTPException(status_code=404, detail="Accident not found")
    return accident


@router.post("/accidents", response_model=AccidentSchema)
def create_accident(
    accident: AccidentCreate,
    db: Session = Depends(
        get_db,
    ),
):
    db_accident = Accident(**accident.model_dump())
    db.add(db_accident)
    db.commit()
    db.refresh(db_accident)
    return db_accident


@router.put("/accidents/{accident_id}", response_model=AccidentSchema)
def update_accident(
    accident_id: int,
    accident: AccidentUpdate,
    db: Session = Depends(
        get_db,
    ),
):
    db_accident = db.query(Accident).filter(Accident.id == accident_id).first()
    if db_accident is None:
        raise HTTPException(status_code=404, detail="Accident not found")

    for field, value in accident.model_dump(exclude_unset=True).items():
        setattr(db_accident, field, value)

    db.commit()
    db.refresh(db_accident)
    return db_accident


@router.delete("/accidents/{accident_id}")
def delete_accident(
    accident_id: int,
    db: Session = Depends(
        get_db,
    ),
):
    db_accident = db.query(Accident).filter(Accident.id == accident_id).first()
    if db_accident is None:
        raise HTTPException(status_code=404, detail="Accident not found")

    db.delete(db_accident)
    db.commit()
    return {"message": "Accident deleted successfully"}
