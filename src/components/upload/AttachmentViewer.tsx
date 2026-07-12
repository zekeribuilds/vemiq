'use client';

import { useState } from 'react';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { DownloadIcon, DeleteIcon, DocumentsIcon, CameraIcon, MicIcon, BookOpenIcon } from '@/design-system';

interface Attachment {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

interface AttachmentViewerProps {
  attachments: Attachment[];
  onDelete?: (attachmentId: string) => Promise<void>;
  onDownload?: (attachment: Attachment) => void;
}

export function AttachmentViewer({
  attachments,
  onDelete,
  onDownload,
}: AttachmentViewerProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <CameraIcon size={24} className="text-purple-500" />;
    }
    if (fileType.startsWith('audio/')) {
      return <MicIcon size={24} className="text-orange-500" />;
    }
    if (fileType === 'application/pdf') {
      return <BookOpenIcon size={24} className="text-red-500" />;
    }
    return <DocumentsIcon size={24} className="text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDelete = async (attachmentId: string) => {
    if (!onDelete) return;
    if (!confirm('Are you sure you want to delete this attachment?')) return;

    setDeletingId(attachmentId);
    try {
      await onDelete(attachmentId);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (attachments.length === 0) {
    return (
      <Card className="p-6 text-center">
        <DocumentsIcon size={48} className="text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No attachments yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {attachments.map((attachment) => (
        <Card key={attachment.id} className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              {getFileIcon(attachment.file_type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{attachment.file_name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(attachment.file_size)} • {new Date(attachment.uploaded_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              {onDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload(attachment)}
                  leftIcon={<DownloadIcon size={16} />}
                >
                  Download
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(attachment.id)}
                  isLoading={deletingId === attachment.id}
                  leftIcon={<DeleteIcon size={16} />}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
