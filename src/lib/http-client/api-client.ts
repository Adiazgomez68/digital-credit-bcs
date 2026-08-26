import { ApiError } from "./api-error";
import type { ApiClientOptions, ApiResponse, HttpMethod } from "./types";
import {
  buildRequestHeaders,
  buildRequestSignal,
  buildUrl,
  ensureMockingReady,
  executeFetch,
  logOutcome,
  parseResponseBody,
} from "./utils";

const DEFAULT_TIMEOUT_MS = 15_000;

async function request<T>(
  endpoint: string,
  method: HttpMethod = "GET",
  options: ApiClientOptions = {},
): Promise<ApiResponse<T>> {
  const {
    data,
    params,
    headers: customHeaders,
    correlationId,
    actor,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    signal: callerSignal,
    ...restOptions
  } = options;

  const url = buildUrl(endpoint, params);
  const headers = buildRequestHeaders({
    headers: customHeaders,
    correlationId,
    actor,
    hasBody: data !== undefined,
  });
  const signal = buildRequestSignal(timeoutMs, callerSignal ?? undefined);
  const body = data !== undefined ? JSON.stringify(data) : undefined;

  const startedAt = performance.now();

  try {
    await ensureMockingReady();

    const response = await executeFetch(
      url,
      { ...restOptions, method, headers, body, signal },
      callerSignal ?? undefined,
    );
    const result = await parseResponseBody<T>(response);

    logOutcome(method, endpoint, correlationId, startedAt, result.status);

    return result;
  } catch (error) {
    const status = error instanceof ApiError ? error.status : undefined;
    logOutcome(method, endpoint, correlationId, startedAt, status, error);
    throw error;
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<ApiClientOptions, "data">) =>
    request<T>(endpoint, "GET", options),

  post: <T>(endpoint: string, data?: unknown, options?: ApiClientOptions) =>
    request<T>(endpoint, "POST", { ...options, data }),

  put: <T>(endpoint: string, data?: unknown, options?: ApiClientOptions) =>
    request<T>(endpoint, "PUT", { ...options, data }),

  patch: <T>(endpoint: string, data?: unknown, options?: ApiClientOptions) =>
    request<T>(endpoint, "PATCH", { ...options, data }),

  delete: <T>(endpoint: string, options?: Omit<ApiClientOptions, "data">) =>
    request<T>(endpoint, "DELETE", options),
};
