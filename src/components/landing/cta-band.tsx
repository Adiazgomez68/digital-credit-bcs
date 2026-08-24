import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/shared/heading";
import { View } from "@/components/shared/view";
import { cn } from "@/lib/utils";

export function CtaBand() {
  return (
    <View size="wide" className="pb-16">
      <div className="flex flex-col items-start gap-8 rounded-xl bg-primary-hover px-10 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Heading level={2} className="max-w-lg text-primary-foreground">
            ¿Listo para empezar tu solicitud?
          </Heading>

          <p className="mt-2.5 text-sm text-primary-foreground/80">
            Tarda menos de lo que crees, y puedes retomarla cuando quieras.
          </p>
        </div>

        <Link
          href="/credit/channel"
          className={cn(
            buttonVariants({ size: "xl" }),
            "shrink-0 bg-card text-primary hover:bg-card/90",
          )}
        >
          Iniciar solicitud
        </Link>
      </div>
    </View>
  );
}
