import React, { useState } from 'react';

interface ReportImageProps {
  src: string;
  caption?: string;
  alt?: string;
  maxWidth?: string;
}

export const ReportImage: React.FC<ReportImageProps> = ({
  src,
  caption,
  alt = 'Image',
  maxWidth = '100%',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="my-6">
      <div className="flex justify-center">
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto"
          style={{ maxWidth }}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      {caption && (
        <p className="text-center text-sm mt-2 italic">
          Figure: {caption}
        </p>
      )}
    </div>
  );
};
