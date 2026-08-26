"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { useApplicationStore } from "@/providers/application-store-provider";
import { WEB_ROUTES } from "@/routes/web";

interface LoadErrorProps {
  centered?: boolean;
}

export function LoadError({ centered = false }: Readonly<LoadErrorProps>) {
  const router = useRouter();
  const resetStore = useApplicationStore((store) => store.reset);

  function handleGoHome() {
    resetStore();
    router.replace(WEB_ROUTES.CLIENT.HOME);
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        centered ? "items-center text-center" : "items-start",
      )}
    >
      <p className="text-sm text-destructive">
        No pudimos cargar tu solicitud. Intenta de nuevo más tarde.
      </p>

      <button
        type="button"
        onClick={handleGoHome}
        className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
      >
        ← Volver al inicio
      </button>
    </div>
  );
}
