'use client';

import { LogbookIcon, ReportsIcon, ChatIcon, UploadsIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';

interface QuickActionsCardProps {
  onAddLogbook: () => void;
  onContinueReport: () => void;
  onOpenAI: () => void;
  onUploadImages: () => void;
}

export default function QuickActionsCard({
  onAddLogbook,
  onContinueReport,
  onOpenAI,
  onUploadImages,
}: QuickActionsCardProps) {
  const actions = [
    {
      icon: LogbookIcon,
      label: 'Add Logbook Entry',
      description: 'Document your daily activities',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      onClick: onAddLogbook,
    },
    {
      icon: ReportsIcon,
      label: 'Continue Report',
      description: 'Work on your active report',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      onClick: onContinueReport,
    },
    {
      icon: ChatIcon,
      label: 'Open AI Chat',
      description: 'Get help with your report',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      onClick: onOpenAI,
    },
    {
      icon: UploadsIcon,
      label: 'Upload Images',
      description: 'Add photos to logbook',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      onClick: onUploadImages,
    },
  ];

  return (
    <Card className="rounded-2xl p-6">
      <h3 className="text-base font-semibold text-foreground mb-4">What should I do next?</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              onClick={action.onClick}
              variant="ghost"
              size="md"
              className="flex-col gap-2 p-4 h-auto"
              leftIcon={
                <div className={`w-10 h-10 rounded-full ${action.bgColor} flex items-center justify-center`}>
                  <Icon size={20} className={action.color} />
                </div>
              }
            >
              <span className="text-sm font-medium text-foreground">{action.label}</span>
              <span className="text-xs text-muted-foreground text-center">{action.description}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
