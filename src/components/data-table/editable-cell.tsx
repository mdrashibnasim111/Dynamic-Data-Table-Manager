
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
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  const tableMeta = table.options.meta;
  
  const onBlur = () => {
    setIsEditing(false)
    
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
        toast({
            title: "Cell Updated",
            description: "The cell has been successfully updated.",
        })
    }
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  
  if (!isEditing) {
    return (
      <div 
        onDoubleClick={handleDoubleClick} 
        className="w-full h-full min-h-[1.5rem] px-3 py-2 -mx-3 -my-2 cursor-pointer"
        title="Double-click to edit"
      >
        <span>{value}</span>
      </div>
    )
  }

  return (
    <Input
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      autoFocus
      className="h-8 text-sm bg-transparent border-primary/50"
    />
  )
}
