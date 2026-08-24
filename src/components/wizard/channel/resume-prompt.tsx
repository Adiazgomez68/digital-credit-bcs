"use client";

import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAbandonApplication } from "@/hooks/use-aplication";
import {
  useApplicationStore,
  useApplicationStoreHasHydrated,
} from "@/providers/application-store-provider";
import { STEP_ROUTES } from "@/routes/web";

export function ResumePrompt() {
  const router = useRouter();
  const id = useApplicationStore((store) => store.id);
  const step = useApplicationStore((store) => store.step);
  const hasHydrated = useApplicationStoreHasHydrated();
  const resetStore = useApplicationStore((store) => store.reset);
  const abandonMutation = useAbandonApplication();

  const shouldPrompt = hasHydrated && !!id && step !== "channel";

  function handleContinue() {
    router.push(STEP_ROUTES[step]);
  }

  function handleStartOver() {
    abandonMutation.mutate(
      {
        id: id!,
        payload: { reason: "Inició una nueva solicitud" },
        actor: "client",
      },
      // The goal here is clearing the local pointer, regardless of whether
      // the server-side draft could still be marked abandoned (e.g. it may
      // no longer exist there at all).
      { onSettled: () => resetStore() },
    );
  }

  return (
    <AlertDialog open={shouldPrompt}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tienes una solicitud en curso</AlertDialogTitle>

          <AlertDialogDescription>
            Encontramos una solicitud sin terminar. ¿Quieres continuar donde
            quedaste o empezar una nueva? Si empiezas de nuevo, la solicitud en
            curso se abandonará.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction
            variant="outline"
            onClick={handleStartOver}
            loading={abandonMutation.isPending}
          >
            Empezar de nuevo
          </AlertDialogAction>

          <AlertDialogAction onClick={handleContinue}>
            Continuar solicitud
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
