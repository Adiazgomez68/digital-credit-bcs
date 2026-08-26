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
import { formatCurrency, formatThousands, parseThousands } from "@/lib/format";

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
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-5 animate-in fade-in"
    >
      <FieldGroup>
        <Controller
          control={control}
          name="amount"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Monto que necesitas</FieldLabel>

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
                  aria-invalid={fieldState.invalid}
                />
              </div>

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
