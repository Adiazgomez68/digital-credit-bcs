import { z } from "zod";

import { formatCurrency } from "@/lib/format";

export const AMOUNT_MIN = 1_000_000;
export const AMOUNT_MAX = 50_000_000;
export const DEFAULT_AMOUNT = 12_000_000;
export const DEFAULT_TERM_MONTHS = 24;
export const TERM_OPTIONS_MONTHS = [12, 24, 36, 48, 60] as const;

const REFERENCE_MONTHLY_RATE = 0.0152;

export const simulatorSchema = z.object({
  amount: z
    .number("Ingresa un monto válido.")
    .min(AMOUNT_MIN, `El monto mínimo es ${formatCurrency(AMOUNT_MIN)}.`)
    .max(AMOUNT_MAX, `El monto máximo es ${formatCurrency(AMOUNT_MAX)}.`),
  termMonths: z.number(),
});

export type SimulatorValues = z.infer<typeof simulatorSchema>;

export interface SimulationResult extends SimulatorValues {
  estimatedFee: number;
}

export function estimateMonthlyFee(amount: number, termMonths: number): number {
  return (
    (amount * REFERENCE_MONTHLY_RATE) /
    (1 - (1 + REFERENCE_MONTHLY_RATE) ** -termMonths)
  );
}
