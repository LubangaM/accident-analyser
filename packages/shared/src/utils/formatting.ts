import { AccidentSeverity } from "../types/accident";

export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatSeverity = (severity: AccidentSeverity) => {
  const severityMap: Record<AccidentSeverity, string> = {
    Fatal: "Fatal",
    Serious: "Serious",
    Slight: "Slight",
  };
  return severityMap[severity];
};

export const formatLocation = (latitude: number, longitude: number) => {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-GB").format(num);
};
