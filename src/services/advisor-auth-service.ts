import { apiClient } from "@/lib/http-client";
import { ENDPOINTS } from "@/routes/endpoints";
import type {
  AdvisorSessionPayload,
  AdvisorSessionResponse,
} from "@/types/advisor";

export async function login(payload: AdvisorSessionPayload) {
  const { data } = await apiClient.post<AdvisorSessionResponse>(
    ENDPOINTS.ADVISOR_AUTH.LOGIN,
    payload,
  );

  return data;
}

export async function refresh(refreshToken: string) {
  const { data } = await apiClient.post<AdvisorSessionResponse>(
    ENDPOINTS.ADVISOR_AUTH.REFRESH,
    { refreshToken },
  );

  return data;
}

export async function logout() {
  const { data } = await apiClient.post<{ message: string }>(
    ENDPOINTS.ADVISOR_AUTH.LOGOUT,
  );

  return data;
}
