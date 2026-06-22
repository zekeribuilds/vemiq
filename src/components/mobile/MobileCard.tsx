'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MobileCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export default function MobileCard({ children, className = '', onClick, variant = 'primary' }: MobileCardProps) {
  const bgColors = {
    primary: 'bg-surface',
    secondary: 'bg-elevated',
    tertiary: 'bg-overlay',
  };

  return (
    <motion.div
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      whileHover={onClick ? { scale: 1.02 } : {}}
      onClick={onClick}
      className={`${bgColors[variant]} border border-border rounded-2xl p-4 ${onClick ? 'cursor-pointer active:scale-98' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
