"use client";

import { useState } from "react";
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
import { useSaveAndExit } from "@/components/wizard/save-and-exit-context";
import { useAbandonApplication } from "@/hooks/use-aplication";
import { useApplicationStore } from "@/providers/application-store-provider";
import { STEP_ROUTES, WEB_ROUTES } from "@/routes/web";
import type { ApplicationState } from "@/types/store";

interface WizardBackLinkProps {
  step: ApplicationState["step"];
  children: React.ReactNode;
}

const BACK_LINK_CLASSNAME =
  "cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground hover:underline";

export function WizardBackLink({
  step,
  children,
}: Readonly<WizardBackLinkProps>) {
  const router = useRouter();
  const goToStep = useApplicationStore((store) => store.goToStep);

  // Going back to "channel" means leaving the actual wizard data behind —
  // gate it behind a confirmation instead of silently dropping progress.
  if (step === "channel") {
    return <ExitToChannelConfirm>{children}</ExitToChannelConfirm>;
  }

  return (
    <button
      type="button"
      className={BACK_LINK_CLASSNAME}
      onClick={() => {
        goToStep(step);
        router.push(STEP_ROUTES[step]);
      }}
    >
      {children}
    </button>
  );
}

function ExitToChannelConfirm({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const id = useApplicationStore((store) => store.id);
  const resetStore = useApplicationStore((store) => store.reset);
  const saveOnExit = useSaveAndExit();
  const abandonMutation = useAbandonApplication();

  function handleSaveAndExit() {
    saveOnExit();
    setOpen(false);
    router.push(WEB_ROUTES.CLIENT.HOME);
  }

  function handleAbandon() {
    if (!id) {
      resetStore();
      setOpen(false);
      router.push(WEB_ROUTES.CLIENT.HOME);
      return;
    }

    abandonMutation.mutate(
      {
        id,
        payload: { reason: "Abandonó el proceso al volver al paso de canal" },
        actor: "client",
      },
      {
        onSettled: () => {
          resetStore();
          setOpen(false);
          router.push(WEB_ROUTES.CLIENT.HOME);
        },
      },
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        className={BACK_LINK_CLASSNAME}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Quieres abandonar el proceso?</AlertDialogTitle>

          <AlertDialogDescription>
            Volver te saca de tu solicitud. Puedes guardar tu progreso y
            continuar después, o abandonar el proceso.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction variant="outline" onClick={handleSaveAndExit}>
            Guardar y salir
          </AlertDialogAction>

          <AlertDialogAction
            variant="destructive"
            onClick={handleAbandon}
            loading={abandonMutation.isPending}
          >
            Abandonar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
