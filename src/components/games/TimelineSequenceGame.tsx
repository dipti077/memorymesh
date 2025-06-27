import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Award, ArrowLeft, 
  Sparkles, Check, X, Share2, Trophy,
  AlertCircle, ChevronRight, ChevronLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface MemoryEvent {
  id: string;
  title: string;
  date: string;
  imageUrl?: string;
  description?: string;
}

interface GameResult {
  score: number;
  correctSequences: number;
  totalSequences: number;
  timeSpent: number;
  date: string;
}

interface TimelineSequenceGameProps {
  gameId: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'adaptive';
  onComplete?: (result: GameResult) => void;
  className?: string;
}

export function TimelineSequenceGame({
  gameId,
  difficulty = 'adaptive',
  onComplete,
  className = ''
}: TimelineSequenceGameProps) {
  const { isMobile } = useDeviceDetection();
  const navigate = useNavigate();
  
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'results'>('intro');
  const [sequences, setSequences] = useState<MemoryEvent[][]>([]);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [userSequence, setUserSequence] = useState<MemoryEvent[]>([]);
  const [availableEvents, setAvailableEvents] = useState<MemoryEvent[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [results, setResults] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctSequences, setCorrectSequences] = useState(0);

  // Get sequence length based on difficulty
  const getSequenceLength = () => {
    switch (difficulty) {
      case 'easy': return 3;
      case 'medium': return 4;
      case 'hard': return 5;
      case 'adaptive': return 4;
      default: return 4;
    }
  };

  // Get number of sequences based on difficulty
  const getNumSequences = () => {
    switch (difficulty) {
      case 'easy': return 3;
      case 'medium': return 4;
      case 'hard': return 5;
      case 'adaptive': return 4;
      default: return 4;
    }
  };

  // Get time limit based on difficulty
  const getTimeLimit = () => {
    switch (difficulty) {
      case 'easy': return 60; // 1 minute per sequence
      case 'medium': return 45; // 45 seconds per sequence
      case 'hard': return 30; // 30 seconds per sequence
      case 'adaptive': return 45; // 45 seconds per sequence
      default: return 45;
    }
  };

  // Load sequences
  useEffect(() => {
    if (gameState === 'intro') {
      loadSequences();
    }
  }, [gameState, difficulty]);

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === 'playing' && timeLeft > 0 && !showFeedback) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      if (timeLeft === 0) {
        // Time's up
        checkSequence();
      }
    }
    
    return () => clearTimeout(timer);
  }, [gameState, timeLeft, showFeedback]);

  // Set up current sequence
  useEffect(() => {
    if (gameState === 'playing' && sequences.length > 0) {
      const currentSequence = sequences[currentSequenceIndex];
      
      // Shuffle events for the user to arrange
      const shuffled = [...currentSequence].sort(() => Math.random() - 0.5);
      
      setAvailableEvents(shuffled);
      setUserSequence([]);
      setTimeLeft(getTimeLimit());
      setShowFeedback(false);
    }
  }, [gameState, currentSequenceIndex, sequences]);

  const loadSequences = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - in a real app, this would come from your API with actual family events
    const mockEvents: MemoryEvent[] = [
      {
        id: '1',
        title: 'Family Vacation to Hawaii',
        date: '2018-07-15',
        imageUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Our first big family trip to Hawaii'
      },
      {
        id: '2',
        title: 'Sarah\'s Graduation',
        date: '2019-05-20',
        imageUrl: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Sarah graduated from college'
      },
      {
        id: '3',
        title: 'Grandma\'s 80th Birthday',
        date: '2020-03-10',
        imageUrl: 'https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Big celebration for Grandma'
      },
      {
        id: '4',
        title: 'Family Reunion',
        date: '2021-07-04',
        imageUrl: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'First time the whole family got together after the pandemic'
      },
      {
        id: '5',
        title: 'Christmas 2021',
        date: '2021-12-25',
        imageUrl: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Christmas morning opening presents'
      },
      {
        id: '6',
        title: 'Mike\'s Wedding',
        date: '2022-06-18',
        imageUrl: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Cousin Mike got married'
      },
      {
        id: '7',
        title: 'New House Move-In',
        date: '2022-09-01',
        imageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Moving into our new family home'
      },
      {
        id: '8',
        title: 'Baby Emma\'s Birth',
        date: '2023-02-14',
        imageUrl: 'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Welcoming the newest family member'
      },
      {
        id: '9',
        title: 'Summer BBQ',
        date: '2023-07-22',
        imageUrl: 'https://images.pexels.com/photos/1449057/pexels-photo-1449057.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Annual family barbecue'
      },
      {
        id: '10',
        title: 'Dad\'s Retirement Party',
        date: '2023-10-15',
        imageUrl: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Celebrating Dad\'s retirement after 35 years'
      },
      {
        id: '11',
        title: 'Thanksgiving 2023',
        date: '2023-11-23',
        imageUrl: 'https://images.pexels.com/photos/5765828/pexels-photo-5765828.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Family Thanksgiving dinner'
      },
      {
        id: '12',
        title: 'New Year\'s Eve 2024',
        date: '2024-01-01',
        imageUrl: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Celebrating the new year together'
      }
    ];
    
    // Sort events by date
    const sortedEvents = [...mockEvents].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Create sequences of events
    const numSequences = getNumSequences();
    const sequenceLength = getSequenceLength();
    const gameSequences: MemoryEvent[][] = [];
    
    // Create random sequences of consecutive events
    for (let i = 0; i < numSequences; i++) {
      const startIndex = Math.floor(Math.random() * (sortedEvents.length - sequenceLength));
      const sequence = sortedEvents.slice(startIndex, startIndex + sequenceLength);
      gameSequences.push(sequence);
    }
    
    setSequences(gameSequences);
    setLoading(false);
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentSequenceIndex(0);
    setUserSequence([]);
    setScore(0);
    setGameStartTime(Date.now());
    setCorrectSequences(0);
  };

  const handleEventSelect = (event: MemoryEvent) => {
    // Add event to user sequence
    setUserSequence(prev => [...prev, event]);
    
    // Remove from available events
    setAvailableEvents(prev => prev.filter(e => e.id !== event.id));
  };

  const handleEventRemove = (event: MemoryEvent) => {
    // Remove event from user sequence
    setUserSequence(prev => prev.filter(e => e.id !== event.id));
    
    // Add back to available events
    setAvailableEvents(prev => [...prev, event]);
  };

  const checkSequence = () => {
    const currentSequence = sequences[currentSequenceIndex];
    
    // Check if user sequence is correct
    let isSequenceCorrect = true;
    
    if (userSequence.length !== currentSequence.length) {
      isSequenceCorrect = false;
    } else {
      for (let i = 0; i < userSequence.length; i++) {
        const userDate = new Date(userSequence[i].date).getTime();
        const correctDate = new Date(currentSequence[i].date).getTime();
        
        if (userDate !== correctDate) {
          isSequenceCorrect = false;
          break;
        }
      }
    }
    
    setIsCorrect(isSequenceCorrect);
    setShowFeedback(true);
    
    if (isSequenceCorrect) {
      // Calculate points based on time left and difficulty
      const timeBonus = Math.floor(timeLeft / 2);
      const difficultyMultiplier = 
        difficulty === 'easy' ? 1 :
        difficulty === 'medium' ? 1.5 :
        difficulty === 'hard' ? 2 : 1.5;
      
      const pointsEarned = Math.floor((20 + timeBonus) * difficultyMultiplier);
      setScore(prev => prev + pointsEarned);
      setCorrectSequences(prev => prev + 1);
    }
    
    // Show feedback for 2 seconds
    setTimeout(() => {
      setShowFeedback(false);
      
      // Move to next sequence or end game
      if (currentSequenceIndex < sequences.length - 1) {
        setCurrentSequenceIndex(prev => prev + 1);
      } else {
        // End game
        const totalTime = Math.floor((Date.now() - gameStartTime) / 1000);
        
        const result: GameResult = {
          score,
          correctSequences: isSequenceCorrect ? correctSequences + 1 : correctSequences,
          totalSequences: sequences.length,
          timeSpent: totalTime,
          date: new Date().toISOString()
        };
        
        setResults(result);
        setGameState('results');
        
        if (onComplete) {
          onComplete(result);
        }
      }
    }, 2000);
  };

  const handleSubmit = () => {
    if (userSequence.length === sequences[currentSequenceIndex].length) {
      checkSequence();
    }
  };

  const handlePlayAgain = () => {
    loadSequences();
    startGame();
  };

  const handleBackToGames = () => {
    navigate('/games');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const currentSequence = sequences[currentSequenceIndex];

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Game Intro */}
      {gameState === 'intro' && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-sage-700 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Timeline Sequence</h2>
            </div>
            
            <TouchOptimized>
              <Link
                to="/games"
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
            </TouchOptimized>
          </div>
          
          <div className="mb-8">
            <p className="text-lg text-gray-700 mb-4">
              Arrange family memories in chronological order
            </p>
            
            <div className="bg-sage-50 rounded-lg p-4 border border-sage-100">
              <h3 className="font-semibold text-gray-900 mb-2">How to Play:</h3>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                  </div>
                  <span>You'll be shown a set of family memories</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                  </div>
                  <span>Arrange them in chronological order (oldest to newest)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                  </div>
                  <span>Complete each sequence before time runs out</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                  </div>
                  <span>The faster you arrange them, the higher your score</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{getNumSequences()} sequences</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{difficulty} difficulty</span>
              </div>
            </div>
            
            <TouchOptimized>
              <button
                onClick={startGame}
                disabled={loading}
                className="bg-sage-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-sage-800 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Loading...' : 'Start Game'}
              </button>
            </TouchOptimized>
          </div>
        </div>
      )}
      
      {/* Game Play */}
      {gameState === 'playing' && currentSequence && (
        <div>
          {/* Game Header */}
          <div className="p-4 border-b border-gray-200 bg-sage-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TouchOptimized>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to quit? Your progress will be lost.')) {
                        navigate('/games');
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                </TouchOptimized>
                
                <h2 className="font-semibold text-gray-900">Timeline Sequence</h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-sage-600" />
                  <span className="font-medium text-gray-900">{score}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-600'}`} />
                  <span className={`font-medium ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>
            </div>
            
            {/* Progress */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-sage-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${((currentSequenceIndex + 1) / sequences.length) * 100}%` }}
              ></div>
            </div>
            <div className="mt-1 text-xs text-gray-500 text-right">
              Sequence {currentSequenceIndex + 1} of {sequences.length}
            </div>
          </div>
          
          {/* Game Content */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Arrange these events in chronological order (oldest to newest)
            </h3>
            
            {/* Feedback */}
            {showFeedback && (
              <div className={`p-4 rounded-lg mb-6 ${
                isCorrect 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <div className="flex items-center space-x-2">
                  {isCorrect ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Correct! You arranged the events in the right order.</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">
                        Not quite right. The correct order is shown below.
                      </span>
                    </>
                  )}
                </div>
                
                {!isCorrect && (
                  <div className="mt-3 space-y-2">
                    {currentSequence.map((event, index) => (
                      <div key={event.id} className="flex items-center space-x-3">
                        <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 border border-gray-300">
                          {index + 1}
                        </div>
                        <div className="flex-1 bg-white p-2 rounded border border-gray-200">
                          <p className="font-medium text-gray-900">{event.title}</p>
                          <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* User Sequence */}
            <div className="mb-6">
              <h4 className="text-base font-medium text-gray-700 mb-3">Your Timeline:</h4>
              
              {userSequence.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-gray-500">Drag events here to create your timeline</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {userSequence.map((event, index) => (
                    <TouchOptimized key={event.id}>
                      <div 
                        className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200 hover:border-sage-300 transition-colors"
                        onClick={() => !showFeedback && handleEventRemove(event)}
                      >
                        <div className="bg-sage-100 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-sage-700">
                          {index + 1}
                        </div>
                        
                        {event.imageUrl && (
                          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={event.imageUrl} 
                              alt={event.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{event.title}</p>
                          {!showFeedback && (
                            <p className="text-xs text-gray-500">{event.description}</p>
                          )}
                          {showFeedback && (
                            <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                          )}
                        </div>
                        
                        {!showFeedback && (
                          <X size={16} className="text-gray-400 hover:text-gray-600" />
                        )}
                      </div>
                    </TouchOptimized>
                  ))}
                </div>
              )}
            </div>
            
            {/* Available Events */}
            {!showFeedback && (
              <>
                <h4 className="text-base font-medium text-gray-700 mb-3">Available Events:</h4>
                
                <div className="space-y-2 mb-6">
                  {availableEvents.map(event => (
                    <TouchOptimized key={event.id}>
                      <div 
                        className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-sage-300 transition-colors"
                        onClick={() => handleEventSelect(event)}
                      >
                        {event.imageUrl && (
                          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={event.imageUrl} 
                              alt={event.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{event.title}</p>
                          <p className="text-xs text-gray-500">{event.description}</p>
                        </div>
                        
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    </TouchOptimized>
                  ))}
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-end">
                  <TouchOptimized>
                    <button
                      onClick={handleSubmit}
                      disabled={userSequence.length !== currentSequence.length}
                      className="bg-sage-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-sage-800 disabled:opacity-50 transition-colors"
                    >
                      Submit Timeline
                    </button>
                  </TouchOptimized>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Results */}
      {gameState === 'results' && results && (
        <div className="p-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-sage-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-sage-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Game Complete!</h2>
            <p className="text-gray-600">
              You've completed the Timeline Sequence game
            </p>
          </div>
          
          {/* Score */}
          <div className="bg-gradient-to-r from-sage-700 to-sage-600 rounded-xl p-6 text-white mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Your Score</h3>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-2xl font-bold">{results.score}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Correct Sequences</span>
                </div>
                <p className="text-xl font-semibold">
                  {results.correctSequences} / {results.totalSequences}
                </p>
              </div>
              
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Time Spent</span>
                </div>
                <p className="text-xl font-semibold">
                  {results.timeSpent} seconds
                </p>
              </div>
            </div>
          </div>
          
          {/* Achievements */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements Earned</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {results.correctSequences === results.totalSequences && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Time Traveler</p>
                    <p className="text-xs text-gray-600">All sequences correct</p>
                  </div>
                </div>
              )}
              
              {results.timeSpent < 120 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Quick Thinker</p>
                    <p className="text-xs text-gray-600">Completed in under 2 minutes</p>
                  </div>
                </div>
              )}
              
              {results.score > 200 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">History Buff</p>
                    <p className="text-xs text-gray-600">Scored over 200 points</p>
                  </div>
                </div>
              )}
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Chronologist</p>
                  <p className="text-xs text-gray-600">Completed a timeline game</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Cognitive Benefits */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">Cognitive Benefits:</h3>
            <ul className="text-gray-700 space-y-2">
              <li className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                </div>
                <span>Improved temporal memory and sequencing skills</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                </div>
                <span>Enhanced episodic memory of family events</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                </div>
                <span>Better understanding of family history and chronology</span>
              </li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <TouchOptimized>
              <button
                onClick={handlePlayAgain}
                className="flex-1 bg-sage-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-sage-800 transition-colors text-center"
              >
                Play Again
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                onClick={handleBackToGames}
                className="flex-1 border-2 border-sage-700 text-sage-700 px-6 py-3 rounded-lg font-medium hover:bg-sage-50 transition-colors text-center"
              >
                Back to Games
              </button>
            </TouchOptimized>
          </div>
          
          {/* Share Results */}
          <div className="mt-6 text-center">
            <TouchOptimized>
              <button
                onClick={() => {
                  // In a real app, this would open a share dialog
                  console.log('Share results');
                }}
                className="text-sage-600 hover:text-sage-700 font-medium inline-flex items-center space-x-2"
              >
                <Share2 size={18} />
                <span>Share Your Results</span>
              </button>
            </TouchOptimized>
          </div>
        </div>
      )}
    </div>
  );
}