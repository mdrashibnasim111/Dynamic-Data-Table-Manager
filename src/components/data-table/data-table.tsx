
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  RowData,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { columns as defaultColumns } from "./columns"
import { User } from "@/lib/data"

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, data: TData) => void
    removeRow: (rowIndex: number) => void;
    setData: (data: TData[]) => void
    addColumn: (column: ColumnDef<TData>) => void
    hideRows: (rowIds: string[]) => void
    showAllRows: () => void
  }
}

interface DataTableProps<TData extends User, TValue> {
  data: TData[]
}

export function DataTable<TData extends User, TValue>({
  data: defaultData,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = React.useState(defaultData)
  const [hiddenRowsData, setHiddenRowsData] = React.useState<TData[]>([])
  const [originalData, setOriginalData] = React.useState(defaultData)
  const [isMounted, setIsMounted] = React.useState(false);

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<VisibilityState>("DataGridProColumnVisibility", {})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columns, setColumns] = React.useState<ColumnDef<TData>[]>(() => defaultColumns as ColumnDef<TData>[])

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility: isMounted ? columnVisibility : {},
      rowSelection,
      columnFilters,
      globalFilter,
    },
    meta: {
      updateData: (rowIndex, updatedRow) => {
        setData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return updatedRow;
            }
            return row
          })
        )
        setOriginalData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return updatedRow;
            }
            return row
          })
        )
      },
      removeRow: (rowIndex: number) => {
        const newData = [...data]
        newData.splice(rowIndex, 1)
        setData(newData)
        setOriginalData(newData)
      },
      setData: (newData: TData[]) => {
        setData(newData)
        setOriginalData(newData)
      },
      addColumn: (newColumnDef: ColumnDef<TData>) => {
        const newColumn: ColumnDef<TData> = {
          ...newColumnDef,
          cell: ({ row }) => <div>{row.original[newColumnDef.accessorKey as keyof User]}</div>
        };
        setColumns(prev => [...prev.slice(0, -1), newColumn, prev.slice(-1)[0]])
      },
      hideRows: (rowIds: string[]) => {
        const rowsToHide = data.filter(row => rowIds.includes(row.id));
        setHiddenRowsData(prev => [...prev, ...rowsToHide]);
        setData(prev => prev.filter(row => !rowIds.includes(row.id)));
        table.resetRowSelection();
      },
      showAllRows: () => {
        setData(prev => [...prev, ...hiddenRowsData]);
        setHiddenRowsData([]);
      },
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: "includesString",
    getRowId: (row) => row.id,
  })

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-4">
        <DataTableToolbar 
          table={table}
          setData={(newData) => {
            setData(newData)
            setOriginalData(newData)
          }}
          showAllRowsVisible={hiddenRowsData.length > 0}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="px-4">
          <div className="table-clay">
            <div className="overflow-auto rounded-lg">
              <Table className="min-w-full divide-y divide-border">
                <TableHeader className="bg-secondary/70 dark:bg-dark-surface-light backdrop-blur-sm">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border-border dark:border-dark-border">
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground dark:text-dark-text-secondary uppercase tracking-wider">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="divide-y divide-border/50 dark:divide-dark-border bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm">
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:bg-accent/50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-foreground dark:text-dark-text-primary">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
