import { apiClient } from "@/lib/http-client";
import { delay } from "@/lib/utils";
import { ENDPOINTS } from "@/routes/endpoints";
import type {
  AdvisorSessionPayload,
  AdvisorSessionResponse,
} from "@/types/advisor";

export async function login(payload: AdvisorSessionPayload) {
  await delay(500);

  const { data } = await apiClient.post<AdvisorSessionResponse>(
    ENDPOINTS.ADVISOR_AUTH.LOGIN,
    payload,
  );

  return data;
}

export async function refresh(refreshToken: string) {
  await delay(500);

  const { data } = await apiClient.post<AdvisorSessionResponse>(
    ENDPOINTS.ADVISOR_AUTH.REFRESH,
    { refreshToken },
  );

  return data;
}

export async function logout() {
  await delay(500);

  const { data } = await apiClient.post<{ message: string }>(
    ENDPOINTS.ADVISOR_AUTH.LOGOUT,
  );

  return data;
}
