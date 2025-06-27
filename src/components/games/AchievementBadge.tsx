import React from 'react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  progress: number;
  total: number;
  color: string;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  className?: string;
}

export function AchievementBadge({ achievement, className = '' }: AchievementBadgeProps) {
  const progressPercentage = Math.round((achievement.progress / achievement.total) * 100);
  const isCompleted = achievement.progress >= achievement.total;

  return (
    <TouchOptimized>
      <div className={`bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow ${className}`}>
        <div className="flex items-center space-x-3">
          <div className={`${achievement.color} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            isCompleted ? 'ring-2 ring-yellow-300' : ''
          }`}>
            <achievement.icon className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 text-sm">{achievement.title}</h3>
              {isCompleted && (
                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  Completed!
                </span>
              )}
            </div>
            <p className="text-gray-600 text-xs mb-2">{achievement.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="w-full max-w-[150px] bg-gray-200 rounded-full h-1.5 mr-2">
                <div 
                  className={`h-1.5 rounded-full ${isCompleted ? 'bg-yellow-500' : achievement.color}`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {achievement.progress}/{achievement.total}
              </span>
            </div>
          </div>
        </div>
      </div>
    </TouchOptimized>
  );
}