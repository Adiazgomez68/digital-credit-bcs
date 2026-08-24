import Link from "next/link";

import { WEB_ROUTES } from "@/routes/web";
import { cn } from "@/lib/utils";

interface LoadErrorProps {
  centered?: boolean;
}

export function LoadError({ centered = false }: Readonly<LoadErrorProps>) {
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

      <Link
        href={WEB_ROUTES.CLIENT.HOME}
        className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
      >
        ← Volver al inicio
      </Link>
    </div>
  );
}
