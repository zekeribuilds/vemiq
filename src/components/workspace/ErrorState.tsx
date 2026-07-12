'use client';

import { motion } from 'framer-motion';
import { ErrorIcon, RefreshCwIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

export default function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-surface border border-error/30 rounded-2xl p-8 text-center"
    >
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <ErrorIcon size={32} className="text-error" />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
      <p className="text-tertiary text-sm mb-6">{description}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          size="md"
          leftIcon={<RefreshCwIcon size={18} />}
        >
          Retry
        </Button>
      )}
    </motion.div>
  );
}
