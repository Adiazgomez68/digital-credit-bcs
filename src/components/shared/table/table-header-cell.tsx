import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function TableHeaderCell({
  className,
  ...props
}: Readonly<React.ComponentProps<typeof TableHead>>) {
  return (
    <TableHead
      className={cn(
        "h-auto bg-secondary py-3.5 text-xs font-semibold tracking-wide text-text-faint uppercase",
        className,
      )}
      {...props}
    />
  );
}
