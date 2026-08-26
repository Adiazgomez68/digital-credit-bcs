import { View } from "@/components/shared/view";
import { CurrentChannelBadge } from "@/components/wizard/current-channel-badge";
import { RequireDraft } from "@/components/wizard/require-draft";
import { WizardStepShell } from "@/components/wizard/step-shell";
import { Summary } from "@/components/wizard/summary";

export default function SummaryPage() {
  return (
    <RequireDraft>
      <WizardStepShell headerContent={<CurrentChannelBadge />}>
        <View
          size="narrow"
          className="max-w-170 py-12 pb-20 fade-in animate-in"
        >
          <Summary />
        </View>
      </WizardStepShell>
    </RequireDraft>
  );
}
