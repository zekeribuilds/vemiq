'use client';

import { useState } from 'react';
import { Card } from '@/design-system/components/Card';
import { XIcon, ZoomInIcon, ZoomOutIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';

interface ImagePreviewProps {
  imageUrl: string;
  fileName: string;
  onClose: () => void;
}

export function ImagePreview({ imageUrl, fileName, onClose }: ImagePreviewProps) {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-foreground truncate">{fileName}</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleZoomOut} leftIcon={<ZoomOutIcon size={16} />}>
              Zoom Out
            </Button>
            <span className="text-sm text-muted-foreground">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="sm" onClick={handleZoomIn} leftIcon={<ZoomInIcon size={16} />}>
              Zoom In
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} leftIcon={<XIcon size={16} />}>
              Close
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-gray-900 flex items-center justify-center p-4">
          <img
            src={imageUrl}
            alt={fileName}
            style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}
            className="max-w-full object-contain"
          />
        </div>
      </Card>
    </div>
  );
}
