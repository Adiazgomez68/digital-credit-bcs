"use client";

import { useSearchParams } from "next/navigation";

export function ResumedNotice() {
  const searchParams = useSearchParams();

  if (searchParams.get("resumed") !== "1") return null;

  return (
    <div className="mb-6 rounded-lg bg-accent px-4 py-3 text-sm text-accent-foreground">
      Encontramos una solicitud en curso con este documento. Continuamos desde
      donde quedaste.
    </div>
  );
}
