import { TriangleAlert } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WEB_ROUTES } from "@/routes/web";
import type { Application } from "@/types/application";

import { AlternativeOfferCard } from "./alternative-offer";

interface SimulationNotViableProps {
  application: Application;
}

export function SimulationNotViable({
  application,
}: Readonly<SimulationNotViableProps>) {
  const { offer } = application;

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
        <Link
          href={WEB_ROUTES.CLIENT.HOME}
          className={cn(buttonVariants({ variant: "outline" }), "self-start")}
        >
          Volver al inicio
        </Link>
      )}
    </div>
  );
}
