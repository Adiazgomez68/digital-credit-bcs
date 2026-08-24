"use client";

import Link from "next/link";

import { useSaveAndExit } from "@/components/wizard/save-and-exit-context";
import { WEB_ROUTES } from "@/routes/web";

export function SaveAndExitLink() {
  const save = useSaveAndExit();

  return (
    <Link
      href={WEB_ROUTES.CLIENT.HOME}
      onClick={save}
      className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline"
    >
      Guardar y salir
    </Link>
  );
}
