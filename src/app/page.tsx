import { DataTable } from '@/components/data-table/data-table';
import { ThemeToggle } from '@/components/theme-toggle';
import { promises as fs } from 'fs';
import path from 'path';
import { User, userSchema } from '@/lib/data';
import { z } from 'zod';

async function getData(): Promise<User[]> {
  const data = await fs.readFile(
    path.join(process.cwd(), 'src/lib/users.json')
  );
  const users = JSON.parse(data.toString());
  return z.array(userSchema).parse(users);
}

export default async function Home() {
  const data = await getData();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6">
                <rect width="256" height="256" fill="none"></rect>
                <path d="M32,56H224a0,0,0,0,1,0,0V176a24,24,0,0,1-24,24H56a24,24,0,0,1-24-24V56A0,0,0,0,1,32,56Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><line x1="32" y1="104" x2="224" y2="104" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="88" y1="56" x2="88" y2="200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
              </svg>
              <span className="font-bold sm:inline-block font-headline">
                DataGrid Pro
              </span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-10">
        <DataTable data={data} />
      </main>
    </div>
  );
}
