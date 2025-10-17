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
  getFacetedUniqueValues
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
    editedRows: any
    setEditedRows: React.Dispatch<React.SetStateAction<any>>
    updateData: (rowIndex: number, columnId: string, value: any) => void
    removeRow: (rowIndex: number) => void;
    setData: (data: TData[]) => void
    updateEditedRows: () => void
  }
}

interface DataTableProps<TData, TValue> {
  data: TData[]
}

export function DataTable<TData extends User, TValue>({
  data: defaultData,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = React.useState(defaultData)
  const [originalData, setOriginalData] = React.useState(defaultData)
  const [editedRows, setEditedRows] = React.useState({})

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<VisibilityState>("DataGridProColumnVisibility", {})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columns] = React.useState<ColumnDef<TData>[]>(() => defaultColumns as ColumnDef<TData>[])

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
      editedRows,
      setEditedRows,
      updateData: (rowIndex, columnId, value) => {
        setData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              }
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
      updateEditedRows: () => {
        setOriginalData(data)
        setEditedRows({})
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
  
  const revertData = () => {
    setData(originalData)
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar 
        table={table}
        editedRows={editedRows}
        setEditedRows={setEditedRows}
        revertData={revertData}
        updateData={(newData) => {
            setData(newData)
            setOriginalData(newData)
        }}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
      <DataTablePagination table={table} />
    </div>
  )
}
