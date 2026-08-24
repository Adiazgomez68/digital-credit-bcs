import { Check } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime } from "@/lib/format";
import type { Application } from "@/types/application";

import { ConfirmationLayout } from "./layout";

export function ConfirmationFinalized({
  application,
}: Readonly<{ application: Application }>) {
  return (
    <ConfirmationLayout
      tone="success"
      icon={Check}
      title="Tu solicitud fue finalizada con éxito"
      description="Hemos registrado toda tu información. Como completaste el proceso por canal autogestionado, tu solicitud quedó cerrada de una vez."
      infoRows={[
        { label: "N.° de solicitud", value: application.id },
        {
          label: "Estado actual",
          value: <StatusBadge status={application.status} />,
        },
        {
          label: "Fecha de radicación",
          value: formatDateTime(application.createdAt),
        },
        { label: "Canal", value: "Autogestionado" },
      ]}
      nextSteps={[
        "Validaremos la información suministrada frente a nuestras políticas de crédito.",
        "Te contactaremos por correo o celular si necesitamos algún dato adicional antes del desembolso.",
      ]}
    />
  );
}
