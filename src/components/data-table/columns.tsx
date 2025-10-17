
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import { User } from "@/lib/data"
import { DataTableRowActions } from "./data-table-row-actions"

const SortableHeader = ({ column, title }: { column: any, title: string }) => (
  <div
    className="flex items-center gap-1 cursor-pointer"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {title}
    {column.getIsSorted() === 'desc' ? (
      <ArrowDown className="ml-2 h-4 w-4" />
    ) : column.getIsSorted() === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4 sort-icon" />
    )}
  </div>
);


export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
    cell: ({ row }) => <div className="font-medium text-sm">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableHeader column={column} title="Email" />,
     cell: ({ row }) => <div className="text-xs">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "age",
    header: ({ column }) => <SortableHeader column={column} title="Age" />,
    cell: ({ row }) => <div className="text-xs">{row.getValue("age")}</div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <SortableHeader column={column} title="Role" />,
    cell: ({ row }) => <div className="text-xs">{row.getValue("role")}</div>,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => <SortableHeader column={column} title="Gender" />,
    cell: ({ row }) => <div className="text-xs">{row.getValue("gender")}</div>,
    enableHiding: true,
  },
  {
    accessorKey: "city",
    header: ({ column }) => <SortableHeader column={column} title="City" />,
    cell: ({ row }) => <div className="text-xs">{row.getValue("city")}</div>,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
  },
]
