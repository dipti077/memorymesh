import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { useNativeFeatures } from '../../hooks/useNativeFeatures';

interface SuccessCelebrationProps {
  /**
   * Whether the celebration is visible
   */
  isVisible: boolean;
  
  /**
   * Success message
   */
  message: string;
  
  /**
   * Function to call when the celebration is dismissed
   */
  onDismiss: () => void;
  
  /**
   * Auto-dismiss duration in milliseconds (0 for no auto-dismiss)
   */
  duration?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function SuccessCelebration({
  isVisible,
  message,
  onDismiss,
  duration = 3000,
  className = '',
}: SuccessCelebrationProps) {
  const [isShowing, setIsShowing] = useState(false);
  const { isMobile } = useDeviceDetection();
  const { hapticFeedback } = useNativeFeatures();
  
  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      
      // Trigger haptic feedback on mobile devices
      if (isMobile) {
        hapticFeedback('medium');
      }
      
      // Auto-dismiss after duration
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsShowing(false);
          setTimeout(onDismiss, 500); // Wait for exit animation
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsShowing(false);
    }
  }, [isVisible, duration, onDismiss, isMobile, hapticFeedback]);
  
  if (!isVisible && !isShowing) return null;
  
  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        ${isShowing ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        transition-opacity duration-500
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onDismiss} />
      
      <div
        className={`
          bg-white rounded-xl shadow-xl p-6 max-w-sm w-full
          transform transition-transform duration-500
          ${isShowing ? 'scale-100' : 'scale-90'}
          relative
        `}
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Success!</h3>
          
          <p className="text-gray-600 text-center mb-4">{message}</p>
          
          {/* Confetti animation */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="relative w-40 h-40">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={`
                    absolute w-2 h-2 rounded-full
                    ${['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'][i % 5]}
                    animate-confetti
                  `}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${1 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}