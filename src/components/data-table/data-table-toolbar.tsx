
"use client"

import { Table } from "@tanstack/react-table"
import { FileDown, FileUp, SlidersHorizontal, Search, Save, XCircle, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import Papa from "papaparse"
import { saveAs } from "file-saver"
import React from "react"
import { ManageColumns } from "./manage-columns"
import { User } from "@/lib/data"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  setData: (data: TData[]) => void
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  handleSave: () => void
  handleCancel: () => void
}

export function DataTableToolbar<TData>({
  table,
  setData,
  isEditing,
  setIsEditing,
  handleSave,
  handleCancel,
}: DataTableToolbarProps<TData>) {
  const { toast } = useToast()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isManageColumnsOpen, setIsManageColumnsOpen] = React.useState(false)

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setData(results.data as TData[])
          toast({
            title: "Import Successful",
            description: `${results.data.length} rows imported.`,
          })
        },
        error: (error) => {
          toast({
            variant: "destructive",
            title: "Import Failed",
            description: error.message,
          })
        },
      })
    }
  }

  const handleExport = () => {
    const visibleColumns = table.getVisibleLeafColumns().filter(c => c.id !== 'select' && c.id !== 'actions')
    const header = visibleColumns.map(c => c.id)
    const rows = table.getRowModel().rows.map(row => {
        const rowData: { [key: string]: any } = {}
        visibleColumns.forEach(col => {
            rowData[col.id] = (row.original as any)[col.id]
        })
        return rowData
    })
    
    const csv = Papa.unparse({
        fields: header,
        data: rows
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-t;" })
    saveAs(blob, "datagrid_pro_export.csv")
    toast({
      title: "Export Complete",
      description: "The data has been exported to a CSV file.",
    })
  }

  return (
    <>
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search"
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="input-clay w-full rounded-xl py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
      <div className="mb-4 rounded-xl border border-border/50 bg-secondary/40 p-2 dark:border-border/50 dark:bg-background/30">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-between">
          <Button
            variant="ghost"
            onClick={() => setIsManageColumnsOpen(true)}
            className="btn-clay flex-grow sm:flex-grow-0 flex items-center justify-center gap-1.5 text-xs font-medium py-2.5 px-3 rounded-lg whitespace-nowrap"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Manage Columns</span>
          </Button>
          <div className="flex flex-grow sm:flex-grow-0 items-center gap-2 w-full sm:w-auto">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleImport}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                 className="btn-clay flex flex-1 items-center justify-center gap-1.5 text-xs font-medium py-2.5 px-3 rounded-lg"
              >
                <FileUp className="h-4 w-4" />
                <span>Import</span>
              </Button>
              <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleExport}
                  className="btn-clay flex flex-1 items-center justify-center gap-1.5 text-xs font-medium py-2.5 px-3 rounded-lg"
              >
                <FileDown className="h-4 w-4" />
                <span>Export</span>
              </Button>
          </div>
          <div className="flex flex-grow sm:flex-grow-0 items-center gap-2 w-full sm:w-auto">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="btn-clay flex flex-1 items-center justify-center gap-1.5 text-xs font-medium py-2.5 px-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 border-green-500/50 dark:bg-border dark:hover:bg-accent dark:border-accent"
                >
                  <Save className="h-4 w-4" />
                  <span>Save All</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="btn-clay flex flex-1 items-center justify-center gap-1.5 text-xs font-medium py-2.5 px-3 rounded-lg dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:border-red-500/50"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Cancel All</span>
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="btn-clay flex flex-1 items-center justify-center gap-1.5 text-xs font-medium py-2.5 px-3 rounded-lg"
              >
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      <ManageColumns 
        isOpen={isManageColumnsOpen} 
        onClose={() => setIsManageColumnsOpen(false)}
        table={table}
      />
    </>
  )
}
