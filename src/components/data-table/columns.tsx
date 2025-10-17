
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { User } from "@/lib/data"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          {column.getIsSorted() && <ArrowUp className="ml-2 h-4 w-4" />}
        </div>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
           {column.getIsSorted() && <ArrowUp className="ml-2 h-4 w-4" />}
        </div>
      )
    },
     cell: ({ row }) => <div className="text-slate-600 dark:text-slate-300">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "age",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Age
           {column.getIsSorted() && <ArrowUp className="ml-2 h-4 w-4" />}
        </div>
      )
    },
    cell: ({ row }) => <div className="text-slate-600 dark:text-slate-300">{row.getValue("age")}</div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
           {column.getIsSorted() && <ArrowUp className="ml-2 h-4 w-4" />}
        </div>
      )
    },
    cell: ({ row }) => <div className="text-slate-600 dark:text-slate-300">{row.getValue("role")}</div>,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Gender
           {column.getIsSorted() && <ArrowUp className="ml-2 h-4 w-4" />}
        </div>
      )
    },
    cell: ({ row }) => <div className="text-slate-600 dark:text-slate-300">{row.getValue("gender")}</div>,
    enableHiding: true,
  },
  {
    accessorKey: "city",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          City
           {column.getIsSorted() && <ArrowUp className="ml-2 h-4 w-4" />}
        </div>
      )
    },
    cell: ({ row }) => <div className="text-slate-600 dark:text-slate-300">{row.getValue("city")}</div>,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
  },
]
