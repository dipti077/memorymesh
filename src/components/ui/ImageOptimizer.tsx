import React, { useState, useEffect } from 'react';
import { LazyImage } from './LazyImage';

interface ImageOptimizerProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpeg' | 'png';
  loading?: 'lazy' | 'eager';
  className?: string;
}

export function ImageOptimizer({
  src,
  alt,
  width,
  height,
  quality = 80,
  format = 'auto',
  loading = 'lazy',
  className = '',
  ...props
}: ImageOptimizerProps) {
  const [optimizedSrc, setOptimizedSrc] = useState(src);
  
  useEffect(() => {
    // Check if the source is already an optimized URL (e.g., from a CDN)
    if (src.includes('images.pexels.com')) {
      // For Pexels images, we can use their built-in optimization
      let optimizedUrl = src;
      
      // Add width parameter if specified
      if (width) {
        optimizedUrl = optimizedUrl.replace(/\?.*$/, '') + `?w=${width}`;
        
        // Add height if specified
        if (height) {
          optimizedUrl += `&h=${height}`;
        }
        
        // Add quality parameter
        optimizedUrl += `&dpr=1&q=${quality}`;
        
        // Add format parameter if not auto
        if (format !== 'auto') {
          optimizedUrl += `&fm=${format}`;
        }
        
        // Add auto compression
        optimizedUrl += '&fit=crop&auto=compress';
      }
      
      setOptimizedSrc(optimizedUrl);
    } else {
      // For other images, we could implement a custom optimization solution
      // For now, just use the original source
      setOptimizedSrc(src);
    }
  }, [src, width, height, quality, format]);
  
  return (
    <LazyImage
      src={optimizedSrc}
      alt={alt}
      loading={loading}
      className={className}
      {...props}
    />
  );
}