import { View } from "@/components/shared/view";

import { SectionHeading } from "./section-heading";

const STEPS = [
  {
    title: "Cuéntanos quién eres",
    description: "Tus datos básicos de contacto y de identificación.",
  },
  {
    title: "Cuéntanos tu necesidad",
    description: "Ingresos, valor solicitado, plazo y destino del crédito.",
  },
  {
    title: "Revisa tu simulación",
    description: "Una oferta preliminar, clara y sin compromiso.",
  },
  {
    title: "Confirma y haz seguimiento",
    description: "Finaliza tu solicitud y consulta su estado cuando quieras.",
  },
] as const;

export function HowItWorks() {
  return (
    <View as="section" size="wide" className="py-16">
      <SectionHeading kicker="El proceso" title="Cómo funciona" />

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <div key={step.title}>
            <div className="mb-4 flex size-9 items-center justify-center rounded-full bg-primary font-heading font-semibold text-primary-foreground">
              {index + 1}
            </div>

            <h3 className="font-medium">{step.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </View>
  );
}
