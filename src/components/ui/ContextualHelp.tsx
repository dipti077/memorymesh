import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { TouchOptimized } from './TouchOptimized';

interface ContextualHelpProps {
  /**
   * Help content
   */
  children: React.ReactNode;
  
  /**
   * Help title
   */
  title?: string;
  
  /**
   * Position of the tooltip
   */
  position?: 'top' | 'bottom' | 'left' | 'right';
  
  /**
   * Whether to show the help icon
   */
  showIcon?: boolean;
  
  /**
   * Additional CSS classes for the trigger
   */
  triggerClassName?: string;
  
  /**
   * Additional CSS classes for the tooltip
   */
  tooltipClassName?: string;
}

export function ContextualHelp({
  children,
  title,
  position = 'top',
  showIcon = true,
  triggerClassName = '',
  tooltipClassName = '',
}: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Position classes
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };
  
  // Arrow classes
  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-sage-100 border-r-transparent border-b-transparent border-l-transparent',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-t-transparent border-r-transparent border-b-sage-100 border-l-transparent',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-r-transparent border-b-transparent border-l-sage-100',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-r-sage-100 border-b-transparent border-l-transparent',
  };
  
  return (
    <div className="relative inline-block">
      <TouchOptimized>
        <button
          ref={triggerRef}
          type="button"
          className={`
            inline-flex items-center justify-center
            text-gray-500 hover:text-sage-600
            focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-opacity-50
            ${triggerClassName}
          `}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          {showIcon && <HelpCircle size={16} />}
        </button>
      </TouchOptimized>
      
      {isOpen && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 w-64
            ${positionClasses[position]}
            ${tooltipClassName}
          `}
          role="tooltip"
        >
          <div className="bg-sage-100 rounded-lg shadow-lg p-3">
            <div className="flex items-start justify-between mb-1">
              {title && (
                <h4 className="text-sm font-semibold text-sage-800">{title}</h4>
              )}
              <TouchOptimized>
                <button
                  type="button"
                  className="text-sage-500 hover:text-sage-700"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={14} />
                </button>
              </TouchOptimized>
            </div>
            
            <div className="text-sm text-sage-700">
              {children}
            </div>
          </div>
          
          <div
            className={`
              absolute w-0 h-0
              border-solid border-4
              ${arrowClasses[position]}
            `}
          />
        </div>
      )}
    </div>
  );
}