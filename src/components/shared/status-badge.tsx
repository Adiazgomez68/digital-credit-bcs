import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/application";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Borrador",
    className: "bg-secondary text-muted-foreground",
  },
  simulation_realized: {
    label: "Simulación realizada",
    className: "bg-accent text-accent-foreground",
  },
  simulation_rejected: {
    label: "Simulación no viable",
    className: "bg-warning-tint text-warning",
  },
  pending_validation: {
    label: "Pendiente Validación",
    className: "bg-warning-tint text-warning",
  },
  finalized: {
    label: "Finalizada",
    className: "bg-success-tint text-success",
  },
  abandoned: {
    label: "Abandonada",
    className: "bg-destructive/10 text-destructive",
  },
};

export function StatusBadge({
  status,
}: Readonly<{ status: ApplicationStatus }>) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full px-3 text-xs font-medium",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
