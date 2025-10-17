
"use client"

import { Table } from "@tanstack/react-table"
import { FileDown, FileUp, SlidersHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import Papa from "papaparse"
import { saveAs } from "file-saver"
import React from "react"
import { ManageColumns } from "./manage-columns"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  setData: (data: TData[]) => void
}

export function DataTableToolbar<TData>({
  table,
  setData
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

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, "datagrid_pro_export.csv")
    toast({
      title: "Export Complete",
      description: "The data has been exported to a CSV file.",
    })
  }

  return (
    <>
    <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <Input
            placeholder="Search"
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="w-full rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 py-3 pl-10 pr-4 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div className="px-4 pb-4 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => setIsManageColumnsOpen(true)}
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium py-2 px-3 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Manage Columns</span>
        </Button>
        <div className="flex items-center gap-2">
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
               className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium py-2 px-3 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
            >
              <FileUp className="h-4 w-4" />
              <span>Import</span>
            </Button>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleExport}
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium py-2 px-3 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
            >
              <FileDown className="h-4 w-4" />
              <span>Export</span>
            </Button>
        </div>
      </div>
      <ManageColumns 
        isOpen={isManageColumnsOpen} 
        onClose={() => setIsManageColumnsOpen(false)}
        table={table}
        setData={setData}
      />
    </>
  )
}
