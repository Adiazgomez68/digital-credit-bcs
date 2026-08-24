import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

let readyPromise: Promise<void> | null = null;

// Starts the MSW worker once; every caller awaits the same cached promise.
export function startMocking(): Promise<void> {
  readyPromise ??= worker
    .start({ onUnhandledRequest: "bypass" })
    .then(() => undefined);
  return readyPromise;
}
