import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

let readyPromise: Promise<void> | null = null;

const RELOAD_GUARD_KEY = "msw-controller-reload-guard";

// worker.start() can resolve while the SW still isn't this page's controller, silently bypassing mocks.
async function ensureController(): Promise<void> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  if (navigator.serviceWorker.controller) {
    sessionStorage.removeItem(RELOAD_GUARD_KEY);
    return;
  }

  const controlled = await new Promise<boolean>((resolve) => {
    const timer = setTimeout(() => resolve(false), 2_000);
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => {
        clearTimeout(timer);
        resolve(true);
      },
      { once: true },
    );
  });

  if (controlled) {
    sessionStorage.removeItem(RELOAD_GUARD_KEY);
    return;
  }

  // One retry per session, to avoid a reload loop.
  if (sessionStorage.getItem(RELOAD_GUARD_KEY)) return;
  sessionStorage.setItem(RELOAD_GUARD_KEY, "1");
  location.reload();
  await new Promise<void>(() => {});
}

// Starts the MSW worker once; every caller awaits the same cached promise.
export function startMocking(): Promise<void> {
  readyPromise ??= worker
    .start({ onUnhandledRequest: "bypass" })
    .then(() => ensureController());
  return readyPromise;
}
