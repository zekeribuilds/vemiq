'use client';

import { useState } from 'react';
import { Card } from '@/design-system/components/Card';
import { EmptyState } from '@/design-system/components/EmptyState';
import { VemiqIcon } from '@/components/VemiqIcon';
import { colors, spacing } from '@/design-system/tokens/index';

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
      return <VemiqIcon category="content" name="image" size={16} />;
    }
    if (fileType.startsWith('audio/')) {
      return <VemiqIcon category="content" name="voice" size={16} />;
    }
    return <VemiqIcon category="content" name="file" size={16} />;
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
      <EmptyState
        icon="no_uploads"
        title="No uploads yet"
        description="Upload your first file to get started"
      />
    );
  }

  return (
    <Card style={{ padding: spacing.xl }}>
      <h3 style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: '18px',
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.lg,
      }}>
        Upload Timeline
      </h3>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: '12px',
          top: 0,
          bottom: 0,
          width: '2px',
          backgroundColor: colors.border,
        }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, paddingLeft: spacing.xl }}>
          {uploads.map((upload, index) => (
            <div key={upload.id} style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '-32px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{ color: colors.text.primary }}>
                  {getIcon(upload.file_type)}
                </div>
              </div>
              <div style={{
                padding: spacing.md,
                backgroundColor: colors.background.surface,
                borderRadius: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                  <span style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: colors.text.primary,
                  }}>
                    {upload.file_name}
                  </span>
                  <span style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '12px',
                    color: colors.text.secondary,
                  }}>
                    {formatTime(upload.uploaded_at)}
                  </span>
                </div>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '12px',
                  color: colors.text.secondary,
                }}>
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
