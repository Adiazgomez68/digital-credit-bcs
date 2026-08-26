"use client";

import { usePathname } from "next/navigation";

import { Header } from "@/components/layout/header";
import { Stepper } from "@/components/shared/stepper";
import { SaveAndExitProvider } from "@/components/wizard/save-and-exit-context";
import { STEP_ROUTES, type WizardStep } from "@/routes/web";

interface WizardStepShellProps {
  headerContent?: React.ReactNode;
  children: React.ReactNode;
}

function findStepForPathname(pathname: string): WizardStep | undefined {
  return (Object.keys(STEP_ROUTES) as WizardStep[]).find(
    (step) => STEP_ROUTES[step] === pathname,
  );
}

export function WizardStepShell({
  headerContent,
  children,
}: Readonly<WizardStepShellProps>) {
  const pathname = usePathname();
  const step = findStepForPathname(pathname);

  return (
    <SaveAndExitProvider>
      <Header>{headerContent}</Header>

      {step && step !== "channel" && <Stepper current={step} />}

      {children}
    </SaveAndExitProvider>
  );
}
