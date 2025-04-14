export interface Accident {
  id: number;
  location_easting?: number | null;
  location_northing?: number | null;
  longitude?: number | null;
  latitude?: number | null;
  police_force?: string | null;
  accident_severity: string;
  number_of_vehicles?: number | null;
  number_of_casualties?: number | null;
  date: string;
  day_of_week?: number | null;
  time?: string | null;
  local_authority_district?: string | null;
  local_authority_highway?: string | null;
  first_road_class?: string | null;
  first_road_number?: string | null;
  road_type?: string | null;
  speed_limit?: number | null;
  junction_control?: string | null;
  second_road_class?: string | null;
  second_road_number?: string | null;
  pedestrian_crossing_human_control?: string | null;
  pedestrian_crossing_physical_facilities?: string | null;
  light_conditions?: string | null;
  weather_conditions?: string | null;
  road_surface_conditions?: string | null;
  special_conditions_at_site?: string | null;
  carriageway_hazards?: string | null;
  urban_or_rural_area?: string | null;
  did_police_officer_attend?: string | null;
  lsoa_of_accident_location?: string | null;
  year?: number | null;
}

export type AccidentCreate = Omit<Accident, "id">;

export type AccidentUpdate = Partial<AccidentCreate>;
