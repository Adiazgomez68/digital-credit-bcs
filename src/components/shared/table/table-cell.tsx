import { TableCell as BaseTableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function TableCell({
  className,
  ...props
}: React.ComponentProps<typeof BaseTableCell>) {
  return <BaseTableCell className={cn("py-4 text-sm", className)} {...props} />;
}
