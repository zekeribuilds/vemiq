'use client';

import { motion } from 'framer-motion';
import { DocumentsIcon, ImagesIcon, VoiceIcon, UploadsIcon } from '@/design-system';

interface TodayProgressProps {
  logbookEntries: number;
  imagesUploaded: number;
  voiceNotes: number;
  filesUploaded: number;
  activitiesDocumented: number;
}

export default function TodayProgress({
  logbookEntries,
  imagesUploaded,
  voiceNotes,
  filesUploaded,
  activitiesDocumented,
}: TodayProgressProps) {
  const progressItems = [
    { icon: DocumentsIcon, label: 'Logbook Entries', value: logbookEntries, color: 'text-success' },
    { icon: ImagesIcon, label: 'Images Uploaded', value: imagesUploaded, color: 'text-primary' },
    { icon: VoiceIcon, label: 'Voice Notes', value: voiceNotes, color: 'text-warning' },
    { icon: UploadsIcon, label: 'Files Uploaded', value: filesUploaded, color: 'text-success' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-primary">Today's Progress</h3>
        <span className="text-sm text-tertiary">{activitiesDocumented} activities</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {progressItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-surface border border-border rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={18} className={item.color} />
                <span className="text-xs text-tertiary">{item.label}</span>
              </div>
              <p className="text-2xl font-bold text-primary">{item.value}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
