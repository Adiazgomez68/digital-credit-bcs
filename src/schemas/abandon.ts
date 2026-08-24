import { z } from "zod";

export const ABANDON_REASONS = [
  "Cambié de opinión",
  "El proceso toma demasiado tiempo",
  "Tengo dudas sobre el producto",
  "Prefiero continuar con un asesor",
  "Otro motivo",
] as const;

const OTHER_REASON_INDEX = ABANDON_REASONS.length - 1;

export const abandonSchema = z
  .object({
    reasonIndex: z.number().int().min(0).max(OTHER_REASON_INDEX),
    otherReason: z.string().trim().optional(),
  })
  .refine(
    (data) =>
      data.reasonIndex !== OTHER_REASON_INDEX || !!data.otherReason?.length,
    { message: "Cuéntanos brevemente el motivo.", path: ["otherReason"] },
  );

export type AbandonValues = z.infer<typeof abandonSchema>;

export function resolveAbandonReason(values: AbandonValues): string {
  return values.reasonIndex === OTHER_REASON_INDEX
    ? values.otherReason!.trim()
    : ABANDON_REASONS[values.reasonIndex];
}
