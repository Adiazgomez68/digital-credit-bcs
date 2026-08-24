"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/shared/heading";
import { KeyValueGrid, KeyValueItem } from "@/components/shared/key-value";
import { StatusBadge } from "@/components/shared/status-badge";
import { AbandonAction } from "@/components/wizard/abandon";
import {
  useFinalizeApplication,
  useSubmitApplicationForReview,
} from "@/hooks/use-aplication";
import { formatCurrency } from "@/lib/format";
import { WEB_ROUTES } from "@/routes/web";
import type { Application } from "@/types/application";

interface SummaryViewProps {
  application: Application;
}

export function SummaryView({ application }: Readonly<SummaryViewProps>) {
  const router = useRouter();
  const finalizeMutation = useFinalizeApplication();
  const submitForReviewMutation = useSubmitApplicationForReview();

  const isPending =
    finalizeMutation.isPending || submitForReviewMutation.isPending;

  function handleFinalize() {
    if (application.channel === "unassisted") {
      finalizeMutation.mutate(
        { id: application.id, actor: "client" },
        { onSuccess: () => router.push(WEB_ROUTES.CLIENT.CREDIT.CONFIRMATION) },
      );
      return;
    }

    submitForReviewMutation.mutate(application.id, {
      onSuccess: () => router.push(WEB_ROUTES.CLIENT.CREDIT.CONFIRMATION),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2 flex items-center justify-between">
        <Heading level={1} className="text-2xl">
          Resumen de tu solicitud
        </Heading>

        <StatusBadge status={application.status} />
      </div>

      <p className="-mt-3 mb-3 text-sm text-muted-foreground">
        Solicitud N.° {application.id} · Revisa que todo esté correcto antes de
        finalizar.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>
        <CardContent>
          <KeyValueGrid>
            <KeyValueItem
              label="Documento"
              value={`${application.document.type} ${application.document.number}`}
            />
            <KeyValueItem label="Nombres completos" value={application.names} />
            <KeyValueItem label="Celular" value={application.phone} />
            <KeyValueItem label="Correo" value={application.email} />
            <KeyValueItem label="Ciudad" value={application.city ?? "—"} />
          </KeyValueGrid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos financieros</CardTitle>
        </CardHeader>
        <CardContent>
          <KeyValueGrid>
            <KeyValueItem
              label="Ingresos mensuales"
              value={formatCurrency(application.income ?? 0)}
            />
            <KeyValueItem
              label="Egresos mensuales"
              value={formatCurrency(application.expenses ?? 0)}
            />
            <KeyValueItem
              label="Valor solicitado"
              value={formatCurrency(application.amountRequested ?? 0)}
            />
            <KeyValueItem
              label="Plazo deseado"
              value={`${application.termMonths} meses`}
            />
            <KeyValueItem
              label="Destino del crédito"
              value={application.loanPurpose ?? "—"}
            />
            <KeyValueItem
              label="Tratamiento de datos"
              value={application.privacyPolicy ? "Autorizado" : "No autorizado"}
            />
          </KeyValueGrid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Oferta simulada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg bg-accent px-5 py-4.5">
            <div>
              <div className="text-xs text-accent-foreground/80">
                Cuota mensual estimada
              </div>
              <div className="text-2xl font-semibold text-accent-foreground">
                {formatCurrency(application.offer?.estimatedFee ?? 0)}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-accent-foreground/80">
                Tasa efectiva
              </div>
              <div className="text-sm font-semibold text-accent-foreground">
                {((application.offer?.monthlyRate ?? 0) * 100)
                  .toFixed(2)
                  .replace(".", ",")}
                % M.V.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-3 flex items-center justify-between">
        <AbandonAction
          applicationId={application.id}
          className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
        >
          Abandonar proceso
        </AbandonAction>

        <Button size="lg" onClick={handleFinalize} loading={isPending}>
          Finalizar solicitud
        </Button>
      </div>
    </div>
  );
}
