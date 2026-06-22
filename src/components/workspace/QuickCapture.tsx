'use client';

import { motion } from 'framer-motion';
import { DocumentsIcon, VoiceIcon, CameraIcon, SparklesIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';

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
    { icon: DocumentsIcon, label: 'Add Logbook Entry', color: 'text-[#22C55E]', bgColor: 'bg-[#22C55E]/10' },
    { icon: VoiceIcon, label: 'Record Voice Note', color: 'text-[#F59E0B]', bgColor: 'bg-[#F59E0B]/10' },
    { icon: CameraIcon, label: 'Take Picture', color: 'text-[#8B5CF6]', bgColor: 'bg-[#8B5CF6]/10' },
    { icon: SparklesIcon, label: 'Open AI Assistant', color: 'text-[#22C55E]', bgColor: 'bg-[#22C55E]/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <h3 className="text-base font-semibold text-white mb-3">Quick Capture</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
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
              className="flex flex-col items-center justify-center min-h-[120px]"
            >
              <div className={`w-14 h-14 rounded-full ${action.bgColor} flex items-center justify-center mb-3`}>
                <Icon size={28} className={action.color} />
              </div>
              <span className="text-sm font-medium text-white text-center">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
}
