export const SESSION_COOKIE = "bcs_advisor_session";
export const MAX_SESSION_SECONDS = 60;
export const BASE_COOKIE_ATTRIBUTES =
  "Path=/advisor-portal; Secure; SameSite=Lax";

// Refresh a bit before the token actually expires, not exactly at the deadline.
export const REFRESH_BUFFER_MS = 10_000;
