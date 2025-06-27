import React, { useState } from 'react';
import { 
  Gamepad2, Brain, Users, Clock, Award, Trophy, 
  Calendar, Zap, Sparkles, ChevronRight, Star, 
  BarChart2, TrendingUp, Medal, Heart, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { GameCard } from './GameCard';
import { GameCategorySelector } from './GameCategorySelector';
import { ProgressSummary } from './ProgressSummary';
import { AchievementBadge } from './AchievementBadge';
import { DailyChallenge } from './DailyChallenge';

interface MemoryGamesHubProps {
  className?: string;
}

export function MemoryGamesHub({ className = '' }: MemoryGamesHubProps) {
  const { isMobile } = useDeviceDetection();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Mock data for games
  const games = [
    {
      id: 'photo-recognition',
      title: 'Who is This?',
      description: 'Test your ability to recognize family members in photos',
      category: 'recognition',
      difficulty: 'medium',
      icon: Eye,
      color: 'bg-blue-600',
      isNew: false,
      isRecommended: true,
      lastPlayed: '2 days ago',
      progress: 65,
      thumbnail: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'date-guessing',
      title: 'When Was This?',
      description: 'Guess when these family memories took place',
      category: 'timeline',
      difficulty: 'hard',
      icon: Calendar,
      color: 'bg-green-600',
      isNew: false,
      isRecommended: false,
      lastPlayed: '1 week ago',
      progress: 42,
      thumbnail: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'location-matching',
      title: 'Memory Places',
      description: 'Match memories to their locations',
      category: 'matching',
      difficulty: 'easy',
      icon: Gamepad2,
      color: 'bg-purple-600',
      isNew: true,
      isRecommended: true,
      lastPlayed: null,
      progress: 0,
      thumbnail: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'story-completion',
      title: 'Complete the Story',
      description: 'Fill in missing details from family stories',
      category: 'narrative',
      difficulty: 'medium',
      icon: Brain,
      color: 'bg-orange-600',
      isNew: false,
      isRecommended: false,
      lastPlayed: '3 days ago',
      progress: 78,
      thumbnail: null
    },
    {
      id: 'face-matching',
      title: 'Match the Faces',
      description: 'Match the same people across different photos',
      category: 'matching',
      difficulty: 'easy',
      icon: Users,
      color: 'bg-pink-600',
      isNew: false,
      isRecommended: true,
      lastPlayed: 'Yesterday',
      progress: 90,
      thumbnail: 'https://images.pexels.com/photos/1257110/pexels-photo-1257110.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'memory-sequencing',
      title: 'Timeline Order',
      description: 'Put family events in chronological order',
      category: 'timeline',
      difficulty: 'hard',
      icon: Clock,
      color: 'bg-teal-600',
      isNew: true,
      isRecommended: false,
      lastPlayed: null,
      progress: 0,
      thumbnail: null
    }
  ];

  // Filter games by category
  const filteredGames = activeCategory === 'all' 
    ? games 
    : games.filter(game => game.category === activeCategory);

  // Mock data for achievements
  const achievements = [
    {
      id: 'memory-master',
      title: 'Memory Master',
      description: 'Complete 10 memory games',
      icon: Trophy,
      progress: 7,
      total: 10,
      color: 'bg-yellow-500'
    },
    {
      id: 'recognition-expert',
      title: 'Recognition Expert',
      description: 'Correctly identify 50 family members',
      icon: Eye,
      progress: 32,
      total: 50,
      color: 'bg-blue-500'
    },
    {
      id: 'timeline-wizard',
      title: 'Timeline Wizard',
      description: 'Order events correctly 25 times',
      icon: Calendar,
      progress: 18,
      total: 25,
      color: 'bg-green-500'
    }
  ];

  // Mock data for progress stats
  const progressStats = {
    gamesPlayed: 24,
    totalPoints: 1250,
    weeklyProgress: 15,
    streak: 3,
    accuracy: 78,
    topCategory: 'Recognition'
  };

  // Game categories
  const categories = [
    { id: 'all', name: 'All Games', icon: Gamepad2 },
    { id: 'recognition', name: 'Recognition', icon: Eye },
    { id: 'matching', name: 'Matching', icon: Users },
    { id: 'timeline', name: 'Timeline', icon: Clock },
    { id: 'narrative', name: 'Narrative', icon: Brain }
  ];

  // Daily challenge
  const dailyChallenge = {
    title: 'Family Faces',
    description: 'Identify 10 family members from old photos',
    reward: 100,
    icon: Award,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    expiresIn: '14 hours'
  };

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-purple-600 p-3 rounded-xl">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Memory Games</h1>
            <p className="text-lg text-gray-600">
              Fun activities to strengthen memory and cognitive wellness
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Games */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Challenge */}
          <DailyChallenge challenge={dailyChallenge} />

          {/* Game Categories */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <GameCategorySelector 
              categories={categories} 
              activeCategory={activeCategory} 
              onSelectCategory={setActiveCategory} 
            />
          </div>

          {/* Games Grid */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {activeCategory === 'all' ? 'All Games' : 
                  `${categories.find(c => c.id === activeCategory)?.name} Games`}
              </h2>
              <span className="text-sm text-gray-500">
                {filteredGames.length} games available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {filteredGames.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Gamepad2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No games found</h3>
                <p className="text-gray-600">
                  No games available in this category yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Progress & Achievements */}
        <div className="space-y-6">
          {/* Progress Summary */}
          <ProgressSummary stats={progressStats} />

          {/* Achievements */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
              </div>
              <TouchOptimized>
                <Link 
                  to="/games/achievements" 
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
                >
                  <span>View All</span>
                  <ChevronRight size={16} />
                </Link>
              </TouchOptimized>
            </div>

            <div className="space-y-4">
              {achievements.map(achievement => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>

          {/* Cognitive Benefits */}
          <div className="bg-gradient-to-r from-sage-50 to-sage-100 rounded-2xl p-6 border border-sage-200">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-sage-700" />
              <h2 className="text-lg font-bold text-sage-800">Cognitive Benefits</h2>
            </div>
            <p className="text-sage-700 text-sm mb-4">
              Regular memory games can help maintain and improve cognitive function, especially for those experiencing memory challenges.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white bg-opacity-60 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Brain className="w-4 h-4 text-sage-600" />
                  <span className="text-sm font-medium text-sage-800">Memory</span>
                </div>
                <div className="w-full bg-sage-200 rounded-full h-2">
                  <div className="bg-sage-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="bg-white bg-opacity-60 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Zap className="w-4 h-4 text-sage-600" />
                  <span className="text-sm font-medium text-sage-800">Focus</span>
                </div>
                <div className="w-full bg-sage-200 rounded-full h-2">
                  <div className="bg-sage-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div className="bg-white bg-opacity-60 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Sparkles className="w-4 h-4 text-sage-600" />
                  <span className="text-sm font-medium text-sage-800">Recognition</span>
                </div>
                <div className="w-full bg-sage-200 rounded-full h-2">
                  <div className="bg-sage-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="bg-white bg-opacity-60 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Heart className="w-4 h-4 text-sage-600" />
                  <span className="text-sm font-medium text-sage-800">Connection</span>
                </div>
                <div className="w-full bg-sage-200 rounded-full h-2">
                  <div className="bg-sage-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}