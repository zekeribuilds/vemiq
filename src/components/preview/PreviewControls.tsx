'use client';

import { useState } from 'react';
import { ZoomInIcon, ZoomOutIcon, ChevronLeftIcon, ChevronRightIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';

interface PreviewControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PreviewControls({
  zoom,
  onZoomChange,
  currentPage,
  totalPages,
  onPageChange,
}: PreviewControlsProps) {
  const handleZoomIn = () => {
    if (zoom < 200) {
      onZoomChange(zoom + 25);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 50) {
      onZoomChange(zoom - 25);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between card px-6 py-4 mb-4">
      <div className="flex items-center gap-3">
        <Button
          onClick={handleZoomOut}
          disabled={zoom <= 50}
          variant="ghost"
          size="sm"
          leftIcon={<ZoomOutIcon size={20} />}
        />
        <span className="text-sm font-semibold text-foreground min-w-[60px] text-center">
          {zoom}%
        </span>
        <Button
          onClick={handleZoomIn}
          disabled={zoom >= 200}
          variant="ghost"
          size="sm"
          leftIcon={<ZoomInIcon size={20} />}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          variant="ghost"
          size="sm"
          leftIcon={<ChevronLeftIcon size={20} />}
        />
        <span className="text-sm font-semibold text-foreground min-w-[100px] text-center">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          variant="ghost"
          size="sm"
          leftIcon={<ChevronRightIcon size={20} />}
        />
      </div>

      <div className="flex items-center gap-2">
        {[50, 75, 100, 125, 150, 175, 200].map((z) => (
          <Button
            key={z}
            onClick={() => onZoomChange(z)}
            size="sm"
            variant={zoom === z ? 'primary' : 'ghost'}
          >
            {z}%
          </Button>
        ))}
      </div>
    </div>
  );
}
