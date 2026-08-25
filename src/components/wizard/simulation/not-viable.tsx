import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WEB_ROUTES } from "@/routes/web";
import type { Application } from "@/types/application";

import { useAbandonApplication } from "@/hooks/use-aplication";
import { useApplicationStore } from "@/providers/application-store-provider";
import { useRouter } from "next/navigation";
import { AlternativeOfferCard } from "./alternative-offer";

interface SimulationNotViableProps {
  application: Application;
}

export function SimulationNotViable({
  application,
}: Readonly<SimulationNotViableProps>) {
  const router = useRouter();
  const resetStore = useApplicationStore((store) => store.reset);

  const { mutate, isPending } = useAbandonApplication();

  const { offer } = application;

  const goToStart = () => {
    mutate(
      {
        id: application.id,
        payload: {
          reason: "Solicitud no viable, sin oferta alternativa",
        },
        actor: "client",
      },
      {
        onSuccess: () => {
          resetStore();
          router.replace(WEB_ROUTES.CLIENT.HOME);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border-[1.5px] border-warning bg-warning-tint p-7">
        <div className="mb-1.5 flex items-center gap-3">
          <span className="flex size-9.5 shrink-0 items-center justify-center rounded-full bg-warning text-white">
            <TriangleAlert className="size-4.5" />
          </span>

          <div>
            <div className="text-lg font-semibold">
              Tu solicitud no es viable por ahora
            </div>
            <div className="mt-0.5 text-sm text-muted-foreground">
              No cumple con las condiciones mínimas para este producto.
            </div>
          </div>
        </div>

        <div className="mt-4.5 rounded-lg bg-card px-4.5 py-4 text-sm leading-relaxed">
          <strong>Motivo:</strong> {offer?.reasonNoViable}
        </div>
      </div>

      {offer?.alternativeOffer ? (
        <AlternativeOfferCard
          applicationId={application.id}
          offer={offer.alternativeOffer}
        />
      ) : (
        <Button
          onClick={goToStart}
          variant="outline"
          disabled={isPending}
          loading={isPending}
          className="self-start"
        >
          Volver al inicio
        </Button>
      )}
    </div>
  );
}
