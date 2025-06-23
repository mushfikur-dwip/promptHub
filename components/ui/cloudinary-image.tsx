'use client';

import React, { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: string | number;
  crop?: string;
  gravity?: string;
  format?: string;
  blur?: number;
  overlay?: string;
  transformation?: Record<string, any>;
}

export function CloudinaryImage({
  src,
  alt,
  width,
  height,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  quality = 'auto',
  crop = 'fill',
  gravity = 'auto',
  format = 'auto',
  blur,
  overlay,
  transformation = {},
  ...props
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        style={{ width, height }}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-muted z-10"
          style={{ width, height }}
        >
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}
      
      <CldImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        quality={quality}
        crop={crop}
        gravity={gravity}
        format={format}
        blur={blur}
        overlay={overlay}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        {...transformation}
        {...props}
      />
    </div>
  );
}

export default CloudinaryImage;