'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/design-system/components/Input';
import { colors } from '@/design-system/tokens/index';

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
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: colors.text.secondary, marginBottom: '8px' }}>
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
