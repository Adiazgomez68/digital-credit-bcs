import { Check } from "lucide-react";

import { View } from "@/components/shared/view";

import { SectionHeading } from "./section-heading";

const REQUIREMENTS = [
  {
    title: "Ser mayor de edad",
    description:
      "Debes tener 18 años o más al momento de solicitar el crédito.",
  },
  {
    title: "Contar con ingresos demostrables",
    description: "Como empleado, independiente o pensionado.",
  },
  {
    title: "Documento de identidad vigente",
    description: "Cédula de ciudadanía, cédula de extranjería o pasaporte.",
  },
  {
    title: "Un producto activo, o vincularte durante el proceso",
    description:
      "Si aún no tienes un producto con nosotros, te ayudamos a abrirlo.",
  },
] as const;

export function Requirements() {
  return (
    <View as="section" id="requisitos" size="wide" className="py-16">
      <SectionHeading kicker="Antes de empezar" title="Requisitos mínimos" />

      <ul className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
        {REQUIREMENTS.map((requirement) => (
          <li
            key={requirement.title}
            className="flex gap-3.5 border-b border-border px-6 py-5 last:border-b-0"
          >
            <Check className="mt-0.5 size-5 shrink-0 text-primary" />

            <div>
              <div className="text-sm font-semibold">{requirement.title}</div>
              <div className="mt-0.5 text-sm text-muted-foreground">
                {requirement.description}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </View>
  );
}
