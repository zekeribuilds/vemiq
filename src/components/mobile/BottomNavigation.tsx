'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { navigationItems } from '@/lib/navigation-config';
import { VemiqIcon } from '@/components/VemiqIcon';

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
      <div className="mx-4 mb-4 bg-surface/80 backdrop-blur-xl border border-border rounded-[100px] shadow-2xl">
        <nav className="flex items-center justify-around h-[72px] px-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1 min-h-[44px] relative group"
              >
                {/* Icon */}
                <VemiqIcon
                  category="nav"
                  name={item.iconKey}
                  size={24}
                  className="mb-1 transition-colors text-white"
                />

                {/* Label */}
                <span
                  className={`text-xs font-medium transition-colors text-white`}
                >
                  {item.label}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 w-8 h-1 bg-white rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
}
