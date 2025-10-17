
'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/lib/data';

interface EditRowProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

export function EditRow({ user, onSave, onCancel }: EditRowProps) {
  const [editedUser, setEditedUser] = useState<User>(user);
  const [errors, setErrors] = useState<{ age?: string }>({});

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

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-background to-sky-100 dark:from-background-dark dark:to-primary/10 font-display">
      <div className="flex flex-col justify-between min-h-screen">
        <div className="flex-grow">
          <header className="p-4 flex items-center justify-between">
            <button onClick={onCancel} className="text-gray-800 dark:text-gray-200">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white flex-grow text-center">Edit Row</h1>
            <div className="w-10"></div>
          </header>
          <main className="px-4 py-6">
            <form className="space-y-6">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={editedUser.name}
                  onChange={handleChange}
                  className="w-full bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="text"
                  value={editedUser.age}
                  onChange={handleChange}
                  className="w-full bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                />
                {errors.age && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.age}</p>}
              </div>
              <div>
                <Label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</Label>
                <Input
                  id="role"
                  name="role"
                  type="text"
                  value={editedUser.role}
                  onChange={handleChange}
                  className="w-full bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={editedUser.email}
                  onChange={handleChange}
                  className="w-full bg-white/50 dark:bg-black/20 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                />
              </div>
            </form>
          </main>
        </div>
        <footer className="p-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-end space-x-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="px-8 py-3 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Save
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
