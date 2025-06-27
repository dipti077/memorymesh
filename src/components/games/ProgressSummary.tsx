import React from 'react';
import { 
  BarChart2, TrendingUp, Award, Zap, 
  Calendar, Brain, Trophy
} from 'lucide-react';

interface ProgressStats {
  gamesPlayed: number;
  totalPoints: number;
  weeklyProgress: number;
  streak: number;
  accuracy: number;
  topCategory: string;
}

interface ProgressSummaryProps {
  stats: ProgressStats;
  className?: string;
}

export function ProgressSummary({ stats, className = '' }: ProgressSummaryProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-md p-6 border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
        </div>
        <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
          Level 3
        </div>
      </div>

      <div className="space-y-6">
        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Games Played</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.gamesPlayed}</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Total Points</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalPoints}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Weekly Progress</span>
            <span className="text-sm text-gray-500">{stats.weeklyProgress}% increase</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-purple-600 h-2.5 rounded-full" 
              style={{ width: `${stats.weeklyProgress}%` }}
            />
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.streak}</p>
            <p className="text-xs text-gray-600">Day Streak</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Brain className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.accuracy}%</p>
            <p className="text-xs text-gray-600">Accuracy</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.topCategory}</p>
            <p className="text-xs text-gray-600">Top Category</p>
          </div>
        </div>

        {/* Next Level Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Next Level</span>
            <span className="text-sm text-gray-500">450 / 1000 points</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full" 
              style={{ width: '45%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}