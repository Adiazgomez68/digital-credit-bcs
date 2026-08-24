import { cn } from "@/lib/utils";

type ViewSize = "narrow" | "form" | "wide";

// Tailwind's own max-w-* scale, not raw pixels: xl≈560, 2xl≈680, 6xl≈1160.
const SIZE_MAX_WIDTH: Record<ViewSize, string> = {
  narrow: "max-w-xl",
  form: "max-w-2xl",
  wide: "max-w-6xl",
};

interface ViewProps {
  size?: ViewSize;
  className?: string;
  children: React.ReactNode;
}

// Keeps the same centered max-width + padding across every screen; only the
// width tier changes (a form step vs. a table/dashboard vs. a confirmation).
export function View({
  size = "form",
  className,
  children,
}: Readonly<ViewProps>) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-10 py-12",
        SIZE_MAX_WIDTH[size],
        className,
      )}
    >
      {children}
    </div>
  );
}
