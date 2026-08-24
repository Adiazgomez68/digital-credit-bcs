import { View } from "@/components/shared/view";
import { CurrentChannelBadge } from "@/components/wizard/current-channel-badge";
import { RequireDraft } from "@/components/wizard/require-draft";
import { Summary } from "@/components/wizard/summary";
import { WizardStepShell } from "@/components/wizard/step-shell";

export default function SummaryPage() {
  return (
    <RequireDraft>
      <WizardStepShell step="summary" headerContent={<CurrentChannelBadge />}>
        <View size="narrow" className="max-w-170 py-12 pb-20">
          <Summary />
        </View>
      </WizardStepShell>
    </RequireDraft>
  );
}
