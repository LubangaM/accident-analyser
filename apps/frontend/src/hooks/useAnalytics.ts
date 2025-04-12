import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { DateRange } from "../types/analytics";

export const useAnalyticsSummary = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ["analytics", "summary", dateRange],
    queryFn: async () => {
      const { data } = await apiClient.get("/analytics/summary", {
        params: {
          start_date: dateRange?.startDate,
          end_date: dateRange?.endDate,
        },
      });
      return data;
    },
  });
};

export const useSeverityStats = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ["analytics", "severity", dateRange],
    queryFn: async () => {
      const { data } = await apiClient.get("/analytics/by-severity", {
        params: {
          start_date: dateRange?.startDate,
          end_date: dateRange?.endDate,
        },
      });
      return data;
    },
  });
};

export const useRoadTypeStats = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ["analytics", "road-type", dateRange],
    queryFn: async () => {
      const { data } = await apiClient.get("/analytics/by-road-type", {
        params: {
          start_date: dateRange?.startDate,
          end_date: dateRange?.endDate,
        },
      });
      return data;
    },
  });
};

export const useWeatherStats = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ["analytics", "weather", dateRange],
    queryFn: async () => {
      const { data } = await apiClient.get("/analytics/by-weather", {
        params: {
          start_date: dateRange?.startDate,
          end_date: dateRange?.endDate,
        },
      });
      return data;
    },
  });
};

export const useTopLocations = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ["analytics", "locations", dateRange],
    queryFn: async () => {
      const { data } = await apiClient.get("/analytics/top-locations", {
        params: {
          start_date: dateRange?.startDate,
          end_date: dateRange?.endDate,
        },
      });
      return data;
    },
  });
};
