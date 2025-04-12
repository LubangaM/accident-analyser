import { AccidentSchema } from "../types/accident";
import { z } from "zod";

export const validateAccident = (data: unknown) => {
  try {
    return AccidentSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      };
    }
    throw error;
  }
};

export const validateTimeRange = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return false;
  }

  return startDate <= endDate;
};
