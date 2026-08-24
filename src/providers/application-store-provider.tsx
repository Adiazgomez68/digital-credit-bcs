"use client";

import {
  ApplicationStoreApi,
  createApplicationStore,
} from "@/store/application-store";
import { ApplicationStore } from "@/types/store";
import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";
import { useStore } from "zustand";

const ApplicationStoreContext = createContext<ApplicationStoreApi | undefined>(
  undefined,
);

export function ApplicationStoreProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [store] = useState(() => createApplicationStore());

  return (
    <ApplicationStoreContext.Provider value={store}>
      {children}
    </ApplicationStoreContext.Provider>
  );
}

function useApplicationStoreApi(): ApplicationStoreApi {
  const applicationStoreContext = useContext(ApplicationStoreContext);

  if (!applicationStoreContext) {
    throw new Error(
      "useApplicationStore must be used within ApplicationStoreProvider",
    );
  }

  return applicationStoreContext;
}

export const useApplicationStore = <T,>(
  selector: (store: ApplicationStore) => T,
) => {
  const store = useApplicationStoreApi();
  return useStore(store, selector);
};

// True once the persisted draft pointer has been read back from storage —
// false for one tick on first client render, to avoid redirecting away
// before the real id/step are known.
export function useApplicationStoreHasHydrated(): boolean {
  const store = useApplicationStoreApi();

  return useSyncExternalStore(
    (onChange) => store.persist.onFinishHydration(onChange),
    () => store.persist.hasHydrated(),
    () => false,
  );
}
