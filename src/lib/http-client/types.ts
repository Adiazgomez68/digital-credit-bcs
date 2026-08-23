export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type Params = Record<
  string,
  string | number | boolean | null | undefined
>;

export interface ApiClientOptions extends Omit<RequestInit, "method" | "body"> {
  /** JSON body o FormData */
  data?: unknown;
  /** Query string params: /endpoint?key=value */
  params?: Params;
  /** Se propaga como header X-Correlation-Id para trazabilidad end-to-end */
  correlationId?: string;
  /** Se propaga como header X-Actor: quién origina la mutación (cliente o asesor) */
  actor?: "client" | "advisor";
  /** Aborta la petición si no responde en este tiempo (ms). Default: DEFAULT_TIMEOUT_MS */
  timeoutMs?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}
