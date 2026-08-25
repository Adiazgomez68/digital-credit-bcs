import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { WizardBackLink } from "@/components/wizard/back-link";
import { formatCurrency } from "@/lib/format";
import { WEB_ROUTES } from "@/routes/web";
import type { Application } from "@/types/application";

interface SimulationSuccessProps {
  application: Application;
}

export function SimulationSuccess({
  application,
}: Readonly<SimulationSuccessProps>) {
  const router = useRouter();
  const { offer, amountRequested, termMonths } = application;

  function handleContinue() {
    router.push(WEB_ROUTES.CLIENT.CREDIT.SUMMARY);
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="rounded-xl border-[1.5px] border-success bg-success-tint p-7">
        <div className="mb-1.5 flex items-center gap-3">
          <span className="flex size-9.5 shrink-0 items-center justify-center rounded-full bg-success text-white">
            <Check className="size-4.5" />
          </span>

          <div>
            <div className="text-lg font-semibold">Tu simulación es viable</div>
            <div className="mt-0.5 text-sm text-muted-foreground">
              Estas son las condiciones preliminares de tu crédito.
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <OfferItem
            label="Valor aprobado"
            value={formatCurrency(amountRequested ?? 0)}
          />
          <OfferItem
            label="Cuota mensual estimada"
            value={formatCurrency(offer?.estimatedFee ?? 0)}
          />
          <OfferItem label="Plazo" value={`${termMonths} meses`} />
          <OfferItem
            label="Tasa efectiva"
            value={`${formatMonthlyRate(offer?.monthlyRate)} M.V.`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <WizardBackLink step="supplementary_data">← Atrás</WizardBackLink>

        <Button size="lg" onClick={handleContinue}>
          Continuar al resumen
        </Button>
      </div>
    </div>
  );
}

function formatMonthlyRate(rate?: number): string {
  return `${((rate ?? 0) * 100).toFixed(2).replace(".", ",")}%`;
}

function OfferItem({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-lg bg-card px-4.5 py-4">
      <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}
