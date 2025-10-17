
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
    <div className="px-4 py-6 flex items-center justify-between border-t border-border mt-auto">
      <div className="text-sm text-foreground">
        Page <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> of <span className="font-medium">{table.getPageCount()}</span>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="pagination-btn-clay inline-flex items-center justify-center rounded-xl text-sm font-medium h-10 px-4"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="pagination-btn-clay inline-flex items-center justify-center rounded-xl text-sm font-medium h-10 px-4"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
