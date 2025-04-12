import { AccidentSeverity, RoadType, WeatherCondition } from "./accident";

export interface AnalyticsSummary {
  totalAccidents: number;
  totalCasualties: number;
  averageVehiclesPerAccident: number;
  accidentsBySeverity: Record<AccidentSeverity, number>;
  accidentsByRoadType: Record<RoadType, number>;
  accidentsByWeather: Record<WeatherCondition, number>;
}

export interface TimeRange {
  start: string;
  end: string;
}

export interface LocationAnalytics {
  latitude: number;
  longitude: number;
  address: string;
  accidentCount: number;
  severity: AccidentSeverity;
}

export interface AnalyticsFilters {
  timeRange?: TimeRange;
  severity?: AccidentSeverity;
  roadType?: RoadType;
  weather?: WeatherCondition;
}
