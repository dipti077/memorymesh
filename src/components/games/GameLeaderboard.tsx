import React, { useState, useEffect } from 'react';
import { 
  Trophy, Medal, Award, User, Calendar, 
  ArrowUp, ArrowDown, Filter, Search, 
  ChevronDown, ChevronUp, RefreshCw
} from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRelationship?: string;
  gameId: string;
  gameName: string;
  score: number;
  date: string;
  rank?: number;
  change?: 'up' | 'down' | 'same';
}

interface GameLeaderboardProps {
  familyId: string;
  gameId?: string;
  limit?: number;
  showFilters?: boolean;
  className?: string;
}

export function GameLeaderboard({
  familyId,
  gameId,
  limit = 10,
  showFilters = true,
  className = ''
}: GameLeaderboardProps) {
  const { isMobile } = useDeviceDetection();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('month');
  const [gameFilter, setGameFilter] = useState<string | 'all'>(gameId || 'all');
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGameDropdown, setShowGameDropdown] = useState(false);

  // Fetch leaderboard data
  useEffect(() => {
    fetchLeaderboard();
  }, [familyId, gameId, limit, timeRange, gameFilter, sortBy]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - in a real app, this would come from your API
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'Mom',
        userRelationship: 'Mother',
        gameId: 'who-is-this',
        gameName: 'Who Is This?',
        score: 250,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        rank: 1,
        change: 'same'
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Dad',
        userRelationship: 'Father',
        gameId: 'memory-pairs',
        gameName: 'Memory Pairs',
        score: 220,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        rank: 2,
        change: 'up'
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Grandma',
        userRelationship: 'Grandmother',
        gameId: 'story-complete',
        gameName: 'Story Complete',
        score: 210,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        rank: 3,
        change: 'down'
      },
      {
        id: '4',
        userId: 'user4',
        userName: 'Sarah',
        userRelationship: 'Daughter',
        gameId: 'who-is-this',
        gameName: 'Who Is This?',
        score: 195,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
        rank: 4,
        change: 'up'
      },
      {
        id: '5',
        userId: 'user5',
        userName: 'Uncle John',
        userRelationship: 'Uncle',
        gameId: 'timeline-sort',
        gameName: 'Timeline Sort',
        score: 180,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
        rank: 5,
        change: 'down'
      },
      {
        id: '6',
        userId: 'user6',
        userName: 'Grandpa',
        userRelationship: 'Grandfather',
        gameId: 'memory-pairs',
        gameName: 'Memory Pairs',
        score: 165,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
        rank: 6,
        change: 'same'
      },
      {
        id: '7',
        userId: 'user7',
        userName: 'Cousin Emma',
        userRelationship: 'Cousin',
        gameId: 'face-match',
        gameName: 'Face Match',
        score: 150,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
        rank: 7,
        change: 'up'
      },
      {
        id: '8',
        userId: 'user8',
        userName: 'Aunt Lisa',
        userRelationship: 'Aunt',
        gameId: 'story-complete',
        gameName: 'Story Complete',
        score: 140,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(), // 21 days ago
        rank: 8,
        change: 'down'
      },
      {
        id: '9',
        userId: 'user9',
        userName: 'Brother Mike',
        userRelationship: 'Brother',
        gameId: 'who-is-this',
        gameName: 'Who Is This?',
        score: 130,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(), // 28 days ago
        rank: 9,
        change: 'same'
      },
      {
        id: '10',
        userId: 'user10',
        userName: 'Cousin Jake',
        userRelationship: 'Cousin',
        gameId: 'timeline-sort',
        gameName: 'Timeline Sort',
        score: 120,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(), // 35 days ago
        rank: 10,
        change: 'up'
      }
    ];
    
    // Apply filters
    let filtered = [...mockLeaderboard];
    
    // Game filter
    if (gameFilter !== 'all') {
      filtered = filtered.filter(entry => entry.gameId === gameFilter);
    }
    
    // Time range filter
    const now = new Date();
    let cutoffDate: Date;
    
    switch (timeRange) {
      case 'week':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffDate = new Date(0); // Beginning of time
    }
    
    filtered = filtered.filter(entry => new Date(entry.date) >= cutoffDate);
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(entry => 
        entry.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.gameName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'score') {
        return b.score - a.score;
      } else {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
    
    // Apply limit
    filtered = filtered.slice(0, limit);
    
    // Update ranks
    filtered = filtered.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
    
    setLeaderboard(filtered);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2: return 'bg-gray-100 text-gray-800 border-gray-200';
      case 3: return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-white text-gray-700 border-gray-200';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-4 h-4 text-yellow-600" />;
      case 2: return <Medal className="w-4 h-4 text-gray-600" />;
      case 3: return <Award className="w-4 h-4 text-amber-600" />;
      default: return null;
    }
  };

  const getChangeIcon = (change?: 'up' | 'down' | 'same') => {
    switch (change) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  // Available games for filter
  const games = [
    { id: 'all', name: 'All Games' },
    { id: 'who-is-this', name: 'Who Is This?' },
    { id: 'memory-pairs', name: 'Memory Pairs' },
    { id: 'face-match', name: 'Face Match' },
    { id: 'timeline-sort', name: 'Timeline Sort' },
    { id: 'story-complete', name: 'Story Complete' }
  ];

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-sage-600" />
            <h3 className="font-semibold text-gray-900">Family Leaderboard</h3>
          </div>
          
          {showFilters && (
            <div className="flex items-center space-x-2">
              <TouchOptimized>
                <button
                  onClick={() => fetchLeaderboard()}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Refresh leaderboard"
                >
                  <RefreshCw size={16} />
                </button>
              </TouchOptimized>
              
              <TouchOptimized>
                <button
                  onClick={() => setShowGameDropdown(!showGameDropdown)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Filter leaderboard"
                >
                  <Filter size={16} />
                </button>
              </TouchOptimized>
            </div>
          )}
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && showGameDropdown && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Game Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Game
              </label>
              <select
                value={gameFilter}
                onChange={(e) => setGameFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              >
                {games.map(game => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Time Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
            
            {/* Search */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  placeholder="Search by name or game..."
                />
              </div>
            </div>
            
            {/* Sort By */}
            <div className="sm:col-span-2 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <TouchOptimized>
                  <button
                    onClick={() => setSortBy('score')}
                    className={`flex items-center space-x-1 text-sm ${
                      sortBy === 'score' ? 'text-sage-600 font-medium' : 'text-gray-600'
                    }`}
                  >
                    <Trophy size={14} />
                    <span>Score</span>
                    {sortBy === 'score' && <ChevronDown size={14} />}
                  </button>
                </TouchOptimized>
                
                <TouchOptimized>
                  <button
                    onClick={() => setSortBy('date')}
                    className={`flex items-center space-x-1 text-sm ${
                      sortBy === 'date' ? 'text-sage-600 font-medium' : 'text-gray-600'
                    }`}
                  >
                    <Calendar size={14} />
                    <span>Recent</span>
                    {sortBy === 'date' && <ChevronDown size={14} />}
                  </button>
                </TouchOptimized>
              </div>
              
              <TouchOptimized>
                <button
                  onClick={() => {
                    setGameFilter('all');
                    setTimeRange('month');
                    setSortBy('score');
                    setSearchQuery('');
                  }}
                  className="text-sm text-sage-600 hover:text-sage-700 font-medium"
                >
                  Reset Filters
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      )}
      
      {/* Leaderboard */}
      <div className="overflow-hidden">
        {loading ? (
          // Loading state
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          // Empty state
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No leaderboard data</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : gameFilter !== 'all'
                ? `No scores for this game in the selected time period`
                : `Start playing memory games to appear on the leaderboard`}
            </p>
          </div>
        ) : (
          // Leaderboard entries
          <div className="divide-y divide-gray-100">
            {leaderboard.map((entry) => (
              <div key={entry.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${getRankColor(entry.rank || 0)}`}>
                    {getRankIcon(entry.rank || 0) || <span className="text-sm font-semibold">{entry.rank}</span>}
                  </div>
                  
                  {/* User */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <p className="font-semibold text-gray-900 truncate">
                        {entry.userName}
                      </p>
                      {entry.change && (
                        <span className="ml-2">
                          {getChangeIcon(entry.change)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="truncate">{entry.userRelationship}</span>
                      <span className="mx-1">•</span>
                      <span className="truncate">{entry.gameName}</span>
                    </div>
                  </div>
                  
                  {/* Score */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-sage-700">{entry.score}</p>
                    <p className="text-xs text-gray-500">{formatDate(entry.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
        <p className="text-sm text-gray-600">
          {gameFilter === 'all'
            ? `Showing top ${leaderboard.length} scores across all games`
            : `Showing top ${leaderboard.length} scores for ${games.find(g => g.id === gameFilter)?.name}`}
        </p>
      </div>
    </div>
  );
}