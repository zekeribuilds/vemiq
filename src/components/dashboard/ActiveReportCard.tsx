'use client';

import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { colors, spacing } from '@/design-system/tokens/index';

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
    'Draft': { bg: `${colors.text.muted}1A`, text: colors.text.muted },
    'In Progress': { bg: `${colors.primary}1A`, text: colors.primary },
    'Ready for Review': { bg: `${colors.success}1A`, text: colors.success },
  };

  const statusStyle = statusColors[status as keyof typeof statusColors] || statusColors['Draft'];

  return (
    <Card style={{ padding: spacing.lg }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.md }}>
        <div>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '12px',
            fontWeight: '400',
            color: colors.text.secondary,
            marginBottom: spacing.xs,
          }}>
            Active Report
          </p>
          <h3 style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '18px',
            fontWeight: '600',
            color: colors.text.primary,
          }}>
            {reportTitle}
          </h3>
        </div>
        <span style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '12px',
          fontWeight: '500',
          padding: `${spacing.xs} ${spacing.sm}`,
          borderRadius: '9999px',
          backgroundColor: statusStyle.bg,
          color: statusStyle.text,
        }}>
          {status}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.md }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '400',
            color: colors.text.secondary,
          }}>
            {programType} Report
          </span>
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '400',
            color: colors.text.primary,
          }}>
            {currentChapter || 'Not started'}
          </span>
        </div>

        <div style={{ width: '100%', backgroundColor: colors.text.muted + '33', borderRadius: '9999px', height: '8px' }}>
          <div
            style={{
              backgroundColor: colors.primary,
              height: '8px',
              borderRadius: '9999px',
              transition: 'all 0.3s ease',
              width: `${progress}%`,
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '12px',
            fontWeight: '400',
            color: colors.text.secondary,
          }}>
            Progress
          </span>
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            color: colors.text.primary,
          }}>
            {progress}%
          </span>
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
