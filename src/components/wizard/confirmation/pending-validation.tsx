import { CircleAlert } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatChannelLabel, formatDateTime } from "@/lib/format";
import type { Application } from "@/types/application";

import { ConfirmationLayout } from "./layout";

export function ConfirmationPendingValidation({
  application,
}: Readonly<{ application: Application }>) {
  return (
    <ConfirmationLayout
      tone="warning"
      icon={CircleAlert}
      title="Tu solicitud fue enviada con éxito"
      description="Hemos registrado toda tu información. Como tu asesor te acompaña en el proceso, la solicitud queda en revisión antes de finalizar."
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
        {
          label: "Canal",
          value: formatChannelLabel(application.channel, application.advisorId),
        },
      ]}
      nextSteps={[
        "Tu asesor y el equipo de crédito validarán la información frente a nuestras políticas.",
        "Te contactaremos por correo o celular si necesitamos algún dato adicional.",
        'Verás el cambio a "Finalizada" reflejado en el detalle de tu solicitud, con el evento registrado en la trazabilidad.',
      ]}
    />
  );
}
