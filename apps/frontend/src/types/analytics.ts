export interface AnalyticsSummary {
  total_accidents: number;
  average_casualties: number;
  average_vehicles: number;
  total_casualties: number;
  total_vehicles: number;
}

export interface SeverityStats {
  severity: string;
  count: number;
  percentage: number;
}

export interface RoadTypeStats {
  road_type: string;
  count: number;
  percentage: number;
}

export interface WeatherStats {
  weather_condition: string;
  count: number;
  percentage: number;
}

export interface LocationStats {
  longitude: number;
  latitude: number;
  count: number;
  location_name?: string;
}

export interface DateRange {
  startDate?: string;
  endDate?: string;
}
