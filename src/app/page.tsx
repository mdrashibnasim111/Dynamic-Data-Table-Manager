'use client';

import { DataTable } from '@/components/data-table/data-table';
import { User } from '@/lib/data';
import React, { useState } from 'react';
import usersData from '@/lib/users.json';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { MoreVertical } from 'lucide-react';

export default function Home() {
  const [data] = useState<User[]>(usersData);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-gradient-to-br from-background-light to-sky-100 dark:from-background-dark dark:to-sky-900/50 font-display text-slate-800 dark:text-slate-200">
      <header className="flex items-center justify-between bg-transparent p-4">
        <h1 className="text-lg font-bold text-slate-800 dark:text-white flex-1">Data Table</h1>
        <div className="flex items-center justify-end space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="flex items-center justify-center rounded-full h-10 w-10 text-slate-600 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col">
        <DataTable data={data} />
      </main>

    </div>
  );
}
