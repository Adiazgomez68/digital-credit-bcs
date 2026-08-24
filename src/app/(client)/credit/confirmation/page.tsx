import { Header } from "@/components/layout/header";
import { View } from "@/components/shared/view";
import { Confirmation } from "@/components/wizard/confirmation";
import { RequireDraft } from "@/components/wizard/require-draft";

export default function ConfirmationPage() {
  return (
    <RequireDraft>
      <Header />

      <View size="narrow" className="max-w-140 py-20">
        <Confirmation />
      </View>
    </RequireDraft>
  );
}
