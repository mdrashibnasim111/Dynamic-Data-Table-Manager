
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
  }
}

interface DataTableProps<TData extends User, TValue> {
  data: TData[]
}

export function DataTable<TData extends User, TValue>({
  data: defaultData,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = React.useState(defaultData)
  const [originalData, setOriginalData] = React.useState(defaultData)

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<VisibilityState>("DataGridProColumnVisibility", {})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columns, setColumns] = React.useState<ColumnDef<TData>[]>(() => defaultColumns as ColumnDef<TData>[])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
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
      }
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
  })

  return (
    <div className="flex-1 flex flex-col">
      <DataTableToolbar 
        table={table}
        setData={(newData) => {
          setData(newData)
          setOriginalData(newData)
        }}
      />
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <Table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <TableHeader className="bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-slate-200 dark:border-slate-700">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
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
              <TableBody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm">
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
      <DataTablePagination table={table} />
    </div>
  )
}
