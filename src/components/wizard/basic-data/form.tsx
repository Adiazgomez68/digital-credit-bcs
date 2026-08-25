"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WizardBackLink } from "@/components/wizard/back-link";
import { useSaveAndExitRegistration } from "@/components/wizard/save-and-exit-context";
import {
  useCreateApplication,
  useUpdateApplication,
} from "@/hooks/use-aplication";
import { useApplicationStore } from "@/providers/application-store-provider";
import { WEB_ROUTES } from "@/routes/web";
import {
  basicDataSchema,
  CITY_OPTIONS,
  DOCUMENT_TYPES,
  type BasicDataValues,
} from "@/schemas/basic-data";
import type { Application } from "@/types/application";

interface BasicDataFormProps {
  application?: Application;
}

export function BasicDataForm({ application }: Readonly<BasicDataFormProps>) {
  const router = useRouter();
  const channel = useApplicationStore((store) => store.channel);
  const advisorId = useApplicationStore((store) => store.advisorId);
  const setApplicationId = useApplicationStore(
    (store) => store.setApplicationId,
  );
  const setChannel = useApplicationStore((store) => store.setChannel);
  const createApplicationMutation = useCreateApplication();
  const updateApplicationMutation = useUpdateApplication();

  const isEditing = Boolean(application);

  const form = useForm<BasicDataValues>({
    resolver: zodResolver(basicDataSchema),
    mode: "onBlur",
    values: {
      documentType:
        (application?.document.type as (typeof DOCUMENT_TYPES)[number]) ??
        DOCUMENT_TYPES[0],
      documentNumber: application?.document.number ?? "",
      names: application?.names ?? "",
      phone: application?.phone ?? "",
      email: application?.email ?? "",
      city:
        (application?.city as (typeof CITY_OPTIONS)[number]) ?? CITY_OPTIONS[0],
    },
  });

  // Partial save for "Guardar y salir" — only meaningful once the application exists.
  const saveOnExit = useCallback(() => {
    if (!application) return;
    const values = form.getValues();

    updateApplicationMutation.mutate({
      id: application.id,
      payload: {
        names: values.names,
        phone: values.phone,
        email: values.email,
        city: values.city,
      },
      actor: "client",
    });
  }, [application, form, updateApplicationMutation]);

  useSaveAndExitRegistration(saveOnExit);

  function onSubmit(values: BasicDataValues) {
    if (application) {
      updateApplicationMutation.mutate(
        {
          id: application.id,
          payload: {
            names: values.names,
            phone: values.phone,
            email: values.email,
            city: values.city,
          },
          actor: "client",
        },
        {
          onSuccess: () => {
            router.push(WEB_ROUTES.CLIENT.CREDIT.SUPPLEMENTARY_DATA);
          },
        },
      );
      return;
    }

    if (!channel) {
      router.push(WEB_ROUTES.CLIENT.CREDIT.CHANNEL);
      return;
    }

    createApplicationMutation.mutate(
      {
        channel,
        advisorId,
        document: { type: values.documentType, number: values.documentNumber },
        names: values.names,
        phone: values.phone,
        email: values.email,
        city: values.city,
      },
      {
        onSuccess: ({ application: created, isExistingDraft }) => {
          setApplicationId(created.id);
          setChannel(created.channel, created.advisorId);

          if (isExistingDraft) {
            router.push(`${created.resumeRoute}?resumed=1`);
            return;
          }

          router.push(WEB_ROUTES.CLIENT.CREDIT.SUPPLEMENTARY_DATA);
        },
      },
    );
  }

  const isSubmitting =
    createApplicationMutation.isPending || updateApplicationMutation.isPending;
  const hasSubmitError =
    createApplicationMutation.isError || updateApplicationMutation.isError;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-7"
    >
      <Card>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[1fr_1.4fr]">
              <Controller
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Tipo de documento
                    </FieldLabel>

                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isEditing}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {DOCUMENT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="documentNumber"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Número de documento *
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Ej. 1017234567"
                      aria-invalid={fieldState.invalid}
                      disabled={isEditing}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {isEditing && (
              <FieldDescription className="-mt-2 text-xs">
                El tipo y número de documento no se pueden modificar una vez
                creada la solicitud.
              </FieldDescription>
            )}

            <Controller
              control={form.control}
              name="names"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Nombres y apellidos completos *
                  </FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Como aparece en tu documento"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Celular *</FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      type="tel"
                      placeholder="Ej. 3001234567"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Correo electrónico *
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      placeholder="example@correo.com"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      <FieldDescription>
                        Aquí enviaremos el resumen y las notificaciones de tu
                        solicitud.
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="city"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Ciudad de residencia
                  </FieldLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id={field.name}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CITY_OPTIONS.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      {hasSubmitError && (
        <p className="text-sm text-destructive">
          No pudimos guardar tus datos. Verifica tu conexión e intenta de nuevo.
        </p>
      )}

      <div className="flex items-center justify-between">
        <WizardBackLink step="channel">← Atrás</WizardBackLink>

        <Button type="submit" size="lg" loading={isSubmitting}>
          Continuar
        </Button>
      </div>
    </form>
  );
}
