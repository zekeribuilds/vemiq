'use client';

import { motion } from 'framer-motion';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Grid, Stack } from '@/design-system/layouts';
import { colors, spacing } from '@/design-system/tokens/index';

interface QuickCaptureProps {
  onAddLogbook: () => void;
  onRecordVoice: () => void;
  onTakePhoto: () => void;
  onOpenAI: () => void;
}

export default function QuickCapture({
  onAddLogbook,
  onRecordVoice,
  onTakePhoto,
  onOpenAI,
}: QuickCaptureProps) {
  const actions = [
    { iconKey: 'file', label: 'Add Logbook Entry', color: colors.success, category: 'content' as const },
    { iconKey: 'voice', label: 'Record Voice Note', color: colors.warning, category: 'content' as const },
    { iconKey: 'image', label: 'Take Picture', color: colors.purple, category: 'content' as const },
    { iconKey: 'sparkles', label: 'Open AI Assistant', color: colors.success, category: 'status' as const },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <h3 style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.md,
      }}>
        Quick Capture
      </h3>
      <Grid columns={2} gap="md">
        {actions.map((action, index) => (
          <Button
            key={action.label}
            onClick={() => {
              if (action.label === 'Add Logbook Entry') onAddLogbook();
              else if (action.label === 'Record Voice Note') onRecordVoice();
              else if (action.label === 'Take Picture') onTakePhoto();
              else if (action.label === 'Open AI Assistant') onOpenAI();
            }}
            variant="ghost"
            size="md"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px',
              padding: spacing.lg,
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: `${action.color}1A`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.md,
            }}>
              <div style={{ color: action.color }}>
                <VemiqIcon category={action.category} name={action.iconKey} size={28} />
              </div>
            </div>
            <span style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              color: colors.text.primary,
              textAlign: 'center',
            }}>
              {action.label}
            </span>
          </Button>
        ))}
      </Grid>
    </motion.div>
  );
}
