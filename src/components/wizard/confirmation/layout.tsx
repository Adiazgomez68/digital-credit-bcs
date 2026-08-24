"use client";

import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useApplicationStore } from "@/providers/application-store-provider";
import { WEB_ROUTES } from "@/routes/web";

interface InfoRow {
  label: string;
  value: React.ReactNode;
}

interface ConfirmationLayoutProps {
  tone: "success" | "warning";
  icon: LucideIcon;
  title: string;
  description: string;
  infoRows: InfoRow[];
  nextSteps: string[];
}

const TONE_CLASSES: Record<ConfirmationLayoutProps["tone"], string> = {
  success: "bg-success-tint text-success",
  warning: "bg-warning-tint text-warning",
};

export function ConfirmationLayout({
  tone,
  icon: Icon,
  title,
  description,
  infoRows,
  nextSteps,
}: Readonly<ConfirmationLayoutProps>) {
  const router = useRouter();
  const resetStore = useApplicationStore((store) => store.reset);

  function handleGoHome() {
    resetStore();
    router.push(WEB_ROUTES.CLIENT.HOME);
  }

  return (
    <div className="text-center">
      <span
        className={cn(
          "mx-auto mb-7 flex size-18 items-center justify-center rounded-full",
          TONE_CLASSES[tone],
        )}
      >
        <Icon className="size-8.5" />
      </span>

      <h1 className="font-heading text-[28px] font-medium">{title}</h1>

      <p className="mx-auto mt-2.5 mb-8 max-w-prose text-[15px] text-muted-foreground">
        {description}
      </p>

      <div className="mb-8 rounded-xl border border-border bg-card p-7 text-left shadow-sm">
        {infoRows.map((row, index) => (
          <div
            key={row.label}
            className={cn(
              "flex items-center justify-between py-3",
              index < infoRows.length - 1 && "border-b border-secondary",
            )}
          >
            <div className="text-sm text-muted-foreground">{row.label}</div>
            <div className="text-sm font-semibold">{row.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-9 text-left">
        <h2 className="mb-3.5 text-sm font-semibold">¿Qué sigue?</h2>

        <ol className="flex flex-col gap-2">
          {nextSteps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm text-muted-foreground">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-muted-foreground">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <Button size="lg" onClick={handleGoHome}>
        Volver al inicio
      </Button>
    </div>
  );
}
