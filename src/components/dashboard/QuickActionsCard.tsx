'use client';

import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { colors, spacing } from '@/design-system/tokens/index';

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
      iconKey: 'logbook',
      label: 'Add Logbook Entry',
      description: 'Document your daily activities',
      onClick: onAddLogbook,
    },
    {
      iconKey: 'reports',
      label: 'Continue Report',
      description: 'Work on your active report',
      onClick: onContinueReport,
    },
    {
      iconKey: 'chat',
      label: 'Open AI Chat',
      description: 'Get help with your report',
      onClick: onOpenAI,
    },
    {
      iconKey: 'uploads',
      label: 'Upload Images',
      description: 'Add photos to logbook',
      onClick: onUploadImages,
    },
  ];

  return (
    <Card style={{ padding: spacing.lg }}>
      <h3 style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.md,
      }}>
        What should I do next?
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: spacing.sm }}>
        {actions.map((action) => (
          <Button
            key={action.label}
            onClick={action.onClick}
            variant="ghost"
            size="md"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.sm,
              padding: spacing.md,
              height: 'auto',
              minHeight: 'auto',
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: `${colors.primary}1A`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{ color: colors.primary }}>
                <VemiqIcon category="nav" name={action.iconKey} size={20} />
              </div>
            </div>
            <span style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              color: colors.text.primary,
            }}>
              {action.label}
            </span>
            <span style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '12px',
              fontWeight: '400',
              color: colors.text.secondary,
              textAlign: 'center',
            }}>
              {action.description}
            </span>
          </Button>
        ))}
      </div>
    </Card>
  );
}
