'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MobileLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

export default function MobileLayout({ children, showBottomNav = true }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Scrollable Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-y-auto pb-[88px]"
      >
        {/* Content with 16px padding */}
        <div className="px-4 py-safe-top">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
