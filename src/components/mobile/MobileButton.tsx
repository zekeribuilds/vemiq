'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LoaderIcon } from '@/design-system';

interface MobileButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}

export default function MobileButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon,
}: MobileButtonProps) {
  const sizes = {
    sm: 'h-11 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  };

  const variants = {
    primary: 'bg-success text-primary hover:bg-success-hover',
    secondary: 'bg-elevated text-primary border border-border hover:bg-surface',
    ghost: 'bg-transparent text-tertiary hover:bg-elevated hover:text-primary',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${sizes[size]} ${variants[variant]} rounded-xl font-medium flex items-center justify-center gap-2 transition-all min-h-[44px] ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? (
        <LoaderIcon className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </motion.button>
  );
}
