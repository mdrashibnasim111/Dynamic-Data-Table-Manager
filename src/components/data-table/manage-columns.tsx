
'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, ColumnDef } from '@tanstack/react-table';
import { User } from '@/lib/data';

interface ManageColumnsProps<TData> {
  isOpen: boolean;
  onClose: () => void;
  table: Table<TData>;
  setData: (data: TData[]) => void;
}

export function ManageColumns<TData extends User>({ isOpen, onClose, table }: ManageColumnsProps<TData>) {
  const [newFieldName, setNewFieldName] = useState('');

  const handleAddField = () => {
    if (newFieldName) {
      const newFieldId = newFieldName.toLowerCase().replace(/\s/g, '');
      
      const newColumn: ColumnDef<TData> = {
        accessorKey: newFieldId,
        header: newFieldName,
        cell: ({ row }) => <div>{row.original[newFieldId as keyof User]}</div>,
        enableHiding: true,
      };

      (table.options.meta as any)?.addColumn(newColumn);

      setNewFieldName('');
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="flex flex-col items-stretch bg-background rounded-t-xl max-h-[90vh] shadow-dark-soft-hover" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center py-3" onClick={onClose}>
          <div className="h-1.5 w-10 rounded-full bg-border/50"></div>
        </div>
        <div className="flex items-center border-b border-border/50 px-4 pb-3">
          <h2 className="text-lg font-bold text-foreground text-center flex-1">Manage Columns</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="sticky top-0 bg-background z-10 px-4 py-4">
            <h3 className="text-base font-semibold text-foreground">Columns</h3>
          </div>
          <div className="divide-y divide-border/50">
            {table.getAllLeafColumns().map((column) => {
              return (
                column.getCanHide() && (
                  <div key={column.id} className="flex items-center gap-4 px-4 py-3 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-center rounded-lg bg-secondary shrink-0 size-10 text-secondary-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M170.48,115.7A44,44,0,0,0,140,40H72a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8h80a48,48,0,0,0,18.48-92.3ZM80,56h60a28,28,0,0,1,0,56H80Zm72,136H80V128h72a32,32,0,0,1,0,64Z"></path></svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium capitalize">{column.id.replace(/_/g, ' ')}</p>
                      <p className="text-muted-foreground text-sm">Text</p>
                    </div>
                    <Switch
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      aria-label="Toggle column visibility"
                    />
                  </div>
                )
              )
            })}
          </div>
        </div>
        <div className="px-4 py-4 bg-background border-t border-border/50">
          <div className='flex flex-col gap-2'>
              <Input 
                  placeholder="New Field Name" 
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="input-clay"
              />
              <Button 
                  onClick={handleAddField}
                  className="btn-clay w-full h-12 text-base"
              >
              <span>Add New Field</span>
              </Button>
          </div>
        </div>
        <div className="h-5 bg-background"></div>
      </div>
    </div>
  );
}
