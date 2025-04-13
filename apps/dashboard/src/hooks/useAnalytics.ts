import { useQuery } from "@tanstack/react-query";
import {
  AnalyticsSummary,
  DateRange,
  LocationStats,
  RoadTypeStats,
  SeverityStats,
  WeatherStats,
} from "../types/analytics";
import { apiClient } from "../api/client";
export function useAnalyticsSummary(dateRange: DateRange) {
  return useQuery<AnalyticsSummary>({
    queryKey: ["analytics", "summary", dateRange],
    queryFn: async () => {
      const response = await apiClient.get("/analytics/summary", {
        params: dateRange,
      });
      return response.data;
    },
  });
}

export function useSeverityStats(dateRange: DateRange) {
  return useQuery<SeverityStats[]>({
    queryKey: ["analytics", "severity", dateRange],
    queryFn: async () => {
      const response = await apiClient.get("/analytics/by-severity", {
        params: dateRange,
      });
      return response.data;
    },
  });
}

export function useRoadTypeStats(dateRange: DateRange) {
  return useQuery<RoadTypeStats[]>({
    queryKey: ["analytics", "road-type", dateRange],
    queryFn: async () => {
      const response = await apiClient.get("/analytics/by-road-type", {
        params: dateRange,
      });
      return response.data;
    },
  });
}

export function useWeatherStats(dateRange: DateRange) {
  return useQuery<WeatherStats[]>({
    queryKey: ["analytics", "weather", dateRange],
    queryFn: async () => {
      const response = await apiClient.get("/analytics/by-weather", {
        params: dateRange,
      });
      return response.data;
    },
  });
}

export function useTopLocations(dateRange: DateRange) {
  return useQuery<LocationStats[]>({
    queryKey: ["analytics", "locations", dateRange],
    queryFn: async () => {
      const response = await apiClient.get("/analytics/top-locations", {
        params: dateRange,
      });
      return response.data;
    },
  });
}
