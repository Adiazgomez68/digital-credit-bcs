import { z } from "zod";

// Producto único de libre destino — no hay otra opción real que elegir.
export const LOAN_PURPOSES = ["Libre destino"] as const;

export const TERM_OPTIONS_MONTHS = [12, 24, 36, 48] as const;

export const supplementaryDataSchema = z.object({
  income: z
    .number("Ingresa un valor válido.")
    .min(1, "Ingresa tus ingresos mensuales."),
  expenses: z
    .number("Ingresa un valor válido.")
    .min(0, "Ingresa tus egresos mensuales."),
  amountRequested: z
    .number("Ingresa un valor válido.")
    .min(1_000_000, "El monto mínimo a solicitar es $1.000.000."),
  termMonths: z.number(),
  loanPurpose: z.enum(LOAN_PURPOSES),
  privacyPolicy: z.boolean().refine((value) => value === true, {
    message: "Debes autorizar el tratamiento de tus datos personales.",
  }),
});

export type SupplementaryDataValues = z.infer<typeof supplementaryDataSchema>;
