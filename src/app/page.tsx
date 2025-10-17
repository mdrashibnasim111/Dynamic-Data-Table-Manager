'use client';

import { DataTable } from '@/components/data-table/data-table';
import { User } from '@/lib/data';
import React, { useState } from 'react';
import usersData from '@/lib/users.json';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';


export default function Home() {
  const [data] = useState<User[]>(usersData);
  const [activeTab, setActiveTab] = useState('table');

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col justify-between">
      <div>
        <header className="flex items-center justify-between bg-transparent p-4 pb-2">
          <div className="w-12"></div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white flex-1 text-center">Data Table Manager</h1>
          <div className="flex w-12 items-center justify-end">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex items-center justify-center rounded-full h-10 w-10 text-slate-600 dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-primary/20">
                        <span className="material-symbols-outlined">settings</span>
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Settings</SheetTitle>
                    </SheetHeader>
                    <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50 mt-4">
                        <div className="flex items-center justify-between p-4">
                            <p className="text-slate-800 dark:text-slate-200">Theme</p>
                            <ThemeToggle />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
          </div>
        </header>

        {activeTab === 'table' && (
           <main className="flex-1 container mx-auto py-10">
             <DataTable data={data} />
           </main>
        )}

      </div>

      <footer className="sticky bottom-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="flex justify-around items-center h-20">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
            <span className="material-symbols-outlined">home</span>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button onClick={() => setActiveTab('table')} className={`flex flex-col items-center gap-1 ${activeTab === 'table' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
            <div className={`${activeTab === 'table' ? 'bg-primary/20 dark:bg-primary/30' : ''} rounded-full p-3`}>
              <span className="material-symbols-outlined" style={{fontVariationSettings: activeTab === 'table' ? `'FILL' 1` : ''}}>table_rows</span>
            </div>
            <span className="text-xs font-medium">Table</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
            <span className="material-symbols-outlined">settings</span>
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
