import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

import type { SimulationResult } from "./schema";

interface SummaryProps {
  result: SimulationResult;
  onRecalculate: () => void;
}

export function Summary({ result, onRecalculate }: Readonly<SummaryProps>) {
  return (
    <div className="flex flex-col gap-5 animate-in fade-in">
      <div>
        <div className="text-2xl font-semibold text-primary">
          {formatCurrency(result.amount)}
        </div>

        <div className="text-sm text-muted-foreground">
          a {result.termMonths} meses
        </div>
      </div>

      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Cuota estimada</dt>
          <dd className="font-medium">
            {formatCurrency(result.estimatedFee)} / mes
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Tasa preferencial</dt>
          <dd className="font-medium">1,52% M.V.</dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Desembolso</dt>
          <dd className="font-medium">Hasta 24h hábiles</dd>
        </div>
      </dl>

      <Button
        variant="link"
        className="self-start px-0"
        onClick={onRecalculate}
      >
        ← Volver a calcular
      </Button>
    </div>
  );
}
