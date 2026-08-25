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
import {
  useAbandonApplication,
  useFetchApplicationById,
} from "@/hooks/use-aplication";
import {
  useApplicationStore,
  useApplicationStoreHasHydrated,
} from "@/providers/application-store-provider";
import type { ApplicationStatus } from "@/types/application";

// Statuses where there's still something for the client to continue —
// terminal/advisor-owned statuses shouldn't prompt to "resume" anything.
const RESUMABLE_STATUSES = new Set<ApplicationStatus>([
  "draft",
  "simulation_realized",
  "simulation_rejected",
]);

export function ResumePrompt() {
  const router = useRouter();
  const id = useApplicationStore((store) => store.id);
  const hasHydrated = useApplicationStoreHasHydrated();
  const resetStore = useApplicationStore((store) => store.reset);
  const abandonMutation = useAbandonApplication();

  const { data: application, isPending: isLoadingApplication } =
    useFetchApplicationById(id!);

  const shouldPrompt =
    hasHydrated &&
    !!id &&
    !isLoadingApplication &&
    !!application &&
    RESUMABLE_STATUSES.has(application.status);

  function handleContinue() {
    if (!application) return;
    router.push(application.resumeRoute);
  }

  function handleStartOver() {
    abandonMutation.mutate(
      {
        id: id!,
        payload: { reason: "Inició una nueva solicitud" },
        actor: "client",
      },
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
