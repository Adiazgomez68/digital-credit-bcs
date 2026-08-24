interface HttpLogEntry {
  method: string;
  endpoint: string;
  correlationId?: string;
  status?: number;
  durationMs: number;
  error?: string;
}

// Just the telemetry a real platform would consume; there's no platform here to query/alert on it.
function logHttpCall(entry: HttpLogEntry): void {
  const details = {
    correlationId: entry.correlationId,
    status: entry.status,
    durationMs: Math.round(entry.durationMs),
    error: entry.error,
  };

  if (entry.error) {
    console.error(`[http] ${entry.method} ${entry.endpoint}`, details);
  } else {
    console.info(`[http] ${entry.method} ${entry.endpoint}`, details);
  }
}

// Catches JS errors/rejections that never go through the http-client.
function logClientError(
  error: unknown,
  context: Record<string, unknown>,
): void {
  console.error("[client-error]", { error, ...context });
}

export const observability = {
  logHttpCall,
  logClientError,
};
