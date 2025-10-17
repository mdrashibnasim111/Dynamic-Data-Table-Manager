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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="input-clay w-full rounded-xl py-4 pl-12 pr-6 text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>
      <div className="px-4 pb-4 flex justify-between items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => setIsManageColumnsOpen(true)}
          className="btn-clay flex items-center gap-2 text-sm font-medium py-3 px-5 rounded-xl whitespace-nowrap"
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
               className="btn-clay flex items-center gap-2 text-sm font-medium py-3 px-5 rounded-xl"
            >
              <FileUp className="h-4 w-4" />
              <span>Import</span>
            </Button>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleExport}
                className="btn-clay flex items-center gap-2 text-sm font-medium py-3 px-5 rounded-xl"
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
