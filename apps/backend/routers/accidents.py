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
            date=row["date"],
            time=row.get("time"),
            location_easting=row.get("location_easting"),
            location_northing=row.get("location_northing"),
            longitude=row.get("longitude"),
            latitude=row.get("latitude"),
            police_force=row.get("police_force"),
            accident_severity=row["accident_severity"],
            number_of_vehicles=row.get("number_of_vehicles"),
            number_of_casualties=row.get("number_of_casualties"),
            day_of_week=row.get("day_of_week"),
            local_authority_district=row.get("local_authority_district"),
            local_authority_highway=row.get("local_authority_highway"),
            first_road_class=row.get("first_road_class"),
            first_road_number=row.get("first_road_number"),
            road_type=row.get("road_type"),
            speed_limit=row.get("speed_limit"),
            junction_control=row.get("junction_control"),
            second_road_class=row.get("second_road_class"),
            second_road_number=row.get("second_road_number"),
            pedestrian_crossing_human_control=row.get(
                "pedestrian_crossing_human_control"
            ),
            pedestrian_crossing_physical_facilities=row.get(
                "pedestrian_crossing_physical_facilities"
            ),
            light_conditions=row.get("light_conditions"),
            weather_conditions=row.get("weather_conditions"),
            road_surface_conditions=row.get("road_surface_conditions"),
            special_conditions_at_site=row.get("special_conditions_at_site"),
            carriageway_hazards=row.get("carriageway_hazards"),
            urban_or_rural_area=row.get("urban_or_rural_area"),
            did_police_officer_attend=row.get("did_police_officer_attend"),
            lsoa_of_accident_location=row.get("lsoa_of_accident_location"),
            year=row.get("year"),
        )

        accidents.append(accident)

    db.add_all(accidents)
    db.commit()
    return {
        "message": "Accidents uploaded successfully",
        "count": len(
            accidents,
        ),
    }


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
