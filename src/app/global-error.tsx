'use client';

import { ErrorIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-red-100 rounded-32 flex items-center justify-center mx-auto mb-6">
              <ErrorIcon className="text-red-500" size={48} />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">Critical Error</h1>
            <p className="text-gray-600 mb-8">
              A critical error occurred. Please refresh the page or contact support.
            </p>
            <Button
              onClick={reset}
              size="md"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
