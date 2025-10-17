"use client"

import { Table } from "@tanstack/react-table"
import { FileDown, FileUp, Save, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { useToast } from "@/hooks/use-toast"
import Papa from "papaparse"
import { saveAs } from "file-saver"
import React from "react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  editedRows: any
  setEditedRows: (editedRows: any) => void
  revertData: () => void
  updateData: (data: TData[]) => void
}

export function DataTableToolbar<TData>({
  table,
  editedRows,
  setEditedRows,
  revertData,
  updateData
}: DataTableToolbarProps<TData>) {
  const { toast } = useToast()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // In a real app, you'd want to validate this data with something like Zod
          const meta = table.options.meta as any
          meta?.setData(results.data as TData[])
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

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, "datagrid_pro_export.csv")
    toast({
      title: "Export Complete",
      description: "The data has been exported to a CSV file.",
    })
  }

  const handleSave = () => {
    const meta = table.options.meta as any;
    meta?.updateEditedRows()
    toast({
        title: "Changes Saved",
        description: "Your edits have been successfully saved.",
        className: "bg-accent text-accent-foreground border-accent"
    })
  }

  const handleCancel = () => {
    revertData()
    setEditedRows({})
    toast({
        title: "Changes Canceled",
        description: "Your edits have been discarded.",
    })
  }

  const hasEdits = Object.keys(editedRows).length > 0;

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2 flex-1">
        <div className="relative w-full max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">search</span>
          <Input
            placeholder="Search"
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="w-full rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 py-3 pl-10 pr-4 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {hasEdits && (
            <>
                <Button onClick={handleSave} size="sm" variant="secondary" className="bg-primary text-white">
                    <Save className="mr-2 h-4 w-4" /> Save All
                </Button>
                <Button onClick={handleCancel} size="sm" variant="ghost">
                    <XCircle className="mr-2 h-4 w-4" /> Cancel All
                </Button>
            </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv"
          onChange={handleImport}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileUp className="mr-2 h-4 w-4" /> Import
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <FileDown className="mr-2 h-4 w-4" /> Export
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
