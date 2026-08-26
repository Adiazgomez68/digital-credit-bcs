"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
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
import { useUpdateApplication } from "@/hooks/use-aplication";
import { formatThousands, parseThousands } from "@/lib/format";
import { WEB_ROUTES } from "@/routes/web";
import {
  LOAN_PURPOSES,
  supplementaryDataSchema,
  TERM_OPTIONS_MONTHS,
  type SupplementaryDataValues,
} from "@/schemas/supplementary-data";
import type { Application } from "@/types/application";

interface SupplementaryDataFormProps {
  application: Application;
}

export function SupplementaryDataForm({
  application,
}: Readonly<SupplementaryDataFormProps>) {
  const router = useRouter();
  const updateMutation = useUpdateApplication();

  const form = useForm<SupplementaryDataValues>({
    resolver: zodResolver(supplementaryDataSchema),
    values: {
      income: application.income ?? Number.NaN,
      expenses: application.expenses ?? Number.NaN,
      amountRequested: application.amountRequested ?? Number.NaN,
      termMonths: application.termMonths ?? TERM_OPTIONS_MONTHS[0],
      loanPurpose:
        (application.loanPurpose as (typeof LOAN_PURPOSES)[number]) ??
        LOAN_PURPOSES[0],
      privacyPolicy: application.privacyPolicy ?? false,
    },
  });

  // Partial save for "Guardar y salir" — skips full validation on purpose.
  const saveOnExit = useCallback(() => {
    const values = form.getValues();

    updateMutation.mutate({
      id: application.id,
      payload: {
        income: Number.isFinite(values.income) ? values.income : 0,
        expenses: Number.isFinite(values.expenses) ? values.expenses : 0,
        amountRequested: Number.isFinite(values.amountRequested)
          ? values.amountRequested
          : 0,
        termMonths: values.termMonths,
        loanPurpose: values.loanPurpose,
        privacyPolicy: values.privacyPolicy,
      },
      actor: "client",
    });
  }, [application.id, form, updateMutation]);

  useSaveAndExitRegistration(saveOnExit);

  function onSubmit(values: SupplementaryDataValues) {
    updateMutation.mutate(
      {
        id: application.id,
        payload: {
          ...values,
          resumeRoute: WEB_ROUTES.CLIENT.CREDIT.SIMULATION,
        },
        actor: "client",
      },
      {
        onSuccess: () => {
          router.push(WEB_ROUTES.CLIENT.CREDIT.SIMULATION);
        },
      },
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-7"
    >
      <Card>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="income"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Ingresos mensuales *
                    </FieldLabel>

                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted-foreground">
                        $
                      </span>

                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        className="pl-8"
                        value={formatThousands(field.value)}
                        onBlur={field.onBlur}
                        onChange={(event) =>
                          field.onChange(parseThousands(event.target.value))
                        }
                        placeholder="0"
                        aria-invalid={fieldState.invalid}
                      />
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="expenses"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Egresos mensuales *
                    </FieldLabel>

                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted-foreground">
                        $
                      </span>

                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        className="pl-8"
                        value={formatThousands(field.value)}
                        onBlur={field.onBlur}
                        onChange={(event) =>
                          field.onChange(parseThousands(event.target.value))
                        }
                        placeholder="0"
                        aria-invalid={fieldState.invalid}
                      />
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="amountRequested"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Valor solicitado *
                    </FieldLabel>

                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted-foreground">
                        $
                      </span>

                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        className="pl-8"
                        value={formatThousands(field.value)}
                        onBlur={field.onBlur}
                        onChange={(event) =>
                          field.onChange(parseThousands(event.target.value))
                        }
                        placeholder="0"
                        aria-invalid={fieldState.invalid}
                      />
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="termMonths"
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Plazo deseado *
                    </FieldLabel>

                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue>
                          {(value: string) => `${value} meses`}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        {TERM_OPTIONS_MONTHS.map((months) => (
                          <SelectItem key={months} value={String(months)}>
                            {months} meses
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="loanPurpose"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Destino del crédito *
                  </FieldLabel>

                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {LOAN_PURPOSES.map((purpose) => (
                        <SelectItem key={purpose} value={purpose}>
                          {purpose}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FieldDescription className="text-xs">
                    Este crédito es de libre destino, así que no necesitas
                    elegir un uso específico.
                  </FieldDescription>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="privacyPolicy"
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                  className="rounded-lg bg-secondary p-4"
                >
                  <Checkbox
                    id={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />

                  <FieldContent>
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-sm font-normal text-muted-foreground"
                    >
                      Autorizo el tratamiento de mis datos personales conforme a
                      la Ley 1581 de 2012, para efectos de evaluación,
                      simulación y seguimiento de esta solicitud.
                    </FieldLabel>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      {updateMutation.isError && (
        <p className="text-sm text-destructive">
          No pudimos guardar tus datos. Verifica tu conexión e intenta de nuevo.
        </p>
      )}

      <div className="flex items-center justify-between">
        <WizardBackLink step="basic_data">← Atrás</WizardBackLink>

        <Button type="submit" size="lg" loading={updateMutation.isPending}>
          Continuar a la simulación
        </Button>
      </div>
    </form>
  );
}
