"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useApplicationStore } from "@/providers/application-store-provider";
import { WEB_ROUTES } from "@/routes/web";
import { channelSchema, type ChannelValues } from "@/schemas/channel";

import { ChannelOptionCard } from "./option-card";

export function ChannelForm() {
  const router = useRouter();
  const setChannel = useApplicationStore((store) => store.setChannel);

  const form = useForm<ChannelValues>({
    resolver: zodResolver(channelSchema),
    defaultValues: { channel: "unassisted", advisorId: "" },
  });

  function onSubmit(values: ChannelValues) {
    setChannel(values.channel, values.advisorId);
    router.push(WEB_ROUTES.CLIENT.CREDIT.BASIC_DATA);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-10"
    >
      <Controller
        control={form.control}
        name="channel"
        render={({ field }) => (
          <div className="flex flex-col gap-4">
            <ChannelOptionCard
              selected={field.value === "unassisted"}
              icon={Smartphone}
              title="Autogestionado"
              description="Completas toda la solicitud por tu cuenta, a tu ritmo, desde cualquier dispositivo."
              onSelect={() => field.onChange("unassisted")}
            />

            <ChannelOptionCard
              selected={field.value === "assisted"}
              icon={MessageSquare}
              title="Asistido por un asesor"
              description="Un asesor te acompaña durante el proceso. La solicitud queda asociada a su gestión."
              onSelect={() => field.onChange("assisted")}
            >
              <Controller
                control={form.control}
                name="advisorId"
                render={({ field: advisorField, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="mt-4 border-t border-border pt-4"
                  >
                    <FieldLabel htmlFor={advisorField.name}>
                      Identificador del asesor
                    </FieldLabel>

                    <Input
                      {...advisorField}
                      id={advisorField.name}
                      placeholder="Ej. ASE-4471"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </ChannelOptionCard>
          </div>
        )}
      />

      <div className="flex items-center justify-between">
        <Link
          href={WEB_ROUTES.CLIENT.HOME}
          className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
        >
          ← Volver
        </Link>

        <Button type="submit" size="lg">
          Continuar
        </Button>
      </div>
    </form>
  );
}
