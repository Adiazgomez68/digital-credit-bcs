"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

  const values = useMemo(() => ({ register, save }), [register, save]);

  return (
    <SaveAndExitContext.Provider value={values}>
      {children}
    </SaveAndExitContext.Provider>
  );
}

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
