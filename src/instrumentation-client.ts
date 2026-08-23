import { observability } from "@/lib/observability/logger";

window.addEventListener("error", (event) => {
  observability.logClientError(event.error, { type: "window-error" });
});

window.addEventListener("unhandledrejection", (event) => {
  observability.logClientError(event.reason, { type: "unhandled-rejection" });
});
