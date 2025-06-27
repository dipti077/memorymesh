import React from 'react';

interface UploadProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  height?: number;
  className?: string;
}

export function UploadProgressBar({
  progress,
  showPercentage = true,
  height = 8,
  className = '',
}: UploadProgressBarProps) {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <div 
          className="w-full bg-gray-200 rounded-full overflow-hidden"
          style={{ height: `${height}px` }}
        >
          <div
            className="bg-sage-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${normalizedProgress}%` }}
          />
        </div>
        
        {showPercentage && (
          <div className="mt-1 text-right">
            <span className="text-xs font-medium text-gray-600">
              {Math.round(normalizedProgress)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}