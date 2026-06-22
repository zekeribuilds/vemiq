'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { navigationItems } from '@/lib/navigation-config';

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      {/* Glassmorphism Background */}
      <div className="mx-4 mb-4 bg-surface/80 backdrop-blur-xl border border-border rounded-t-2xl shadow-2xl">
        <nav className="flex items-center justify-around h-[72px] px-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1 min-h-[44px] relative group"
              >
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -top-1 w-8 h-1 bg-success rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <Icon
                  size={24}
                  className={`mb-1 transition-colors ${
                    isActive ? 'text-success' : 'text-tertiary group-hover:text-quaternary'
                  }`}
                />

                {/* Label */}
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive ? 'text-success' : 'text-tertiary group-hover:text-quaternary'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
}
