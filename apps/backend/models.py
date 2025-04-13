from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base


class Accident(Base):
    __tablename__ = "accidents"

    id = Column(Integer, primary_key=True, index=True)
    location_easting = Column(Float)
    location_northing = Column(Float)
    longitude = Column(Float)
    latitude = Column(Float)
    police_force = Column(String)
    accident_severity = Column(String, nullable=False)
    number_of_vehicles = Column(Integer)
    number_of_casualties = Column(Integer)
    date = Column(String, nullable=False)
    day_of_week = Column(Integer)
    time = Column(String, nullable=True)
    local_authority_district = Column(String)
    local_authority_highway = Column(String)
    first_road_class = Column(String)
    first_road_number = Column(String)
    road_type = Column(String)
    speed_limit = Column(Integer)
    junction_control = Column(String)
    second_road_class = Column(String)
    second_road_number = Column(String)
    pedestrian_crossing_human_control = Column(String)
    pedestrian_crossing_physical_facilities = Column(String)
    light_conditions = Column(String)
    weather_conditions = Column(String)
    road_surface_conditions = Column(String)
    special_conditions_at_site = Column(String)
    carriageway_hazards = Column(String)
    urban_or_rural_area = Column(String)
    did_police_officer_attend = Column(String)
    lsoa_of_accident_location = Column(String)
    year = Column(Integer)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
