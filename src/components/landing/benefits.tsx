import { DollarSign, MessageSquare, UserCheck, Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { View } from "@/components/shared/view";

import { SectionHeading } from "./section-heading";

const BENEFITS = [
  {
    icon: DollarSign,
    title: "Tasa preferencial",
    description:
      "Condiciones ajustadas a tu perfil, visibles desde la simulación preliminar.",
  },
  {
    icon: Zap,
    title: "Desembolso ágil",
    description:
      "Hasta 24 horas hábiles después de la aprobación de tu solicitud.",
  },
  {
    icon: UserCheck,
    title: "Sin garantías ni codeudor",
    description:
      "Tu historial y capacidad de pago son el respaldo de tu solicitud.",
  },
  {
    icon: MessageSquare,
    title: "Acompañamiento si lo necesitas",
    description: "Puedes completar el proceso solo o con la guía de un asesor.",
  },
] as const;

export function Benefits() {
  return (
    <View as="section" id="beneficios" size="wide" className="py-16">
      <SectionHeading
        kicker="Beneficios"
        title="Diseñado para que avances sin fricciones"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <Card key={title} size="sm">
            <CardContent className="flex flex-col gap-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </View>
  );
}
