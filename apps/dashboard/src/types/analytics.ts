export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface AnalyticsSummary {
  total_accidents: number;
  total_casualties: number;
  total_vehicles: number;
  average_casualties: number;
  average_vehicles: number;
}

export interface SeverityStats {
  severity: string;
  count: number;
}

export interface RoadTypeStats {
  road_type: string;
  count: number;
  percentage: number;
}

export interface WeatherStats {
  weather_condition: string;
  count: number;
}

export interface LocationStats {
  longitude: number;
  latitude: number;
  count: number;
}
