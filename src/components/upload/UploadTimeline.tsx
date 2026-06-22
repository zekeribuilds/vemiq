'use client';

import { useState } from 'react';
import { Card } from '@/design-system/components/Card';
import { ClockIcon, CameraIcon, MicIcon, DocumentsIcon } from '@/design-system';

interface Upload {
  id: string;
  file_name: string;
  file_type: string;
  uploaded_at: string;
}

interface UploadTimelineProps {
  uploads: Upload[];
}

export function UploadTimeline({ uploads }: UploadTimelineProps) {
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null);

  const getIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <CameraIcon size={16} className="text-purple-500" />;
    }
    if (fileType.startsWith('audio/')) {
      return <MicIcon size={16} className="text-orange-500" />;
    }
    return <DocumentsIcon size={16} className="text-gray-500" />;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (uploads.length === 0) {
    return (
      <Card className="p-6 text-center">
        <ClockIcon size={48} className="text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No uploads yet</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Upload Timeline</h3>
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />
        <div className="space-y-4 pl-8">
          {uploads.map((upload, index) => (
            <div key={upload.id} className="relative">
              <div className="absolute -left-8 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                {getIcon(upload.file_type)}
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground text-sm">{upload.file_name}</span>
                  <span className="text-xs text-muted-foreground">{formatTime(upload.uploaded_at)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(upload.uploaded_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
