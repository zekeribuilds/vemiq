'use client';

import { motion } from 'framer-motion';

export default function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-background px-4 py-6 space-y-6">
      {/* Greeting Skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-surface rounded-lg w-48 animate-pulse" />
        <div className="h-4 bg-surface rounded-lg w-64 animate-pulse" />
      </div>

      {/* Context Cards Skeleton */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-3 space-y-2">
            <div className="h-4 bg-elevated rounded w-20 animate-pulse" />
            <div className="h-5 bg-elevated rounded w-full animate-pulse" />
          </div>
        ))}
      </div>

      {/* Current Training Skeleton */}
      <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
        <div className="h-6 bg-elevated rounded w-32 animate-pulse" />
        <div className="h-8 bg-elevated rounded w-48 animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-elevated rounded w-full animate-pulse" />
          ))}
        </div>
        <div className="h-12 bg-elevated rounded-xl animate-pulse" />
      </div>

      {/* Continue Working Skeleton */}
      <div className="bg-surface border border-border rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-elevated rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-elevated rounded w-32 animate-pulse" />
            <div className="h-5 bg-elevated rounded w-48 animate-pulse" />
          </div>
        </div>
        <div className="h-12 bg-elevated rounded-xl animate-pulse" />
      </div>

      {/* Today's Progress Skeleton */}
      <div className="space-y-3">
        <div className="h-5 bg-surface rounded w-24 animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-4 space-y-2">
              <div className="h-4 bg-elevated rounded w-20 animate-pulse" />
              <div className="h-8 bg-elevated rounded w-12 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Capture Skeleton */}
      <div className="space-y-3">
        <div className="h-5 bg-surface rounded w-28 animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 flex flex-col items-center justify-center min-h-[120px]">
              <div className="w-14 h-14 bg-elevated rounded-full animate-pulse mb-3" />
              <div className="h-4 bg-elevated rounded w-24 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Activity Timeline Skeleton */}
      <div className="space-y-3">
        <div className="h-5 bg-surface rounded w-32 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-elevated rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-elevated rounded w-48 animate-pulse" />
              <div className="h-3 bg-elevated rounded w-32 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports Skeleton */}
      <div className="space-y-3">
        <div className="h-5 bg-surface rounded w-28 animate-pulse" />
        {[1, 2].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-4 space-y-3">
            <div className="h-5 bg-elevated rounded w-48 animate-pulse" />
            <div className="h-2 bg-elevated rounded w-full animate-pulse" />
            <div className="h-2 bg-elevated rounded w-3/4 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
