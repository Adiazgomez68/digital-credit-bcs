"use client";

import { useApplicationStore } from "@/providers/application-store-provider";

import { useFetchApplicationById } from "@/hooks/use-aplication";
import { AbandonAction } from "./abandon";

export function CurrentAbandonTrigger() {
  const id = useApplicationStore((store) => store.id);
  const application = useFetchApplicationById(id!);

  if (!id || !application.data) return null;

  return (
    <AbandonAction
      applicationId={id}
      className="cursor-pointer text-xs font-semibold text-destructive hover:underline"
    >
      Abandonar
    </AbandonAction>
  );
}
