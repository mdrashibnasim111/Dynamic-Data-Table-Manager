
"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <footer className="px-4 py-4 flex flex-wrap items-center justify-between gap-4 border-t border-border mt-auto">
      <div className="text-xs text-foreground">
        Page <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> of <span className="font-medium">{table.getPageCount()}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="pagination-btn-clay inline-flex items-center justify-center rounded-lg text-xs font-medium h-9 px-3"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="pagination-btn-clay inline-flex items-center justify-center rounded-lg text-xs font-medium h-9 px-3"
        >
          Next
        </Button>
      </div>
    </footer>
  )
}
