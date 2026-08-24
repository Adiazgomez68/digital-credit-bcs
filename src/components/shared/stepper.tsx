import { cn } from "@/lib/utils";
import type { ApplicationState } from "@/types/store";

// The wizard has 5 steps in the store ("channel" included), but only the
// last 4 are shown in this progress bar — channel selection has none.
type WizardStep = Exclude<ApplicationState["step"], "channel">;

const STEPS: { key: WizardStep; label: string }[] = [
  { key: "basic_data", label: "Datos básicos" },
  { key: "supplementary_data", label: "Complementarios" },
  { key: "simulation", label: "Simulación" },
  { key: "summary", label: "Resumen" },
];

export function Stepper({ current }: Readonly<{ current: WizardStep }>) {
  const currentIndex = STEPS.findIndex((step) => step.key === current);

  return (
    <div className="border-b border-border bg-card px-10 py-5">
      <div className="mx-auto flex max-w-2xl items-center">
        {STEPS.map((step, index) => (
          <div key={step.key} className="flex items-center">
            {index > 0 && <div className="mx-2.5 h-px w-12 bg-border" />}

            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  index < currentIndex && "bg-accent text-accent-foreground",
                  index === currentIndex &&
                    "bg-primary text-primary-foreground",
                  index > currentIndex && "bg-secondary text-text-faint",
                )}
              >
                {index < currentIndex ? "✓" : index + 1}
              </div>

              <div
                className={cn(
                  "text-xs font-semibold whitespace-nowrap",
                  index === currentIndex
                    ? "text-foreground"
                    : "text-text-faint",
                )}
              >
                {step.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
