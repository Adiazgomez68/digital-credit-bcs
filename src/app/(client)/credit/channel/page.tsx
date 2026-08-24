import { Header } from "@/components/layout/header";
import { Heading } from "@/components/shared/heading";
import { View } from "@/components/shared/view";
import { ChannelForm } from "@/components/wizard/channel";
import { ResumePrompt } from "@/components/wizard/channel/resume-prompt";

export default function ChannelPage() {
  return (
    <>
      <Header />

      <ResumePrompt />

      <View size="narrow" className="max-w-190 py-16">
        <span className="mb-2.5 block text-xs font-semibold tracking-wide text-primary uppercase">
          Paso previo
        </span>

        <Heading level={1} className="mb-2.5">
          ¿Cómo quieres continuar tu solicitud?
        </Heading>

        <p className="mb-9 max-w-prose text-sm text-muted-foreground">
          Elige el canal de atención. Si un asesor te está acompañando,
          selecciona la segunda opción para asociar la solicitud a su gestión.
        </p>

        <ChannelForm />
      </View>
    </>
  );
}
