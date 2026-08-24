import {
  abandonApplication,
  acceptAlternativeOffer,
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
  Application,
  ApplicationListFilters,
  CreateApplicationPayload,
  HttpActor,
  UpdateApplicationPayload,
} from "@/types/application";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Seeds the query cache directly instead of just invalidating, to skip the loading flash on the next step.
function useSyncApplicationQueries() {
  const queryClient = useQueryClient();

  return (application: Application) => {
    queryClient.setQueryData(["application", application.id], application);
    queryClient.invalidateQueries({ queryKey: ["applications"] });
    queryClient.invalidateQueries({
      queryKey: ["application-events", application.id],
    });
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
    enabled: Boolean(id),
  });
}

export function useFetchApplicationEvents(id: string) {
  return useQuery({
    queryKey: ["application-events", id],
    queryFn: () => getApplicationEvents(id),
  });
}

export function useCreateApplication() {
  const sync = useSyncApplicationQueries();

  return useMutation({
    mutationKey: ["create-application"],
    mutationFn: (payload: CreateApplicationPayload) =>
      createApplication(payload),
    onSuccess: ({ application }) => sync(application),
  });
}

export function useUpdateApplication() {
  const sync = useSyncApplicationQueries();

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
    onSuccess: (application) => sync(application),
  });
}

export function useSubmitApplicationForReview() {
  const sync = useSyncApplicationQueries();

  return useMutation({
    mutationKey: ["submit-application-for-review"],
    mutationFn: (id: string) => submitApplicationForReview(id),
    onSuccess: (application) => sync(application),
  });
}

export function useSimulateOffer() {
  const sync = useSyncApplicationQueries();

  return useMutation({
    mutationKey: ["simulate-offer"],
    mutationFn: (id: string) => simulateOffer(id),
    onSuccess: (application) => sync(application),
  });
}

export function useAcceptAlternativeOffer() {
  const sync = useSyncApplicationQueries();

  return useMutation({
    mutationKey: ["accept-alternative-offer"],
    mutationFn: (id: string) => acceptAlternativeOffer(id),
    onSuccess: (application) => sync(application),
  });
}

export function useFinalizeApplication() {
  const sync = useSyncApplicationQueries();

  return useMutation({
    mutationKey: ["finalize-application"],
    mutationFn: ({ id, actor }: { id: string; actor: HttpActor }) =>
      finalizeApplication(id, actor),
    onSuccess: (application) => sync(application),
  });
}

export function useAbandonApplication() {
  const sync = useSyncApplicationQueries();

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
    onSuccess: (application) => sync(application),
  });
}
