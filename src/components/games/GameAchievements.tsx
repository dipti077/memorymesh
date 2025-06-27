import React, { useState, useEffect } from 'react';
import { 
  Award, Trophy, Star, Medal, 
  Calendar, Brain, Heart, Sparkles,
  Search, Filter, ChevronDown, ChevronRight
} from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  category: 'completion' | 'skill' | 'streak' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
  dateUnlocked?: string;
  gameId?: string;
  gameName?: string;
}

interface GameAchievementsProps {
  userId: string;
  showFilters?: boolean;
  className?: string;
}

export function GameAchievements({
  userId,
  showFilters = true,
  className = ''
}: GameAchievementsProps) {
  const { isMobile } = useDeviceDetection();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'completion' | 'skill' | 'streak' | 'special'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['completion', 'skill', 'streak', 'special']);

  // Fetch achievements
  useEffect(() => {
    fetchAchievements();
  }, [userId]);

  const fetchAchievements = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - in a real app, this would come from your API
    const mockAchievements: Achievement[] = [
      // Completion Achievements
      {
        id: '1',
        title: 'Memory Novice',
        description: 'Complete your first memory game',
        icon: Trophy,
        category: 'completion',
        rarity: 'common',
        isUnlocked: true,
        dateUnlocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() // 30 days ago
      },
      {
        id: '2',
        title: 'Game Explorer',
        description: 'Play all types of memory games at least once',
        icon: Sparkles,
        category: 'completion',
        rarity: 'uncommon',
        isUnlocked: false,
        progress: 3,
        maxProgress: 5
      },
      {
        id: '3',
        title: 'Memory Master',
        description: 'Complete 50 memory games',
        icon: Award,
        category: 'completion',
        rarity: 'rare',
        isUnlocked: false,
        progress: 12,
        maxProgress: 50
      },
      
      // Skill Achievements
      {
        id: '4',
        title: 'Perfect Score',
        description: 'Get 100% correct answers in any recognition game',
        icon: Star,
        category: 'skill',
        rarity: 'uncommon',
        isUnlocked: true,
        dateUnlocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
        gameId: 'who-is-this',
        gameName: 'Who Is This?'
      },
      {
        id: '5',
        title: 'Speed Demon',
        description: 'Complete a memory matching game in under 60 seconds',
        icon: Calendar,
        category: 'skill',
        rarity: 'rare',
        isUnlocked: false
      },
      {
        id: '6',
        title: 'Timeline Wizard',
        description: 'Correctly sequence 10 events in chronological order without any mistakes',
        icon: Brain,
        category: 'skill',
        rarity: 'epic',
        isUnlocked: false,
        progress: 6,
        maxProgress: 10
      },
      
      // Streak Achievements
      {
        id: '7',
        title: 'Daily Player',
        description: 'Play memory games for 7 consecutive days',
        icon: Calendar,
        category: 'streak',
        rarity: 'common',
        isUnlocked: true,
        dateUnlocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() // 10 days ago
      },
      {
        id: '8',
        title: 'Memory Enthusiast',
        description: 'Play memory games for 30 consecutive days',
        icon: Medal,
        category: 'streak',
        rarity: 'rare',
        isUnlocked: false,
        progress: 5,
        maxProgress: 30
      },
      {
        id: '9',
        title: 'Cognitive Champion',
        description: 'Maintain a 90%+ average score for 14 consecutive days',
        icon: Brain,
        category: 'streak',
        rarity: 'epic',
        isUnlocked: false,
        progress: 3,
        maxProgress: 14
      },
      
      // Special Achievements
      {
        id: '10',
        title: 'Family Historian',
        description: 'Correctly identify all family members in a "Who Is This?" game',
        icon: Heart,
        category: 'special',
        rarity: 'uncommon',
        isUnlocked: true,
        dateUnlocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        gameId: 'who-is-this',
        gameName: 'Who Is This?'
      },
      {
        id: '11',
        title: 'Memory Keeper',
        description: 'Share a game result with your family',
        icon: Heart,
        category: 'special',
        rarity: 'common',
        isUnlocked: true,
        dateUnlocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
      },
      {
        id: '12',
        title: 'Legendary Recall',
        description: 'Achieve a perfect score in all memory game types',
        icon: Trophy,
        category: 'special',
        rarity: 'legendary',
        isUnlocked: false,
        progress: 1,
        maxProgress: 5
      }
    ];
    
    setAchievements(mockAchievements);
    setLoading(false);
  };

  // Filter achievements
  const filteredAchievements = achievements.filter(achievement => {
    // Filter by unlock status
    if (filter === 'unlocked' && !achievement.isUnlocked) return false;
    if (filter === 'locked' && achievement.isUnlocked) return false;
    
    // Filter by category
    if (categoryFilter !== 'all' && achievement.category !== categoryFilter) return false;
    
    // Filter by search query
    if (searchQuery && !achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !achievement.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Group achievements by category
  const groupedAchievements = filteredAchievements.reduce((groups, achievement) => {
    const category = achievement.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(achievement);
    return groups;
  }, {} as Record<string, Achievement[]>);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'completion': return 'Completion Achievements';
      case 'skill': return 'Skill Achievements';
      case 'streak': return 'Streak Achievements';
      case 'special': return 'Special Achievements';
      default: return 'Other Achievements';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'completion': return Trophy;
      case 'skill': return Star;
      case 'streak': return Calendar;
      case 'special': return Heart;
      default: return Award;
    }
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'uncommon': return 'bg-green-100 text-green-700 border-green-200';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate stats
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.isUnlocked).length;
  const completionPercentage = Math.round((unlockedAchievements / totalAchievements) * 100);

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-sage-600" />
            <h3 className="font-semibold text-gray-900">Achievements</h3>
          </div>
          
          {showFilters && (
            <div className="flex items-center space-x-2">
              <TouchOptimized>
                <button
                  onClick={() => setFilter(filter === 'all' ? 'unlocked' : filter === 'unlocked' ? 'locked' : 'all')}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Filter achievements"
                >
                  <Filter size={16} />
                </button>
              </TouchOptimized>
            </div>
          )}
        </div>
      </div>
      
      {/* Stats */}
      <div className="p-4 bg-sage-50 border-b border-sage-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">Progress</h4>
          <span className="text-sm text-gray-600">
            {unlockedAchievements} / {totalAchievements} ({completionPercentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-sage-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            <TouchOptimized>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filter === 'all'
                    ? 'bg-sage-100 text-sage-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                onClick={() => setFilter('unlocked')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filter === 'unlocked'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unlocked
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                onClick={() => setFilter('locked')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filter === 'locked'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Locked
              </button>
            </TouchOptimized>
            
            <div className="relative ml-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                placeholder="Search achievements..."
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Achievements List */}
      <div className="overflow-y-auto max-h-[600px]">
        {loading ? (
          // Loading state
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAchievements.length === 0 ? (
          // Empty state
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Award className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? `No achievements match your search for "${searchQuery}"`
                : filter === 'unlocked'
                ? "You haven't unlocked any achievements yet"
                : filter === 'locked'
                ? "No locked achievements to display"
                : "No achievements available"}
            </p>
          </div>
        ) : (
          // Grouped achievements
          <div>
            {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => {
              const CategoryIcon = getCategoryIcon(category);
              const isExpanded = expandedCategories.includes(category);
              
              return (
                <div key={category} className="border-b border-gray-100 last:border-b-0">
                  <TouchOptimized>
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <CategoryIcon className="w-5 h-5 text-sage-600" />
                        <h4 className="font-medium text-gray-900">{getCategoryName(category)}</h4>
                        <span className="text-sm text-gray-500">
                          ({categoryAchievements.filter(a => a.isUnlocked).length}/{categoryAchievements.length})
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown size={16} className="text-gray-500" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-500" />
                      )}
                    </button>
                  </TouchOptimized>
                  
                  {isExpanded && (
                    <div className="divide-y divide-gray-100">
                      {categoryAchievements.map(achievement => (
                        <div key={achievement.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start space-x-3">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                              achievement.isUnlocked
                                ? getRarityColor(achievement.rarity)
                                : 'bg-gray-100 text-gray-400 border-gray-200'
                            }`}>
                              <achievement.icon className="w-5 h-5" />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className={`font-semibold ${
                                    achievement.isUnlocked ? 'text-gray-900' : 'text-gray-500'
                                  }`}>
                                    {achievement.title}
                                  </h5>
                                  <p className="text-sm text-gray-600">{achievement.description}</p>
                                </div>
                                
                                {/* Rarity Badge */}
                                <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                                  getRarityColor(achievement.rarity)
                                }`}>
                                  {achievement.rarity}
                                </span>
                              </div>
                              
                              {/* Progress or Unlock Date */}
                              {achievement.isUnlocked ? (
                                <div className="mt-2 flex items-center text-xs text-gray-500">
                                  <Calendar size={12} className="mr-1" />
                                  <span>Unlocked: {formatDate(achievement.dateUnlocked)}</span>
                                  {achievement.gameName && (
                                    <>
                                      <span className="mx-1">•</span>
                                      <span>{achievement.gameName}</span>
                                    </>
                                  )}
                                </div>
                              ) : achievement.progress !== undefined && achievement.maxProgress !== undefined ? (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                    <span>Progress: {achievement.progress}/{achievement.maxProgress}</span>
                                    <span>{Math.round((achievement.progress / achievement.maxProgress) * 100)}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-sage-600 h-1.5 rounded-full" 
                                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}