import { Header } from "@/components/layout/header";
import { Stepper } from "@/components/shared/stepper";
import { SaveAndExitProvider } from "@/components/wizard/save-and-exit-context";
import type { WizardStep as AnyWizardStep } from "@/routes/web";

type WizardStep = Exclude<AnyWizardStep, "channel">;

interface WizardStepShellProps {
  step: WizardStep;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
}

export function WizardStepShell({
  step,
  headerContent,
  children,
}: Readonly<WizardStepShellProps>) {
  return (
    <SaveAndExitProvider>
      <Header>{headerContent}</Header>

      <Stepper current={step} />

      {children}
    </SaveAndExitProvider>
  );
}
