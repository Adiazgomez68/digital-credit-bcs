import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function TableCellMono({
  className,
  ...props
}: React.ComponentProps<typeof TableCell>) {
  return (
    <TableCell
      className={cn(
        "py-4 font-mono text-xs font-semibold text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
