import { z } from "zod";

export const AccidentSeverity = z.enum(["Fatal", "Serious", "Slight"]);
export type AccidentSeverity = z.infer<typeof AccidentSeverity>;

export const RoadType = z.enum(["Motorway", "A-Road", "B-Road", "Minor Road"]);
export type RoadType = z.infer<typeof RoadType>;

export const WeatherCondition = z.enum([
  "Clear",
  "Rain",
  "Snow",
  "Fog",
  "Other",
]);
export type WeatherCondition = z.infer<typeof WeatherCondition>;

export const AccidentSchema = z.object({
  id: z.string().uuid().optional(),
  date: z.string().datetime(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string(),
  }),
  severity: AccidentSeverity,
  roadType: RoadType,
  weather: WeatherCondition,
  description: z.string(),
  casualties: z.number().min(0),
  vehiclesInvolved: z.number().min(1),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Accident = z.infer<typeof AccidentSchema>;
