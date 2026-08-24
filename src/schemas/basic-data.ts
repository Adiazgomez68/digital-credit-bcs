import { z } from "zod";

export const DOCUMENT_TYPES = [
  "Cédula de ciudadanía",
  "Cédula de extranjería",
  "Pasaporte",
] as const;

export const CITY_OPTIONS = [
  "Bogotá D.C.",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Otra ciudad",
] as const;

export const basicDataSchema = z.object({
  documentType: z.enum(DOCUMENT_TYPES),
  documentNumber: z
    .string()
    .trim()
    .min(5, "Ingresa un número de documento válido."),
  names: z.string().trim().min(3, "Ingresa tus nombres y apellidos completos."),
  phone: z
    .string()
    .trim()
    .regex(/^\d{7,10}$/, "Ingresa un número de celular válido."),
  email: z.email("Ingresa un correo electrónico válido."),
  city: z.string().trim().optional(),
});

export type BasicDataValues = z.infer<typeof basicDataSchema>;
