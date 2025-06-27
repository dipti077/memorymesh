import React from 'react';
import { TouchOptimized } from './TouchOptimized';

interface EmptyStateProps {
  /**
   * Title text
   */
  title: string;
  
  /**
   * Description text
   */
  description: string;
  
  /**
   * Icon to display
   */
  icon: React.ReactNode;
  
  /**
   * Primary action button text
   */
  actionText?: string;
  
  /**
   * Function to call when the primary action button is clicked
   */
  onAction?: () => void;
  
  /**
   * Secondary action button text
   */
  secondaryActionText?: string;
  
  /**
   * Function to call when the secondary action button is clicked
   */
  onSecondaryAction?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = '',
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-md p-8 text-center
        ${className}
      `}
      {...props}
    >
      <div className="flex items-center justify-center w-16 h-16 bg-sage-100 rounded-full mx-auto mb-4">
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {actionText && onAction && (
          <TouchOptimized>
            <button
              onClick={onAction}
              className="bg-sage-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-sage-800 transition-colors"
            >
              {actionText}
            </button>
          </TouchOptimized>
        )}
        
        {secondaryActionText && onSecondaryAction && (
          <TouchOptimized>
            <button
              onClick={onSecondaryAction}
              className="border border-sage-700 text-sage-700 px-6 py-3 rounded-lg font-medium hover:bg-sage-50 transition-colors"
            >
              {secondaryActionText}
            </button>
          </TouchOptimized>
        )}
      </div>
    </div>
  );
}