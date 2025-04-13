from pydantic import BaseModel, field_validator, field_serializer, EmailStr
from typing import Optional, List
from datetime import time, datetime


class AccidentBase(BaseModel):
    location_easting: Optional[float] = None
    location_northing: Optional[float] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    police_force: Optional[str] = None
    accident_severity: str
    number_of_vehicles: Optional[int] = None
    number_of_casualties: Optional[int] = None
    date: str
    day_of_week: Optional[int] = None
    time: Optional[str] = None
    local_authority_district: Optional[str] = None
    local_authority_highway: Optional[str] = None
    first_road_class: Optional[str] = None
    first_road_number: Optional[str] = None
    road_type: Optional[str] = None
    speed_limit: Optional[int] = None
    junction_control: Optional[str] = None
    second_road_class: Optional[str] = None
    second_road_number: Optional[str] = None
    pedestrian_crossing_human_control: Optional[str] = None
    pedestrian_crossing_physical_facilities: Optional[str] = None
    light_conditions: Optional[str] = None
    weather_conditions: Optional[str] = None
    road_surface_conditions: Optional[str] = None
    special_conditions_at_site: Optional[str] = None
    carriageway_hazards: Optional[str] = None
    urban_or_rural_area: Optional[str] = None
    did_police_officer_attend: Optional[str] = None
    lsoa_of_accident_location: Optional[str] = None
    year: Optional[int] = None

    @field_validator("time")
    def validate_time(cls, v):
        if v is None or v == "":
            return None
        if isinstance(v, str):
            try:
                return time.fromisoformat(v)
            except ValueError:
                return None
        return v

    @field_serializer("time")
    def serialize_time(self, time_value: Optional[str], _info):
        if time_value is None:
            return None
        return time_value


class AccidentCreate(AccidentBase):
    time: Optional[str] = None


class AccidentUpdate(AccidentBase):
    accident_severity: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None


class Accident(AccidentBase):
    id: int
    time: Optional[str] = None

    class Config:
        from_attributes = True


class AnalyticsSummary(BaseModel):
    total_accidents: int
    average_casualties: float
    average_vehicles: float
    total_casualties: int
    total_vehicles: int


class SeverityStats(BaseModel):
    severity: str
    count: int
    percentage: float


class RoadTypeStats(BaseModel):
    road_type: str
    count: int
    percentage: float


class WeatherStats(BaseModel):
    weather_condition: str
    count: int
    percentage: float


class LocationStats(BaseModel):
    longitude: float
    latitude: float
    count: int
    location_name: Optional[str] = None


class DateRangeFilter(BaseModel):
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class AnalyticsResponse(BaseModel):
    summary: AnalyticsSummary
    by_severity: List[SeverityStats]
    by_road_type: List[RoadTypeStats]
    by_weather: List[WeatherStats]
    top_locations: List[LocationStats]


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
