import Link from 'next/link';
import { DocumentsIcon, HomeIcon } from '@/design-system';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-accent/10 rounded-32 flex items-center justify-center mx-auto mb-6">
          <DocumentsIcon className="text-accent" size={48} />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-16 hover:bg-accent-dark transition-colors"
        >
          <HomeIcon size={20} />
          Go Home
        </Link>
      </div>
    </div>
  );
}
