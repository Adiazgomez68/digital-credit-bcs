"use client";

import { useApplicationStore } from "@/providers/application-store-provider";

import { AbandonAction } from "./abandon";

export function CurrentAbandonTrigger() {
  const id = useApplicationStore((store) => store.id);

  if (!id) return null;

  return (
    <AbandonAction
      applicationId={id}
      className="cursor-pointer text-xs font-semibold text-destructive hover:underline"
    >
      Abandonar
    </AbandonAction>
  );
}
