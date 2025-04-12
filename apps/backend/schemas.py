from pydantic import BaseModel
from datetime import date, time
from typing import Optional, List, Dict


class AccidentBase(BaseModel):
    accident_index: str
    location_easting: Optional[float] = None
    location_northing: Optional[float] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    police_force: Optional[str] = None
    accident_severity: str
    number_of_vehicles: Optional[int] = None
    number_of_casualties: Optional[int] = None
    date: date
    day_of_week: Optional[int] = None
    time: Optional[time] = None
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


class AccidentCreate(AccidentBase):
    pass


class AccidentUpdate(AccidentBase):
    accident_index: Optional[str] = None
    accident_severity: Optional[str] = None
    date: Optional[date] = None


class Accident(AccidentBase):
    id: int

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
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class AnalyticsResponse(BaseModel):
    summary: AnalyticsSummary
    by_severity: List[SeverityStats]
    by_road_type: List[RoadTypeStats]
    by_weather: List[WeatherStats]
    top_locations: List[LocationStats]
