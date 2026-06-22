'use client';

import { motion } from 'framer-motion';
import { ArrowRightIcon, CalendarIcon, DocumentsIcon, OrganizationIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import MobileProgressBar from '@/components/mobile/MobileProgressBar';

interface CurrentTrainingProps {
  programType: 'SIWES' | 'SWEP';
  institution: string;
  department: string;
  organization: string;
  startDate: string;
  endDate: string;
  currentChapter: string;
  overallProgress: number;
  status: 'Draft' | 'In Progress' | 'Ready for Review';
  onContinue: () => void;
}

const statusColors = {
  'Draft': 'bg-tertiary/10 text-tertiary',
  'In Progress': 'bg-success/10 text-success',
  'Ready for Review': 'bg-success/10 text-success',
};

export default function CurrentTraining({
  programType,
  institution,
  department,
  organization,
  startDate,
  endDate,
  currentChapter,
  overallProgress,
  status,
  onContinue,
}: CurrentTrainingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-surface border border-border rounded-2xl p-5 relative overflow-hidden"
    >
      {/* Background gradient accent */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-success/5 rounded-full blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-medium text-tertiary uppercase tracking-wide">
              Current Training
            </span>
            <h2 className="text-xl font-bold text-primary mt-1">{programType} Program</h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-tertiary">
            <OrganizationIcon size={14} />
            <span>{institution}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-tertiary">
            <DocumentsIcon size={14} />
            <span>{department}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-tertiary">
            <CalendarIcon size={14} />
            <span>
              {startDate} - {endDate}
            </span>
          </div>
        </div>

        {/* Current Chapter */}
        <div className="mb-4">
          <p className="text-xs text-tertiary mb-1">Current Chapter</p>
          <p className="text-sm font-medium text-primary">{currentChapter}</p>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <MobileProgressBar progress={overallProgress} showLabel={true} />
        </div>

        {/* Continue Button */}
        <Button
          onClick={onContinue}
          fullWidth
          size="md"
          rightIcon={<ArrowRightIcon size={18} />}
        >
          Continue Working
        </Button>
      </div>
    </motion.div>
  );
}
