"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
import {
  useAbandonApplication,
  useReturnToDraft,
} from "@/hooks/use-aplication";
import { cn } from "@/lib/utils";
import { useApplicationStore } from "@/providers/application-store-provider";
import { STEP_ROUTES, WEB_ROUTES, type WizardStep } from "@/routes/web";
import { Button } from "../ui/button";

interface WizardBackLinkProps {
  step: WizardStep;
  children: React.ReactNode;
  className?: string;
}

const BACK_LINK_CLASSNAME =
  "cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground hover:underline";

export function WizardBackLink({
  step,
  children,
  className,
}: Readonly<WizardBackLinkProps>) {
  const router = useRouter();
  const applicationId = useApplicationStore((store) => store.id);
  const { mutate, isPending } = useReturnToDraft();

  if (step === "channel") {
    return <ExitToChannelConfirm>{children}</ExitToChannelConfirm>;
  }

  const goToBack = () => {
    if (step !== "supplementary_data") {
      router.push(STEP_ROUTES[step]);
      return;
    }

    mutate(applicationId!, {
      onSuccess: () => {
        router.replace(STEP_ROUTES[step]);
      },
    });
  };

  return (
    <Button
      type="button"
      variant="link"
      loading={isPending}
      disabled={isPending}
      className={cn(BACK_LINK_CLASSNAME, className)}
      onClick={goToBack}
    >
      {children}
    </Button>
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
