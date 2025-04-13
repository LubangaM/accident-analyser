from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import pandas as pd
import io
from typing import List
from models import Accident
from schemas import (
    Accident as AccidentSchema,
    AccidentCreate,
    AccidentUpdate,
)
from database import get_db

router = APIRouter(prefix="/accidents")


@router.post("/upload")
async def upload_accidents(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Read the uploaded CSV file
    content = await file.read()
    df = pd.read_csv(io.StringIO(content.decode("utf-8")))

    # Create accidents from the CSV data
    accidents = []

    for index, row in df.iterrows():
        accident = Accident(
            id=row["id"],
            date=row["date"],
            time=row["time"],
            location=row["location"],
        )

        accidents.append(accident)

    db.add_all(accidents)
    db.commit()
    return {"message": "Accidents uploaded successfully"}


@router.get("/", response_model=List[AccidentSchema])
def get_accidents(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(
        get_db,
    ),
):
    accidents = db.query(Accident).offset(skip).limit(limit).all()
    return accidents


@router.get("/{accident_id}", response_model=AccidentSchema)
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


@router.post("/", response_model=AccidentSchema)
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


@router.put("/{accident_id}", response_model=AccidentSchema)
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


@router.delete("/{accident_id}")
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
