import {
  abandonApplication,
  createApplication,
  finalizeApplication,
  getApplication,
  getApplicationEvents,
  listApplications,
  simulateOffer,
  submitApplicationForReview,
  updateApplication,
} from "@/services/applications-service";
import type {
  AbandonApplicationPayload,
  ApplicationListFilters,
  CreateApplicationPayload,
  HttpActor,
  UpdateApplicationPayload,
} from "@/types/application";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useInvalidateApplicationQueries() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.invalidateQueries({ queryKey: ["applications"] });
    queryClient.invalidateQueries({ queryKey: ["application", id] });
    queryClient.invalidateQueries({ queryKey: ["application-events", id] });
  };
}

export function useFetchApplications(filters?: ApplicationListFilters) {
  return useQuery({
    queryKey: ["applications", filters],
    queryFn: () => listApplications(filters),
  });
}

export function useFetchApplicationById(id: string) {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplication(id),
  });
}

export function useFetchApplicationEvents(id: string) {
  return useQuery({
    queryKey: ["application-events", id],
    queryFn: () => getApplicationEvents(id),
  });
}

export function useCreateApplication() {
  const invalidate = useInvalidateApplicationQueries();

  return useMutation({
    mutationKey: ["create-application"],
    mutationFn: (payload: CreateApplicationPayload) =>
      createApplication(payload),
    onSuccess: ({ application }) => invalidate(application.id),
  });
}

export function useUpdateApplication() {
  const invalidate = useInvalidateApplicationQueries();

  return useMutation({
    mutationKey: ["update-application"],
    mutationFn: ({
      id,
      payload,
      actor,
    }: {
      id: string;
      payload: UpdateApplicationPayload;
      actor: HttpActor;
    }) => updateApplication(id, payload, actor),
    onSuccess: (_, { id }) => invalidate(id),
  });
}

export function useSubmitApplicationForReview() {
  const invalidate = useInvalidateApplicationQueries();

  return useMutation({
    mutationKey: ["submit-application-for-review"],
    mutationFn: (id: string) => submitApplicationForReview(id),
    onSuccess: (_, id) => invalidate(id),
  });
}

export function useSimulateOffer() {
  const invalidate = useInvalidateApplicationQueries();

  return useMutation({
    mutationKey: ["simulate-offer"],
    mutationFn: (id: string) => simulateOffer(id),
    onSuccess: (_, id) => invalidate(id),
  });
}

export function useFinalizeApplication() {
  const invalidate = useInvalidateApplicationQueries();

  return useMutation({
    mutationKey: ["finalize-application"],
    mutationFn: ({ id, actor }: { id: string; actor: HttpActor }) =>
      finalizeApplication(id, actor),
    onSuccess: (_, { id }) => invalidate(id),
  });
}

export function useAbandonApplication() {
  const invalidate = useInvalidateApplicationQueries();

  return useMutation({
    mutationKey: ["abandon-application"],
    mutationFn: ({
      id,
      payload,
      actor,
    }: {
      id: string;
      payload: AbandonApplicationPayload;
      actor: HttpActor;
    }) => abandonApplication(id, payload, actor),
    onSuccess: (_, { id }) => invalidate(id),
  });
}
