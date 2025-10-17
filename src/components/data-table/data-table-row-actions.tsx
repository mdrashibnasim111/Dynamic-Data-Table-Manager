
"use client"

import { Row } from "@tanstack/react-table"
import { Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import React from "react"
import { User } from "@/lib/data"
import { EditRow } from "./edit-row"

interface DataTableRowActionsProps<TData extends User> {
  row: Row<TData>
}

export function DataTableRowActions<TData extends User>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { toast } = useToast()
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)

  const handleDelete = () => {
    const meta = row.table.options.meta as any
    meta?.removeRow(row.index)
    toast({
      title: "Row deleted",
      description: "The row has been successfully deleted.",
    })
  }

  const handleSave = (updatedUser: User) => {
    const meta = row.table.options.meta as any
    meta?.updateData(row.index, updatedUser)
    setIsEditDialogOpen(false)
    toast({
        title: "Row Saved",
        description: "The changes to the row have been saved.",
    })
  }
  
  return (
    <div className="whitespace-nowrap text-right text-sm font-medium">
       <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80 ml-2 h-8 w-8" onClick={() => setIsEditDialogOpen(true)}>
        <Edit className="h-5 w-5" />
        <span className="sr-only">Edit</span>
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400 ml-2 h-8 w-8 dark:text-red-400 dark:hover:text-red-300">
            <Trash2 className="h-5 w-5" />
            <span className="sr-only">Delete</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              row and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditRow 
        user={row.original}
        isOpen={isEditDialogOpen}
        onSave={handleSave}
        onCancel={() => setIsEditDialogOpen(false)}
      />
    </div>
  )
}

