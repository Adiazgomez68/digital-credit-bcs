import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import { TableCard } from "./table-card";
import { TableCell } from "./table-cell";
import { TableCellMono } from "./table-cell-mono";
import { TableHeaderCell } from "./table-header-cell";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  mono?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyState?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  emptyState,
}: Readonly<DataTableProps<T>>) {
  if (data.length === 0 && emptyState) {
    return <TableCard>{emptyState}</TableCard>;
  }

  return (
    <TableCard>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell key={column.key}>
                {column.header}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={rowKey(row)}>
              {columns.map((column) => {
                const Cell = column.mono ? TableCellMono : TableCell;
                return (
                  <Cell key={column.key} className={column.className}>
                    {column.cell(row)}
                  </Cell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableCard>
  );
}
