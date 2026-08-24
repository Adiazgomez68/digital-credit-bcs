import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { View } from "@/components/shared/view";

import { SectionHeading } from "./section-heading";

const FAQ_ITEMS = [
  {
    question: "¿Cuánto tiempo toma la solicitud?",
    answer:
      "En promedio toma entre 8 y 12 minutos completar todos los datos, incluida la simulación preliminar.",
  },
  {
    question: "¿Puedo guardar mi solicitud y continuarla después?",
    answer:
      "Sí. Tu información queda guardada como borrador y puedes retomarla desde el listado de solicitudes cuando quieras.",
  },
  {
    question: "¿Qué pasa si mi solicitud no es viable?",
    answer:
      "Te lo indicamos de inmediato junto con el motivo, para que puedas ajustar tus datos o consultar otras alternativas.",
  },
] as const;

export function Faq() {
  return (
    <View as="section" id="preguntas" size="wide" className="py-16">
      <SectionHeading
        kicker="Preguntas frecuentes"
        title="Lo que más nos preguntan"
      />

      <Accordion className="max-w-3xl gap-3">
        {FAQ_ITEMS.map((item, index) => (
          <AccordionItem
            key={item.question}
            value={`faq-${index}`}
            className="rounded-xl border border-border bg-card px-5"
          >
            <AccordionTrigger className="py-5 text-sm font-semibold hover:no-underline">
              {item.question}
            </AccordionTrigger>

            <AccordionContent className="pb-5 text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </View>
  );
}
