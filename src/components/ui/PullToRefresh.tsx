import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
  pullDistance?: number;
  refreshingText?: string;
  pullingText?: string;
  releaseText?: string;
}

export function PullToRefresh({
  children,
  onRefresh,
  className = '',
  pullDistance = 80,
  refreshingText = 'Refreshing...',
  pullingText = 'Pull to refresh',
  releaseText = 'Release to refresh'
}: PullToRefreshProps) {
  const { isTouchDevice } = useDeviceDetection();
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullY, setPullY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const currentY = useRef<number | null>(null);

  useEffect(() => {
    // Clean up if component unmounts during refresh
    return () => {
      setIsRefreshing(false);
      setPullY(0);
    };
  }, []);

  if (!isTouchDevice) {
    return <div className={className}>{children}</div>;
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable pull-to-refresh when at the top of the page
    if (window.scrollY > 0) return;
    
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
    setIsPulling(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startY.current || !isPulling) return;
    
    currentY.current = e.touches[0].clientY;
    const deltaY = Math.max(0, (currentY.current - startY.current) * 0.5);
    
    // Only allow pulling down when at the top of the page
    if (window.scrollY > 0) {
      setPullY(0);
      return;
    }
    
    setPullY(deltaY);
    
    // Prevent default scrolling when pulling
    if (deltaY > 5) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;
    
    if (pullY >= pullDistance) {
      setIsRefreshing(true);
      setPullY(0);
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh error:', error);
      } finally {
        setIsRefreshing(false);
      }
    } else {
      setPullY(0);
    }
    
    setIsPulling(false);
    startY.current = null;
    currentY.current = null;
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div 
        className="absolute left-0 right-0 flex justify-center items-center transition-transform duration-200 z-10 pointer-events-none"
        style={{ 
          transform: `translateY(${Math.max(0, pullY - 50)}px)`,
          opacity: Math.min(1, pullY / 50)
        }}
      >
        <div className="bg-white rounded-full shadow-md p-3 flex items-center space-x-2">
          <RefreshCw 
            size={20} 
            className={`text-sage-600 ${isRefreshing ? 'animate-spin' : ''} ${
              !isRefreshing && pullY > 0 ? `transform rotate-${Math.min(180, Math.floor((pullY / pullDistance) * 180))}` : ''
            }`} 
          />
          <span className="text-sm font-medium text-gray-700">
            {isRefreshing 
              ? refreshingText 
              : pullY >= pullDistance 
              ? releaseText 
              : pullingText}
          </span>
        </div>
      </div>
      
      {/* Content with pull effect */}
      <div
        style={{ 
          transform: isRefreshing ? 'translateY(50px)' : `translateY(${pullY}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
}