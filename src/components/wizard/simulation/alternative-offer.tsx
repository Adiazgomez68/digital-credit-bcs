"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  useAbandonApplication,
  useAcceptAlternativeOffer,
} from "@/hooks/use-aplication";
import { formatCurrency } from "@/lib/format";
import { useApplicationStore } from "@/providers/application-store-provider";
import { WEB_ROUTES } from "@/routes/web";
import type { AlternativeOffer } from "@/types/application";

interface AlternativeOfferCardProps {
  applicationId: string;
  offer: AlternativeOffer;
}

export function AlternativeOfferCard({
  applicationId,
  offer,
}: Readonly<AlternativeOfferCardProps>) {
  const router = useRouter();
  const resetStore = useApplicationStore((store) => store.reset);
  const acceptMutation = useAcceptAlternativeOffer();
  const abandonMutation = useAbandonApplication();

  function handleAccept() {
    acceptMutation.mutate(applicationId);
  }

  function handleReject() {
    abandonMutation.mutate(
      {
        id: applicationId,
        payload: { reason: "No aceptó la oferta alternativa" },
        actor: "client",
      },
      {
        onSuccess: () => {
          resetStore();
          router.push(WEB_ROUTES.CLIENT.HOME);
        },
      },
    );
  }

  const isPending = acceptMutation.isPending || abandonMutation.isPending;

  return (
    <div className="rounded-xl border-[1.5px] border-primary bg-accent p-7">
      <div className="text-lg font-semibold">¿Quieres una alternativa?</div>
      <div className="mt-0.5 text-sm text-muted-foreground">
        Con estas condiciones, sí podríamos aprobar tu crédito.
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-card px-4.5 py-4">
          <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Monto sugerido
          </div>
          <div className="mt-1 text-xl font-semibold">
            {formatCurrency(offer.amountRequested)}
          </div>
        </div>

        <div className="rounded-lg bg-card px-4.5 py-4">
          <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Cuota mensual estimada
          </div>
          <div className="mt-1 text-xl font-semibold">
            {formatCurrency(offer.estimatedFee)}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
        <Button
          onClick={handleAccept}
          disabled={isPending}
          loading={acceptMutation.isPending}
          className="flex-1"
        >
          Aceptar esta oferta
        </Button>

        <Button
          variant="outline"
          onClick={handleReject}
          disabled={isPending}
          loading={abandonMutation.isPending}
          className="flex-1"
        >
          Rechazar oferta
        </Button>
      </div>
    </div>
  );
}
