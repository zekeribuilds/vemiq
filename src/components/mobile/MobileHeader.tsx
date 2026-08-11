'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SideNavigation } from './SideNavigation';

interface MobileHeaderProps {
  title?: string;
}

export function MobileHeader({ title }: MobileHeaderProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/evidence', label: 'Evidence' },
    { path: '/reports', label: 'Reports' },
    { path: '/profile', label: 'Profile' },
  ];

  const currentPageLabel = navItems.find(item => item.path === pathname)?.label || title || 'Vemiq';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 z-30 flex items-center justify-between px-4">
        {/* Hamburger Menu Button with rounded background */}
        <button
          onClick={() => setIsNavOpen(true)}
          className="p-3 bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-full text-[#898989] hover:text-[#FFFFFF] transition-colors"
          aria-label="Open menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        
        {/* Current Page Label floating in middle with rounded background */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="px-4 py-2 bg-[#2A2A2A] rounded-full">
            <span className="text-[#FFFFFF] font-medium text-sm">{currentPageLabel}</span>
          </div>
        </div>
        
        <div className="w-12" /> {/* Spacer for balance */}
      </header>

      <SideNavigation isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
    </>
  );
}
