"use client"

import React, { useEffect, useState } from 'react'
import { CellContext } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { User } from '@/lib/data'

export const EditableCell = ({
  getValue,
  row,
  column,
  table,
}: CellContext<User, unknown>) => {
  const initialValue = getValue() as string | number
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue)
  const { toast } = useToast()

  const { updateData, editedRows, setEditedRows } = table.options.meta || {}
  
  const onBlur = () => {
    setIsEditing(false)
    if (initialValue === value) return

    // Validation
    if (column.id === 'age' && isNaN(Number(value))) {
        toast({
            variant: "destructive",
            title: "Invalid Input",
            description: "Age must be a number."
        })
        setValue(initialValue)
        return
    }

    if (updateData && setEditedRows) {
        updateData(row.index, column.id, value)
        setEditedRows({
            ...editedRows,
            [row.id]: { ...editedRows?.[row.id], [column.id]: value }
        })
    }
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  return isEditing ? (
    <Input
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      autoFocus
      className="h-8 text-sm"
    />
  ) : (
    <div
      onDoubleClick={handleDoubleClick}
      className="w-full h-full min-h-[1.5rem] px-3 py-2 -mx-3 -my-2"
    >
      <span>{value}</span>
    </div>
  )
}
