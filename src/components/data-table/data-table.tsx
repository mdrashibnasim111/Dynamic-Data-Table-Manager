
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
import { useToast } from "@/hooks/use-toast"

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
    removeRow: (rowIndex: number) => void;
    setData: (data: TData[]) => void
    addColumn: (column: ColumnDef<TData>) => void
    isEditing: boolean
  }
}

interface DataTableProps<TData extends User, TValue> {
  data: TData[]
}

export function DataTable<TData extends User, TValue>({
  data: defaultData,
}: DataTableProps<TData, TValue>) {
  const { toast } = useToast()
  const [data, setData] = React.useState(defaultData)
  const [originalData, setOriginalData] = React.useState(defaultData)
  const [isMounted, setIsMounted] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false)

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

  const handleSave = () => {
    setOriginalData(data)
    setIsEditing(false)
    toast({
      title: "Changes Saved",
      description: "All your changes have been saved successfully.",
    })
  }

  const handleCancel = () => {
    setData(originalData)
    setIsEditing(false)
    toast({
      title: "Changes Canceled",
      description: "All changes have been discarded.",
      variant: "destructive",
    })
  }

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
      isEditing,
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
    <div className="flex-1 flex flex-col min-h-0 space-y-4">
        <DataTableToolbar 
          table={table}
          setData={(newData) => {
            setData(newData)
            setOriginalData(newData)
          }}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleSave={handleSave}
          handleCancel={handleCancel}
        />
      <div className="table-clay rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[720px]">
            <TableHeader className="bg-secondary/70 dark:bg-dark-surface-light backdrop-blur-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-border dark:border-dark-border">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground dark:text-dark-text-secondary uppercase tracking-wider whitespace-nowrap">
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
      <DataTablePagination table={table} />
    </div>
  )
}
