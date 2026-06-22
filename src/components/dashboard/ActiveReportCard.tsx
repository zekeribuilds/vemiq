'use client';

import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';

interface ActiveReportCardProps {
  reportTitle: string;
  programType: string;
  currentChapter: string | null;
  progress: number;
  status: string;
  onContinue: () => void;
}

export default function ActiveReportCard({
  reportTitle,
  programType,
  currentChapter,
  progress,
  status,
  onContinue,
}: ActiveReportCardProps) {
  const statusColors = {
    'Draft': 'bg-muted/10 text-muted-foreground',
    'In Progress': 'bg-primary/10 text-primary',
    'Ready for Review': 'bg-success/10 text-success',
  };

  return (
    <Card className="rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Active Report</p>
          <h3 className="text-lg font-semibold text-foreground">{reportTitle}</h3>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[status as keyof typeof statusColors] || statusColors['Draft']}`}>
          {status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{programType} Report</span>
          <span className="text-sm text-foreground">{currentChapter || 'Not started'}</span>
        </div>

        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-sm font-medium text-foreground">{progress}%</span>
        </div>
      </div>

      <Button
        onClick={onContinue}
        fullWidth
        size="md"
      >
        Continue Working
      </Button>
    </Card>
  );
}
