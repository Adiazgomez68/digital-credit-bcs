"use client";

import Link from "next/link";

import { useSaveAndExit } from "@/components/wizard/save-and-exit-context";
import { useFetchApplicationById } from "@/hooks/use-aplication";
import { useApplicationStore } from "@/providers/application-store-provider";
import { WEB_ROUTES } from "@/routes/web";

export function SaveAndExitLink() {
  const id = useApplicationStore((store) => store.id);
  const application = useFetchApplicationById(id!);

  const save = useSaveAndExit();

  if (!id || !application.data) return null;

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
