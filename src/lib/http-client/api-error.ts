export type ApiErrorCode = "http" | "network" | "timeout";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly info?: unknown,
    public readonly code: ApiErrorCode = "http",
  ) {
    super(message);
    this.name = "ApiError";
  }
}
