import { Controller, type Control } from "react-hook-form";

import { Button } from "@/components/ui/button";
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
import { formatCurrency } from "@/lib/format";

import {
  AMOUNT_MAX,
  AMOUNT_MIN,
  TERM_OPTIONS_MONTHS,
  type SimulatorValues,
} from "./schema";

interface SimulatorFormProps {
  control: Control<SimulatorValues>;
  onSubmit: React.SubmitEventHandler<HTMLFormElement>;
}

export function SimulatorForm({
  control,
  onSubmit,
}: Readonly<SimulatorFormProps>) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <FieldGroup>
        <Controller
          control={control}
          name="amount"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Monto que necesitas</FieldLabel>

              <Input
                id={field.name}
                name={field.name}
                type="number"
                inputMode="numeric"
                step={100_000}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(event.target.valueAsNumber)}
                aria-invalid={fieldState.invalid}
              />

              <FieldDescription className="text-xs">
                Montos disponibles entre {formatCurrency(AMOUNT_MIN)} y{" "}
                {formatCurrency(AMOUNT_MAX)}.
              </FieldDescription>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={control}
          name="termMonths"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Plazo</FieldLabel>

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
      </FieldGroup>

      <Button type="submit" size="lg">
        Simular
      </Button>

      <p className="text-xs text-muted-foreground">
        Valor estimado con tasa de referencia, sin consultar tu perfil. No
        constituye una oferta vinculante.
      </p>
    </form>
  );
}
