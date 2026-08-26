import { setupWorker } from "msw/browser";

import { ApiError } from "@/lib/http-client/api-error";

import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

let readyPromise: Promise<void> | null = null;

const RELOAD_GUARD_KEY = "msw-controller-reload-attempts";
const MAX_RELOAD_ATTEMPTS = 3;
const CONTROLLER_WAIT_MS = 2_000;

function waitForController(): Promise<boolean> {
  if (navigator.serviceWorker.controller) return Promise.resolve(true);

  return new Promise<boolean>((resolve) => {
    const timer = setTimeout(() => resolve(false), CONTROLLER_WAIT_MS);
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => {
        clearTimeout(timer);
        resolve(true);
      },
      { once: true },
    );
  });
}

// Retries a few reloads for a slow-to-activate SW instead of silently leaving requests unmocked.
async function ensureController(): Promise<void> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  if (await waitForController()) {
    sessionStorage.removeItem(RELOAD_GUARD_KEY);
    return;
  }

  const attempts = Number(sessionStorage.getItem(RELOAD_GUARD_KEY) ?? "0");
  if (attempts < MAX_RELOAD_ATTEMPTS) {
    sessionStorage.setItem(RELOAD_GUARD_KEY, String(attempts + 1));
    location.reload();
    await new Promise<void>(() => {});
  }

  sessionStorage.removeItem(RELOAD_GUARD_KEY);
  throw new ApiError(
    "No se pudo activar el entorno de simulación. Recarga la página.",
    0,
    undefined,
    "network",
  );
}

// Starts the MSW worker once; every caller awaits the same cached promise.
export function startMocking(): Promise<void> {
  readyPromise ??= worker
    .start({ onUnhandledRequest: "bypass" })
    .then(() => ensureController());
  return readyPromise;
}
