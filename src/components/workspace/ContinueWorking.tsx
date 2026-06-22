'use client';

import { motion } from 'framer-motion';
import { ArrowRightIcon, ClockIcon, DocumentsIcon, VoiceIcon, SparklesIcon, UploadsIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';

interface ContinueWorkingProps {
  lastActivity: {
    type: 'chapter' | 'logbook' | 'report' | 'ai' | 'upload';
    title: string;
    time: string;
    lastEdited: string;
  };
  onContinue: () => void;
}

const activityIcons = {
  chapter: DocumentsIcon,
  logbook: DocumentsIcon,
  report: DocumentsIcon,
  ai: SparklesIcon,
  upload: UploadsIcon,
};

const activityColors = {
  chapter: 'text-success',
  logbook: 'text-info',
  report: 'text-primary',
  ai: 'text-warning',
  upload: 'text-success',
};

export default function ContinueWorking({ lastActivity, onContinue }: ContinueWorkingProps) {
  const Icon = activityIcons[lastActivity.type];
  const color = activityColors[lastActivity.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-surface border border-border rounded-2xl p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-elevated flex items-center justify-center">
          <Icon size={24} className={color} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-tertiary mb-1">Continue where you left off</p>
          <h3 className="text-base font-semibold text-primary">{lastActivity.title}</h3>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs text-tertiary">
          <ClockIcon size={14} />
          <span>Last activity: {lastActivity.time}</span>
        </div>
        <span className="text-xs text-tertiary">Edited: {lastActivity.lastEdited}</span>
      </div>

      <Button
        onClick={onContinue}
        fullWidth
        size="md"
        variant="secondary"
        rightIcon={<ArrowRightIcon size={18} />}
      >
        Resume Work
      </Button>
    </motion.div>
  );
}
