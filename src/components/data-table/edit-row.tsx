
'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/lib/data';
import { X } from 'lucide-react';

interface EditRowProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function EditRow({ user, onSave, onCancel, isOpen }: EditRowProps) {
  const [editedUser, setEditedUser] = useState<User>(user);
  const [errors, setErrors] = useState<{ age?: string }>({});

  React.useEffect(() => {
    setEditedUser(user)
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (isNaN(Number(editedUser.age))) {
      setErrors({ age: 'Age must be a numeric value.' });
      return;
    }
    onSave({ ...editedUser, age: Number(editedUser.age) });
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-background rounded-xl shadow-lg w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col h-full">
          <header className="p-4 flex items-center justify-between border-b border-border">
            <h1 className="text-lg font-bold text-foreground">Edit Row</h1>
            <Button variant="ghost" size="icon" onClick={onCancel} className="text-muted-foreground">
              <X className="h-5 w-5" />
            </Button>
          </header>
          <main className="px-4 py-6 flex-grow overflow-y-auto">
            <form className="space-y-6">
              {Object.keys(user).map((key) => {
                if (key === 'id') return null;

                const label = key.charAt(0).toUpperCase() + key.slice(1);
                
                return (
                  <div key={key}>
                    <Label htmlFor={key} className="block text-sm font-medium text-muted-foreground mb-1">{label}</Label>
                    <Input
                      id={key}
                      name={key}
                      type={key === 'age' ? 'number' : key === 'email' ? 'email' : 'text'}
                      value={editedUser[key as keyof User] as string || ''}
                      onChange={handleChange}
                      className="input-clay w-full"
                    />
                     {key === 'age' && errors.age && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.age}</p>}
                  </div>
                )
              })}
            </form>
          </main>
          <footer className="p-4 bg-background border-t border-border rounded-b-xl">
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                onClick={onCancel}
                className="btn-clay"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="btn-clay bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
