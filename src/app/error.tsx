'use client';

import { useEffect } from 'react';
import { ErrorIcon, RefreshCwIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-red-100 rounded-32 flex items-center justify-center mx-auto mb-6">
          <ErrorIcon className="text-red-500" size={48} />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-8">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <Button
          onClick={reset}
          size="md"
          leftIcon={<RefreshCwIcon size={20} />}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
