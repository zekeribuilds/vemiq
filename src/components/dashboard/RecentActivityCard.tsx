'use client';

import { VemiqIcon } from '@/components/VemiqIcon';
import { Card } from '@/design-system/components/Card';
import { EmptyState } from '@/design-system/components/EmptyState';
import { colors, spacing } from '@/design-system/tokens/index';

interface Activity {
  id: string;
  type: 'upload' | 'log' | 'generate' | 'voice' | 'ai' | 'import';
  title: string;
  description?: string;
  time: string;
  date?: string;
}

interface RecentActivityCardProps {
  activities: Activity[];
}

const activityIconKeys = {
  upload: 'uploads',
  log: 'reports',
  generate: 'reports',
  voice: 'mic',
  ai: 'activity',
  import: 'uploads',
};

const activityColors = {
  upload: colors.success,
  log: colors.primary,
  generate: colors.primary,
  voice: colors.warning,
  ai: colors.primary,
  import: colors.primary,
};

const activityLabels = {
  upload: 'Image Uploaded',
  log: 'Logbook Entry',
  generate: 'Report Generated',
  voice: 'Voice Note',
  ai: 'AI Assistant',
  import: 'File Imported',
};

export default function RecentActivityCard({ activities }: RecentActivityCardProps) {
  if (activities.length === 0) {
    return (
      <Card style={{ padding: spacing.lg }}>
        <h3 style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '16px',
          fontWeight: '600',
          color: colors.text.primary,
          marginBottom: spacing.md,
        }}>
          What did I do recently?
        </h3>
        <EmptyState
          icon="no_activity"
          title="No recent activity"
          description="Your activities will appear here"
        />
      </Card>
    );
  }

  return (
    <Card style={{ padding: spacing.lg }}>
      <h3 style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.md,
      }}>
        What did I do recently?
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        {activities.slice(0, 5).map((activity) => {
          const iconKey = activityIconKeys[activity.type as keyof typeof activityIconKeys];
          const color = activityColors[activity.type as keyof typeof activityColors];
          const label = activityLabels[activity.type as keyof typeof activityLabels];

          return (
            <div
              key={activity.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: spacing.sm,
                padding: spacing.sm,
                backgroundColor: colors.background.elevated,
                borderRadius: '12px',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: colors.background.surface,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <div style={{ color }}>
                  <VemiqIcon category="nav" name={iconKey} size={18} />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                  <p style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '12px',
                    fontWeight: '400',
                    color: colors.text.secondary,
                  }}>
                    {label}
                  </p>
                  <p style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '12px',
                    fontWeight: '400',
                    color: colors.text.secondary,
                  }}>
                    {activity.time}
                  </p>
                </div>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: '400',
                  color: colors.text.primary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {activity.title}
                </p>
                {activity.description && (
                  <p style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '12px',
                    fontWeight: '400',
                    color: `${colors.text.secondary}99`,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginTop: spacing.xs,
                  }}>
                    {activity.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
