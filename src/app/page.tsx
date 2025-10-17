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
    <div className="relative flex h-auto min-h-screen w-full flex-col">
      <header className="flex items-center justify-between bg-transparent p-4">
        <h1 className="text-xl font-bold text-foreground flex-1">Data Table</h1>
        <div className="flex items-center justify-end space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="btn-clay flex items-center justify-center rounded-full h-10 w-10 text-foreground">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col overflow-x-auto">
        <DataTable data={data} />
      </main>

    </div>
  );
}
