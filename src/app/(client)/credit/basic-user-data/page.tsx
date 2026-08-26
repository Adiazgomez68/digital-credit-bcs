import { Heading } from "@/components/shared/heading";
import { View } from "@/components/shared/view";
import { BasicData } from "@/components/wizard/basic-data";
import { CurrentAbandonTrigger } from "@/components/wizard/current-abandon-trigger";
import { CurrentChannelBadge } from "@/components/wizard/current-channel-badge";
import { SaveAndExitLink } from "@/components/wizard/save-and-exit-link";
import { WizardStepShell } from "@/components/wizard/step-shell";

export default function BasicUserDataPage() {
  return (
    <WizardStepShell
      headerContent={
        <>
          <SaveAndExitLink />
          <CurrentAbandonTrigger />
          <CurrentChannelBadge />
        </>
      }
    >
      <View size="narrow" className="max-w-160 py-12 pb-20 fade-in animate-in">
        <Heading level={1} className="mb-1.5 text-2xl">
          Cuéntanos quién eres
        </Heading>

        <p className="mb-8 text-sm text-muted-foreground">
          Estos datos nos permiten identificarte y contactarte sobre tu
          solicitud.
        </p>

        <BasicData />
      </View>
    </WizardStepShell>
  );
}
