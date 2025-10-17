
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
  const [value, setValue] = useState(initialValue)
  const { toast } = useToast()

  const tableMeta = table.options.meta;
  const isEditing = tableMeta?.isEditing
  
  const onBlur = () => {
    // In global edit mode, we don't save on blur. Saving is handled by the main "Save" button.
    // We still do validation though.
    if (column.id === 'age' && isNaN(Number(value))) {
        toast({
            variant: "destructive",
            title: "Invalid Input",
            description: "Age must be a number."
        })
        setValue(initialValue) // Revert on invalid input
        return
    }

    if (initialValue !== value) {
        tableMeta?.updateData?.(row.index, column.id, value)
    }
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  
  if (!isEditing) {
    return (
      <div className="w-full h-full min-h-[1.5rem] px-3 py-2 -mx-3 -my-2">
        <span>{value}</span>
      </div>
    )
  }

  return (
    <Input
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      autoFocus={false}
      className="h-8 text-sm bg-transparent border-primary/50"
    />
  )
}
