import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ChannelOptionCardProps {
  selected: boolean;
  icon: LucideIcon;
  title: string;
  description: string;
  onSelect: () => void;
  children?: React.ReactNode;
}

export function ChannelOptionCard({
  selected,
  icon: Icon,
  title,
  description,
  onSelect,
  children,
}: Readonly<ChannelOptionCardProps>) {
  return (
    <div
      className={cn(
        "rounded-xl border-[1.5px] border-border bg-card p-6 transition-colors",
        selected && "border-primary bg-accent",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full cursor-pointer items-start gap-4 text-left"
      >
        <span
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-border",
            selected && "border-primary",
          )}
        >
          {selected && <span className="size-2.5 rounded-full bg-primary" />}
        </span>

        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary",
            selected && "bg-card",
          )}
        >
          <Icon className="size-5" />
        </span>

        <span className="flex-1">
          <span className="block text-base font-semibold">{title}</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            {description}
          </span>
        </span>
      </button>

      {selected && children}
    </div>
  );
}
