'use client';

import { ImagesIcon, DocumentsIcon, VoiceIcon, AIAssistantIcon } from '@/design-system';
import { Card } from '@/design-system/components/Card';
import { EmptyState } from '@/design-system/components/EmptyState';

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

const activityIcons = {
  upload: ImagesIcon,
  log: DocumentsIcon,
  generate: DocumentsIcon,
  voice: VoiceIcon,
  ai: AIAssistantIcon,
  import: ImagesIcon,
};

const activityColors = {
  upload: 'text-success',
  log: 'text-primary',
  generate: 'text-primary',
  voice: 'text-warning',
  ai: 'text-primary',
  import: 'text-primary',
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
      <Card className="rounded-2xl p-6">
        <h3 className="text-base font-semibold text-foreground mb-4">What did I do recently?</h3>
        <EmptyState
          icon={<DocumentsIcon size={32} />}
          title="No recent activity"
          description="Your activities will appear here"
        />
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl p-6">
      <h3 className="text-base font-semibold text-foreground mb-4">What did I do recently?</h3>
      <div className="space-y-3">
        {activities.slice(0, 5).map((activity) => {
          const Icon = activityIcons[activity.type as keyof typeof activityIcons];
          const color = activityColors[activity.type as keyof typeof activityColors];
          const label = activityLabels[activity.type as keyof typeof activityLabels];

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 bg-muted rounded-xl"
            >
              <div className={`w-10 h-10 rounded-full bg-card flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <p className="text-sm text-foreground truncate">{activity.title}</p>
                {activity.description && (
                  <p className="text-xs text-muted-foreground/60 truncate mt-1">{activity.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
