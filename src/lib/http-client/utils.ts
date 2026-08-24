import { observability } from "../observability/logger";
import { ApiError } from "./api-error";
import type {
  ApiClientOptions,
  ApiResponse,
  HttpMethod,
  Params,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Builds the final request URL, appending query params when present.
export function buildUrl(endpoint: string, params?: Params): string {
  if (!params) return `${BASE_URL}${endpoint}`;

  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value != null) qs.set(key, String(value));
  }
  const queryString = qs.toString();
  return queryString
    ? `${BASE_URL}${endpoint}?${queryString}`
    : `${BASE_URL}${endpoint}`;
}

// Waits for the MSW browser worker to be intercepting requests before the first fetch.
// No-ops on the server (no window) and when mocking is explicitly disabled.
export async function ensureMockingReady(): Promise<void> {
  if (typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_API_MOCKING === "disabled") return;

  const { startMocking } = await import("@/mocks/browser");
  await startMocking();
}

// Reads a response body as JSON, tolerating empty or non-JSON bodies.
async function safeParseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

// Builds the outgoing Headers: content type (when there's a body) + tracing headers.
export function buildRequestHeaders({
  headers: customHeaders,
  correlationId,
  actor,
  hasBody,
}: Pick<ApiClientOptions, "headers" | "correlationId" | "actor"> & {
  hasBody: boolean;
}): Headers {
  const headers = new Headers(customHeaders);

  if (hasBody) headers.set("Content-Type", "application/json");
  if (correlationId) headers.set("X-Correlation-Id", correlationId);
  if (actor) headers.set("X-Actor", actor);

  return headers;
}

// Combines the timeout with the caller's own AbortSignal, if any.
export function buildRequestSignal(
  timeoutMs: number,
  callerSignal?: AbortSignal,
): AbortSignal {
  return callerSignal
    ? AbortSignal.any([AbortSignal.timeout(timeoutMs), callerSignal])
    : AbortSignal.timeout(timeoutMs);
}

// Runs fetch, translating network/timeout failures into ApiError.
export async function executeFetch(
  url: string,
  init: RequestInit,
  callerSignal?: AbortSignal,
): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (error) {
    if (init.signal?.aborted) {
      const isCallerAbort = callerSignal?.aborted === true;
      throw new ApiError(
        isCallerAbort
          ? "Solicitud cancelada"
          : "La solicitud tardó demasiado en responder",
        0,
        undefined,
        isCallerAbort ? "network" : "timeout",
      );
    }
    throw new ApiError(
      "Error de conexión con el servidor",
      0,
      error,
      "network",
    );
  }
}

// Reads a successful response body, or throws ApiError for non-2xx responses.
export async function parseResponseBody<T>(
  response: Response,
): Promise<ApiResponse<T>> {
  if (response.status === 204) {
    return { data: {} as T, status: response.status };
  }

  const responseData = await safeParseJson(response);

  if (!response.ok) {
    const err = responseData as Record<string, string> | undefined;
    throw new ApiError(
      err?.message ?? err?.error ?? "Error en la petición",
      response.status,
      responseData,
      "http",
    );
  }

  return { data: responseData as T, status: response.status };
}

// Logs one HTTP call's outcome (success or failure) for observability.
export function logOutcome(
  method: HttpMethod,
  endpoint: string,
  correlationId: string | undefined,
  startedAt: number,
  status?: number,
  error?: unknown,
): void {
  observability.logHttpCall({
    method,
    endpoint,
    correlationId,
    status,
    durationMs: performance.now() - startedAt,
    error:
      error instanceof ApiError
        ? error.message
        : error !== undefined
          ? String(error)
          : undefined,
  });
}
