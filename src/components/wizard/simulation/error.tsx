import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WizardBackLink } from "@/components/wizard/back-link";

interface SimulationErrorProps {
  onRetry: () => void;
  isRetrying: boolean;
}

export function SimulationError({
  onRetry,
  isRetrying,
}: Readonly<SimulationErrorProps>) {
  return (
    <div className="flex flex-col gap-7">
      <div className="rounded-xl border-[1.5px] border-destructive bg-destructive/10 p-7">
        <div className="mb-1.5 flex items-center gap-3">
          <span className="flex size-9.5 shrink-0 items-center justify-center rounded-full bg-destructive text-white">
            <X className="size-4.5" />
          </span>

          <div>
            <div className="text-lg font-semibold">
              No pudimos completar la simulación
            </div>
            <div className="mt-0.5 text-sm text-muted-foreground">
              Ocurrió un error técnico temporal. Tu información ya quedó
              guardada.
            </div>
          </div>
        </div>

        <div className="mt-4.5 rounded-lg bg-card px-4.5 py-4 text-sm leading-relaxed">
          Puedes intentarlo de nuevo en unos minutos. Si el problema persiste,
          contacta a soporte.
        </div>
      </div>

      <div className="flex items-center justify-between">
        <WizardBackLink step="supplementary_data">← Atrás</WizardBackLink>

        <Button variant="secondary" onClick={onRetry} loading={isRetrying}>
          Reintentar
        </Button>
      </div>
    </div>
  );
}
