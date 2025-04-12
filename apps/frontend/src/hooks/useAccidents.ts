import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { Accident, AccidentCreate, AccidentUpdate } from "../types/accident";

export const useAccidents = () => {
  return useQuery({
    queryKey: ["accidents"],
    queryFn: async () => {
      const { data } = await apiClient.get<Accident[]>("/accidents");
      return data;
    },
  });
};

export const useAccident = (id: number) => {
  return useQuery({
    queryKey: ["accidents", id],
    queryFn: async () => {
      const { data } = await apiClient.get<Accident>(`/accidents/${id}`);
      return data;
    },
  });
};

export const useCreateAccident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accident: AccidentCreate) => {
      const { data } = await apiClient.post<Accident>("/accidents", accident);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accidents"] });
    },
  });
};

export const useUpdateAccident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...accident
    }: AccidentUpdate & { id: number }) => {
      const { data } = await apiClient.put<Accident>(
        `/accidents/${id}`,
        accident
      );
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["accidents"] });
      queryClient.invalidateQueries({ queryKey: ["accidents", id] });
    },
  });
};

export const useDeleteAccident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/accidents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accidents"] });
    },
  });
};
