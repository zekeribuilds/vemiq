'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationItems } from '@/lib/navigation-config';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen bg-card border-r border-border flex flex-col w-64">
      <div className="p-6 border-b border-border flex items-center gap-2">
        <img src="/images/logo.svg" alt="Vemiq" className="w-10 h-10" />
        <h1 className="text-2xl font-bold text-primary">vemiq</h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-primary dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-medium text-base">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
