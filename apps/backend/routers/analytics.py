from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, desc
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from .. import models, schemas
from ..database import get_db

router = APIRouter()


@router.get("/summary", response_model=schemas.AnalyticsSummary)
def get_analytics_summary(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    query = db.query(
        func.count(models.Accident.id).label("total_accidents"),
        func.avg(models.Accident.number_of_casualties).label("average_casualties"),
        func.avg(models.Accident.number_of_vehicles).label("average_vehicles"),
        func.sum(models.Accident.number_of_casualties).label("total_casualties"),
        func.sum(models.Accident.number_of_vehicles).label("total_vehicles"),
    )

    if start_date:
        query = query.filter(models.Accident.date >= start_date)
    if end_date:
        query = query.filter(models.Accident.date <= end_date)

    result = query.first()
    return schemas.AnalyticsSummary(
        total_accidents=result.total_accidents,
        average_casualties=float(result.average_casualties or 0),
        average_vehicles=float(result.average_vehicles or 0),
        total_casualties=result.total_casualties or 0,
        total_vehicles=result.total_vehicles or 0,
    )


@router.get("/by-severity", response_model=List[schemas.SeverityStats])
def get_accidents_by_severity(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    query = db.query(
        models.Accident.accident_severity, func.count(models.Accident.id).label("count")
    ).group_by(models.Accident.accident_severity)

    if start_date:
        query = query.filter(models.Accident.date >= start_date)
    if end_date:
        query = query.filter(models.Accident.date <= end_date)

    total = query.with_entities(func.count(models.Accident.id)).scalar() or 1
    results = query.all()

    return [
        schemas.SeverityStats(
            severity=severity, count=count, percentage=(count / total) * 100
        )
        for severity, count in results
    ]


@router.get("/by-road-type", response_model=List[schemas.RoadTypeStats])
def get_accidents_by_road_type(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    query = db.query(
        models.Accident.road_type, func.count(models.Accident.id).label("count")
    ).group_by(models.Accident.road_type)

    if start_date:
        query = query.filter(models.Accident.date >= start_date)
    if end_date:
        query = query.filter(models.Accident.date <= end_date)

    total = query.with_entities(func.count(models.Accident.id)).scalar() or 1
    results = query.all()

    return [
        schemas.RoadTypeStats(
            road_type=road_type, count=count, percentage=(count / total) * 100
        )
        for road_type, count in results
    ]


@router.get("/by-weather", response_model=List[schemas.WeatherStats])
def get_accidents_by_weather(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    query = db.query(
        models.Accident.weather_conditions,
        func.count(models.Accident.id).label("count"),
    ).group_by(models.Accident.weather_conditions)

    if start_date:
        query = query.filter(models.Accident.date >= start_date)
    if end_date:
        query = query.filter(models.Accident.date <= end_date)

    total = query.with_entities(func.count(models.Accident.id)).scalar() or 1
    results = query.all()

    return [
        schemas.WeatherStats(
            weather_condition=weather, count=count, percentage=(count / total) * 100
        )
        for weather, count in results
    ]


@router.get("/top-locations", response_model=List[schemas.LocationStats])
def get_top_locations(
    limit: int = 10,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    query = (
        db.query(
            models.Accident.longitude,
            models.Accident.latitude,
            func.count(models.Accident.id).label("count"),
        )
        .group_by(models.Accident.longitude, models.Accident.latitude)
        .order_by(desc("count"))
        .limit(limit)
    )

    if start_date:
        query = query.filter(models.Accident.date >= start_date)
    if end_date:
        query = query.filter(models.Accident.date <= end_date)

    results = query.all()

    return [
        schemas.LocationStats(longitude=longitude, latitude=latitude, count=count)
        for longitude, latitude, count in results
    ]
