import type { Channel } from "@/types/application";

const COP_FORMATTER = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const THOUSANDS_FORMATTER = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return COP_FORMATTER.format(amount);
}

// Thousands separators only, no currency symbol — pairs with a visual $ prefix.
export function formatThousands(value: number): string {
  return Number.isFinite(value) ? THOUSANDS_FORMATTER.format(value) : "";
}

// Inverse of formatThousands.
export function parseThousands(value: string): number {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly === "" ? Number.NaN : Number(digitsOnly);
}

export function formatDateTime(isoDate: string): string {
  return DATE_TIME_FORMATTER.format(new Date(isoDate));
}

export function formatChannelLabel(
  channel: Channel,
  advisorId?: string,
): string {
  if (channel === "assisted") {
    return advisorId ? `Asistido · Asesor ${advisorId}` : "Asistido";
  }

  return "Autogestionado";
}
