import { apiClient, generateCorrelationId } from "@/lib/http-client";
import { delay } from "@/lib/utils";
import { ENDPOINTS } from "@/routes/endpoints";
import type {
  AbandonApplicationPayload,
  Application,
  ApplicationEvent,
  ApplicationListFilters,
  CreateApplicationPayload,
  HttpActor,
  UpdateApplicationPayload,
} from "@/types/application";

export async function createApplication(payload: CreateApplicationPayload) {
  await delay(500);

  const { data, status } = await apiClient.post<Application>(
    ENDPOINTS.APPLICATIONS.CREATE,
    payload,
    { correlationId: generateCorrelationId(), actor: "client" },
  );

  return { application: data, isExistingDraft: status === 200 };
}

export async function listApplications(filters?: ApplicationListFilters) {
  await delay(500);

  const { data } = await apiClient.get<Application[]>(
    ENDPOINTS.APPLICATIONS.LIST,
    { params: { ...filters } },
  );

  return data;
}

export async function getApplication(id: string) {
  await delay(500);

  const { data } = await apiClient.get<Application>(
    ENDPOINTS.APPLICATIONS.DETAIL(id),
  );

  return data;
}

export async function updateApplication(
  id: string,
  payload: UpdateApplicationPayload,
  actor: HttpActor,
) {
  await delay(500);

  const { data } = await apiClient.patch<Application>(
    ENDPOINTS.APPLICATIONS.UPDATE(id),
    payload,
    { correlationId: generateCorrelationId(), actor },
  );

  return data;
}

// Only the client can hand a solicitud off to the advisor for review.
export async function submitApplicationForReview(id: string) {
  await delay(500);

  const { data } = await apiClient.post<Application>(
    ENDPOINTS.APPLICATIONS.SUBMIT_FOR_REVIEW(id),
    undefined,
    { correlationId: generateCorrelationId(), actor: "client" },
  );

  return data;
}

export async function simulateOffer(id: string) {
  await delay(500);

  const { data } = await apiClient.post<Application>(
    ENDPOINTS.APPLICATIONS.SIMULATE_OFFER(id),
    undefined,
    { correlationId: generateCorrelationId(), actor: "client" },
  );

  return data;
}

export async function returnToDraft(id: string) {
  await delay(500);

  const { data } = await apiClient.post<Application>(
    ENDPOINTS.APPLICATIONS.RETURN_TO_DRAFT(id),
    undefined,
    { correlationId: generateCorrelationId(), actor: "client" },
  );

  return data;
}

export async function acceptAlternativeOffer(id: string) {
  await delay(500);

  const { data } = await apiClient.post<Application>(
    ENDPOINTS.APPLICATIONS.ACCEPT_ALTERNATIVE_OFFER(id),
    undefined,
    { correlationId: generateCorrelationId(), actor: "client" },
  );

  return data;
}

export async function finalizeApplication(id: string, actor: HttpActor) {
  await delay(500);

  const { data } = await apiClient.post<Application>(
    ENDPOINTS.APPLICATIONS.FINALIZE(id),
    undefined,
    { correlationId: generateCorrelationId(), actor },
  );

  return data;
}

export async function abandonApplication(
  id: string,
  payload: AbandonApplicationPayload,
  actor: HttpActor,
) {
  await delay(500);

  const { data } = await apiClient.post<Application>(
    ENDPOINTS.APPLICATIONS.ABANDON(id),
    payload,
    { correlationId: generateCorrelationId(), actor },
  );

  return data;
}

export async function getApplicationEvents(id: string) {
  await delay(500);

  const { data } = await apiClient.get<ApplicationEvent[]>(
    ENDPOINTS.APPLICATIONS.EVENTS(id),
  );

  return data;
}
