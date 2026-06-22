'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/design-system/components/Input';

interface MobileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
            {label}
          </label>
        )}
        <Input
          ref={ref}
          label=""
          error={error}
          leftIcon={icon}
          fullWidth
          className={className}
          {...props}
        />
      </div>
    );
  }
);

MobileInput.displayName = 'MobileInput';

export default MobileInput;
