"use client";

import {
  ApplicationStoreApi,
  createApplicationStore,
} from "@/store/application-store";
import { ApplicationStore } from "@/types/store";
import { createContext, useContext, useState } from "react";
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

export const useApplicationStore = <T,>(
  selector: (store: ApplicationStore) => T,
) => {
  const applicationStoreContext = useContext(ApplicationStoreContext);

  if (!applicationStoreContext) {
    throw new Error(
      "useApplicationStore must be used within ApplicationStoreProvider",
    );
  }
  return useStore(applicationStoreContext, selector);
};
