import { Suspense } from "react";

import { Heading } from "@/components/shared/heading";
import { View } from "@/components/shared/view";
import { CurrentAbandonTrigger } from "@/components/wizard/current-abandon-trigger";
import { CurrentChannelBadge } from "@/components/wizard/current-channel-badge";
import { RequireDraft } from "@/components/wizard/require-draft";
import { ResumedNotice } from "@/components/wizard/resumed-notice";
import { SaveAndExitLink } from "@/components/wizard/save-and-exit-link";
import { WizardStepShell } from "@/components/wizard/step-shell";
import { SupplementaryData } from "@/components/wizard/supplementary-data";

export default function SupplementaryUserDataPage() {
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
            Cuéntanos tu situación financiera
          </Heading>

          <p className="mb-8 text-sm text-muted-foreground">
            Esta información nos permite calcular una simulación ajustada a tu
            capacidad de pago.
          </p>

          <Suspense fallback={null}>
            <ResumedNotice />
          </Suspense>

          <SupplementaryData />
        </View>
      </WizardStepShell>
    </RequireDraft>
  );
}
