'use client';

import { useState } from 'react';
import { UploadsIcon, DeleteIcon, ImagesIcon, LoaderIcon, SparklesIcon } from '@/design-system';
import { Button } from '@/design-system/components/Button';
import { createClient } from '@/lib/supabase/browser';

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void;
  existingImages?: string[];
  reportId?: string;
}

export default function ImageUpload({ onImagesChange, existingImages = [], reportId }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
          alert(`Only JPEG and PNG images are allowed. ${file.name} was skipped.`);
          continue;
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          alert(`File size must be less than 10MB. ${file.name} was skipped.`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        formData.append('userId', user?.id || '');
        if (reportId) {
          formData.append('reportId', reportId);
        }

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        
        setImages((prev) => {
          const updated = [...prev, data.url];
          onImagesChange(updated);
          return updated;
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload some images. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeImage = async (index: number) => {
    const imageToRemove = images[index];
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onImagesChange(updated);

    // Note: To implement deletion, we would need to track upload IDs
    // This would require storing upload IDs alongside URLs
    // For now, this is a UI-only removal
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-neutral-300 rounded-3xl p-8 text-center hover:border-primary transition-colors bg-neutral-50 hover:bg-primary-50/50 group cursor-pointer">
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center gap-3"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            {isUploading ? (
              <LoaderIcon className="text-white animate-spin" size={32} />
            ) : (
              <UploadsIcon className="text-white" size={32} />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {isUploading ? 'Uploading...' : 'Click to upload images'}
            </p>
            <p className="text-xs text-text-muted mt-1">
              PNG, JPG up to 10MB
            </p>
          </div>
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-2xl overflow-hidden border-2 border-neutral-200 shadow-md hover:shadow-xl transition-shadow">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-8 h-8 p-0 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                variant="primary"
                size="sm"
              >
                <DeleteIcon size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
