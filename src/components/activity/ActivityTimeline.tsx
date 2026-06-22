'use client';

import { motion } from 'framer-motion';
import { UploadsIcon, DocumentsIcon, VoiceIcon, ImagesIcon, SparklesIcon, ChevronRightIcon } from '@/design-system';

interface Activity {
  id: string;
  type: 'upload' | 'log' | 'generate' | 'voice' | 'ai' | 'import';
  title: string;
  description?: string;
  time: string;
  date?: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
  variant?: 'desktop' | 'mobile';
}

const activityIcons = {
  upload: UploadsIcon,
  log: DocumentsIcon,
  generate: DocumentsIcon,
  voice: VoiceIcon,
  ai: SparklesIcon,
  import: ImagesIcon,
};

const activityColors = {
  upload: 'text-success',
  log: 'text-info',
  generate: 'text-success',
  voice: 'text-warning',
  ai: 'text-primary',
  import: 'text-primary',
};

export default function ActivityTimeline({ activities, variant = 'desktop' }: ActivityTimelineProps) {
  // Desktop variant: Group activities by date
  if (variant === 'desktop') {
    const groupedActivities = activities.reduce((acc, activity) => {
      const date = activity.date || 'No Date';
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(activity);
      return acc;
    }, {} as Record<string, Activity[]>);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <h3 className="text-base font-semibold text-primary mb-3">Activity Timeline</h3>
        <div className="space-y-4">
          {Object.entries(groupedActivities).map(([date, dayActivities], groupIndex) => (
            <div key={date}>
              <p className="text-xs font-medium text-tertiary uppercase tracking-wide mb-2">
                {date}
              </p>
              <div className="space-y-2">
                {dayActivities.map((activity, index) => {
                  const Icon = activityIcons[activity.type as keyof typeof activityIcons];
                  const color = activityColors[activity.type as keyof typeof activityColors];
                  return (
                    <div
                      key={activity.id}
                      className="bg-surface border border-border rounded-xl p-4 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary truncate">{activity.title}</p>
                        {activity.description && (
                          <p className="text-xs text-tertiary truncate">{activity.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-tertiary">{activity.time}</span>
                        <ChevronRightIcon size={16} className="text-tertiary" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Mobile variant: Simple list without date grouping
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type as keyof typeof activityIcons];
        const color = activityColors[activity.type as keyof typeof activityColors];

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            {/* Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-elevated flex items-center justify-center ${color}`}>
              <Icon size={18} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-primary text-sm font-medium truncate">{activity.title}</p>
              <p className="text-tertiary text-xs mt-0.5">{activity.time}</p>
            </div>

            {/* Chevron */}
            <ChevronRightIcon size={16} className="text-tertiary flex-shrink-0 mt-1" />
          </motion.div>
        );
      })}
    </div>
  );
}
