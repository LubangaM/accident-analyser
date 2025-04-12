from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter()


@router.get("/accidents", response_model=List[schemas.Accident])
def get_accidents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    accidents = db.query(models.Accident).offset(skip).limit(limit).all()
    return accidents


@router.get("/accidents/{accident_id}", response_model=schemas.Accident)
def get_accident(accident_id: int, db: Session = Depends(get_db)):
    accident = (
        db.query(models.Accident).filter(models.Accident.id == accident_id).first()
    )
    if accident is None:
        raise HTTPException(status_code=404, detail="Accident not found")
    return accident


@router.post("/accidents", response_model=schemas.Accident)
def create_accident(accident: schemas.AccidentCreate, db: Session = Depends(get_db)):
    db_accident = models.Accident(**accident.model_dump())
    db.add(db_accident)
    db.commit()
    db.refresh(db_accident)
    return db_accident


@router.put("/accidents/{accident_id}", response_model=schemas.Accident)
def update_accident(
    accident_id: int, accident: schemas.AccidentUpdate, db: Session = Depends(get_db)
):
    db_accident = (
        db.query(models.Accident).filter(models.Accident.id == accident_id).first()
    )
    if db_accident is None:
        raise HTTPException(status_code=404, detail="Accident not found")

    for field, value in accident.model_dump(exclude_unset=True).items():
        setattr(db_accident, field, value)

    db.commit()
    db.refresh(db_accident)
    return db_accident


@router.delete("/accidents/{accident_id}")
def delete_accident(accident_id: int, db: Session = Depends(get_db)):
    db_accident = (
        db.query(models.Accident).filter(models.Accident.id == accident_id).first()
    )
    if db_accident is None:
        raise HTTPException(status_code=404, detail="Accident not found")

    db.delete(db_accident)
    db.commit()
    return {"message": "Accident deleted successfully"}
