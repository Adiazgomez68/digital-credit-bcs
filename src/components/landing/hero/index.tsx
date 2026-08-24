import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/shared/heading";
import { View } from "@/components/shared/view";
import { cn } from "@/lib/utils";

import { Simulator } from "./simulator";

export function Hero() {
  return (
    <View
      size="wide"
      className="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="flex flex-col gap-6">
        <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          Solicitud 100% en línea
        </span>

        <Heading level={1}>
          El crédito que se adapta a tus planes, no al revés.
        </Heading>

        <p className="max-w-md text-muted-foreground">
          Solicita tu crédito de libre destino desde donde estés, sin filas ni
          papeleo. Simula tu oferta en minutos y sigue el estado de tu solicitud
          en todo momento.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/credit/channel"
            className={cn(buttonVariants({ size: "xl" }))}
          >
            Solicitar crédito
          </Link>

          <Link
            href="/check-application"
            className={cn(buttonVariants({ variant: "ghost", size: "xl" }))}
          >
            Ya tengo una solicitud →
          </Link>
        </div>
      </div>

      <div className="flex justify-center lg:justify-end">
        <Simulator />
      </div>
    </View>
  );
}
