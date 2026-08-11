interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  count?: number;
}

export function Skeleton({
  className = '',
  variant = 'default',
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-[#2A2A2A]';
  
  const variantClasses = {
    default: 'rounded-md',
    text: 'rounded-sm',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
  };

  const skeletons = Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  ));

  return <>{skeletons}</>;
}

// Pre-built skeleton patterns for common use cases
export function CardSkeleton() {
  return (
    <div className="p-4 bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg space-y-3">
      <Skeleton variant="text" className="h-4 w-3/4" />
      <Skeleton variant="text" className="h-3 w-1/2" />
      <Skeleton variant="text" className="h-3 w-full" />
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

export function AvatarSkeleton() {
  return (
    <Skeleton variant="circular" className="w-20 h-20" />
  );
}

export function ButtonSkeleton() {
  return (
    <Skeleton variant="default" className="h-12 w-full" />
  );
}
