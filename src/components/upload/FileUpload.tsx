'use client';

import { useState, useRef } from 'react';
import { Button } from '@/design-system/components/Button';
import { UploadIcon, XIcon } from '@/design-system';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number; // in bytes
  label?: string;
  multiple?: boolean;
}

export function FileUpload({
  onUpload,
  accept = 'image/*,.pdf,.doc,.docx',
  maxSize = 10 * 1024 * 1024, // 10MB
  label = 'Upload File',
  multiple = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError(null);

    for (const file of files) {
      // Validate file size
      if (file.size > maxSize) {
        setError(`File ${file.name} exceeds maximum size of ${maxSize / 1024 / 1024}MB`);
        return;
      }

      // Validate file type
      if (accept && !file.type.match(accept.replace('*', '.*'))) {
        setError(`File ${file.name} is not an accepted type`);
        return;
      }
    }

    setIsUploading(true);

    try {
      for (const file of files) {
        await onUpload(file);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <div className="inline-block cursor-pointer">
          <Button
            isLoading={isUploading}
            leftIcon={<UploadIcon size={20} />}
            onClick={() => fileInputRef.current?.click()}
          >
            {label}
          </Button>
        </div>
      </label>
      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <XIcon size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
