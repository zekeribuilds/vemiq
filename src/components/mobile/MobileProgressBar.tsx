'use client';

import { motion } from 'framer-motion';
import { colors } from '@/design-system/tokens/index';

interface MobileProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export default function MobileProgressBar({
  progress,
  color = colors.success,
  height = 8,
  showLabel = false,
}: MobileProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-tertiary">Progress</span>
          <span className="text-sm font-medium text-primary">{clampedProgress}%</span>
        </div>
      )}
      <div
        className="w-full bg-elevated rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
