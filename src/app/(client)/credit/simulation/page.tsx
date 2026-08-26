import { Heading } from "@/components/shared/heading";
import { View } from "@/components/shared/view";
import { CurrentAbandonTrigger } from "@/components/wizard/current-abandon-trigger";
import { CurrentChannelBadge } from "@/components/wizard/current-channel-badge";
import { RequireDraft } from "@/components/wizard/require-draft";
import { SaveAndExitLink } from "@/components/wizard/save-and-exit-link";
import { Simulation } from "@/components/wizard/simulation";
import { WizardStepShell } from "@/components/wizard/step-shell";

export default function SimulationPage() {
  return (
    <RequireDraft>
      <WizardStepShell
        headerContent={
          <>
            <SaveAndExitLink />
            <CurrentAbandonTrigger />
            <CurrentChannelBadge />
          </>
        }
      >
        <View
          size="narrow"
          className="max-w-160 py-12 pb-20 fade-in animate-in"
        >
          <Heading level={1} className="mb-1.5 text-2xl">
            Tu simulación preliminar
          </Heading>

          <p className="mb-7 text-sm text-muted-foreground">
            Este es un cálculo estimado con base en la información que
            ingresaste. No es una oferta vinculante.
          </p>

          <Simulation />
        </View>
      </WizardStepShell>
    </RequireDraft>
  );
}
