"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

type SaveFn = () => void;

interface SaveAndExitContextValue {
  register: (fn: SaveFn | null) => void;
  save: () => void;
}

const SaveAndExitContext = createContext<SaveAndExitContextValue | null>(null);

export function SaveAndExitProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const saveFnRef = useRef<SaveFn | null>(null);

  const register = useCallback((fn: SaveFn | null) => {
    saveFnRef.current = fn;
  }, []);

  const save = useCallback(() => {
    saveFnRef.current?.();
  }, []);

  return (
    <SaveAndExitContext.Provider value={{ register, save }}>
      {children}
    </SaveAndExitContext.Provider>
  );
}

// Lets the form currently mounted for a wizard step offer a best-effort
// partial save, triggered when the user clicks "Guardar y salir" instead of
// completing the step. Steps with nothing to save (e.g. Datos básicos before
// the application exists) simply never call this, so the link falls back to
// its default behavior of just navigating away.
export function useSaveAndExitRegistration(fn: SaveFn) {
  const context = useContext(SaveAndExitContext);

  useEffect(() => {
    context?.register(fn);
    return () => context?.register(null);
  }, [context, fn]);
}

export function useSaveAndExit(): SaveFn {
  const context = useContext(SaveAndExitContext);
  return context?.save ?? (() => {});
}
