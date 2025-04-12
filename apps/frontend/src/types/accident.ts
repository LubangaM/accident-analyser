export interface Accident {
  id: number;
  accident_index: string;
  location_easting?: number;
  location_northing?: number;
  longitude?: number;
  latitude?: number;
  police_force?: string;
  accident_severity: string;
  number_of_vehicles?: number;
  number_of_casualties?: number;
  date: string;
  day_of_week?: number;
  time?: string;
  local_authority_district?: string;
  local_authority_highway?: string;
  first_road_class?: string;
  first_road_number?: string;
  road_type?: string;
  speed_limit?: number;
  junction_control?: string;
  second_road_class?: string;
  second_road_number?: string;
  pedestrian_crossing_human_control?: string;
  pedestrian_crossing_physical_facilities?: string;
  light_conditions?: string;
  weather_conditions?: string;
  road_surface_conditions?: string;
  special_conditions_at_site?: string;
  carriageway_hazards?: string;
  urban_or_rural_area?: string;
  did_police_officer_attend?: string;
  lsoa_of_accident_location?: string;
  year?: number;
}

export interface AccidentCreate extends Omit<Accident, "id"> {}

export interface AccidentUpdate extends Partial<AccidentCreate> {}
