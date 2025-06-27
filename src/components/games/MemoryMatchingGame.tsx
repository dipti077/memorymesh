import React, { useState, useEffect } from 'react';
import { 
  Brain, Clock, Award, Heart, ArrowLeft, 
  Sparkles, Check, RefreshCw, Share2, Trophy
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface MemoryCard {
  id: string;
  imageUrl?: string;
  personName?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameResult {
  score: number;
  moves: number;
  matches: number;
  timeSpent: number;
  date: string;
}

interface MemoryMatchingGameProps {
  gameId: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'adaptive';
  onComplete?: (result: GameResult) => void;
  className?: string;
}

export function MemoryMatchingGame({
  gameId,
  difficulty = 'adaptive',
  onComplete,
  className = ''
}: MemoryMatchingGameProps) {
  const { isMobile } = useDeviceDetection();
  const navigate = useNavigate();
  
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'results'>('intro');
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [results, setResults] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [canFlip, setCanFlip] = useState(true);

  // Get grid size based on difficulty
  const getGridSize = () => {
    switch (difficulty) {
      case 'easy': return { rows: 3, cols: 4 }; // 12 cards (6 pairs)
      case 'medium': return { rows: 4, cols: 4 }; // 16 cards (8 pairs)
      case 'hard': return { rows: 4, cols: 5 }; // 20 cards (10 pairs)
      case 'adaptive': return { rows: 4, cols: 4 }; // 16 cards (8 pairs)
      default: return { rows: 4, cols: 4 };
    }
  };

  // Get time limit based on difficulty
  const getTimeLimit = () => {
    switch (difficulty) {
      case 'easy': return 120; // 2 minutes
      case 'medium': return 180; // 3 minutes
      case 'hard': return 240; // 4 minutes
      case 'adaptive': return 180; // 3 minutes
      default: return 180;
    }
  };

  // Load cards
  useEffect(() => {
    if (gameState === 'intro') {
      loadCards();
    }
  }, [gameState, difficulty]);

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      if (timeLeft === 0) {
        // Time's up
        endGame();
      }
    }
    
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      setCanFlip(false);
      
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);
      
      if (firstCard && secondCard) {
        // Check if cards match (same person)
        const isMatch = firstCard.personName === secondCard.personName;
        
        if (isMatch) {
          // Match found
          setMatchedPairs(prev => [...prev, firstCard.personName!]);
          setScore(prev => prev + 10 + Math.floor(timeLeft / 10));
          
          // Reset flipped cards after a short delay
          setTimeout(() => {
            setFlippedCards([]);
            setCanFlip(true);
            
            // Check if game is complete
            if (matchedPairs.length + 1 === getGridSize().rows * getGridSize().cols / 2) {
              endGame();
            }
          }, 1000);
        } else {
          // No match
          setTimeout(() => {
            setCards(prev => 
              prev.map(card => 
                flippedCards.includes(card.id) 
                  ? { ...card, isFlipped: false } 
                  : card
              )
            );
            setFlippedCards([]);
            setCanFlip(true);
          }, 1000);
        }
        
        // Increment moves
        setMoves(prev => prev + 1);
      }
    }
  }, [flippedCards, cards, matchedPairs]);

  const loadCards = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - in a real app, this would come from your API with actual family photos
    const mockPeople = [
      { name: 'Mom', image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300' },
      { name: 'Dad', image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=300' },
      { name: 'Grandma', image: 'https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=300' },
      { name: 'Grandpa', image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300' },
      { name: 'Sister', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300' },
      { name: 'Brother', image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300' },
      { name: 'Aunt', image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300' },
      { name: 'Uncle', image: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=300' },
      { name: 'Cousin Sarah', image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=300' },
      { name: 'Cousin Mike', image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300' }
    ];
    
    // Get number of pairs based on grid size
    const { rows, cols } = getGridSize();
    const numPairs = (rows * cols) / 2;
    
    // Select random people for the game
    const selectedPeople = [...mockPeople]
      .sort(() => Math.random() - 0.5)
      .slice(0, numPairs);
    
    // Create pairs of cards
    const cardPairs = selectedPeople.flatMap(person => [
      {
        id: `${person.name}-1`,
        imageUrl: person.image,
        personName: person.name,
        isFlipped: false,
        isMatched: false
      },
      {
        id: `${person.name}-2`,
        imageUrl: person.image,
        personName: person.name,
        isFlipped: false,
        isMatched: false
      }
    ]);
    
    // Shuffle cards
    const shuffledCards = [...cardPairs].sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setLoading(false);
  };

  const startGame = () => {
    setGameState('playing');
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setScore(0);
    setTimeLeft(getTimeLimit());
    setGameStartTime(Date.now());
    setCanFlip(true);
    
    // Reset all cards
    setCards(prev => 
      prev.map(card => ({
        ...card,
        isFlipped: false,
        isMatched: false
      }))
    );
  };

  const handleCardClick = (cardId: string) => {
    if (!canFlip || flippedCards.length >= 2 || flippedCards.includes(cardId)) return;
    
    // Find the clicked card
    const clickedCard = cards.find(card => card.id === cardId);
    
    if (clickedCard && !clickedCard.isFlipped && !clickedCard.isMatched) {
      // Flip the card
      setCards(prev => 
        prev.map(card => 
          card.id === cardId 
            ? { ...card, isFlipped: true } 
            : card
        )
      );
      
      // Add to flipped cards
      setFlippedCards(prev => [...prev, cardId]);
    }
  };

  const endGame = () => {
    const totalTime = Math.floor((Date.now() - gameStartTime) / 1000);
    const result: GameResult = {
      score,
      moves,
      matches: matchedPairs.length,
      timeSpent: totalTime,
      date: new Date().toISOString()
    };
    
    setResults(result);
    setGameState('results');
    
    if (onComplete) {
      onComplete(result);
    }
  };

  const handlePlayAgain = () => {
    loadCards();
    startGame();
  };

  const handleBackToGames = () => {
    navigate('/games');
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Game Intro */}
      {gameState === 'intro' && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-sage-700 p-3 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Memory Matching</h2>
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
              Test your memory by matching pairs of family photos
            </p>
            
            <div className="bg-sage-50 rounded-lg p-4 border border-sage-100">
              <h3 className="font-semibold text-gray-900 mb-2">How to Play:</h3>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                  </div>
                  <span>Flip cards to reveal family photos</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                  </div>
                  <span>Find matching pairs of the same person</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                  </div>
                  <span>Match all pairs before time runs out</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                  </div>
                  <span>Fewer moves = higher score</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{formatTime(getTimeLimit())}</span>
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
      {gameState === 'playing' && (
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
                
                <h2 className="font-semibold text-gray-900">Memory Matching</h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-sage-600" />
                  <span className="font-medium text-gray-900">{score}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className={`w-5 h-5 ${timeLeft <= 30 ? 'text-red-600' : 'text-gray-600'}`} />
                  <span className={`font-medium ${timeLeft <= 30 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Game Stats */}
            <div className="flex items-center justify-between mt-2 text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{moves} moves</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Check className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{matchedPairs.length} / {cards.length / 2} pairs</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Game Grid */}
          <div className="p-4">
            <div 
              className="grid gap-2 sm:gap-4" 
              style={{ 
                gridTemplateColumns: `repeat(${getGridSize().cols}, 1fr)`,
                gridTemplateRows: `repeat(${getGridSize().rows}, 1fr)`
              }}
            >
              {cards.map(card => (
                <TouchOptimized key={card.id}>
                  <div
                    onClick={() => handleCardClick(card.id)}
                    className={`
                      aspect-square rounded-lg overflow-hidden transition-all duration-300 transform
                      ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}
                      ${card.isMatched ? 'opacity-70' : ''}
                      cursor-pointer
                    `}
                    style={{ perspective: '1000px' }}
                  >
                    <div className="relative w-full h-full transition-transform duration-500" style={{
                      transformStyle: 'preserve-3d',
                      transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : ''
                    }}>
                      {/* Card Back */}
                      <div 
                        className="absolute w-full h-full bg-sage-600 flex items-center justify-center rounded-lg border-2 border-sage-500"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      
                      {/* Card Front */}
                      <div 
                        className="absolute w-full h-full bg-white rounded-lg border-2 border-gray-200 overflow-hidden"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        {card.imageUrl ? (
                          <img 
                            src={card.imageUrl} 
                            alt={card.personName} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Person Name */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                          {card.personName}
                        </div>
                      </div>
                    </div>
                  </div>
                </TouchOptimized>
              ))}
            </div>
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
              You've completed the Memory Matching game
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
                  <span className="text-sm">Matches Found</span>
                </div>
                <p className="text-xl font-semibold">
                  {results.matches} pairs
                </p>
              </div>
              
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Total Moves</span>
                </div>
                <p className="text-xl font-semibold">
                  {results.moves} moves
                </p>
              </div>
              
              <div className="bg-white bg-opacity-20 rounded-lg p-3 col-span-2">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Time Spent</span>
                </div>
                <p className="text-xl font-semibold">
                  {formatTime(results.timeSpent)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Achievements */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements Earned</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {results.matches === cards.length / 2 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Memory Master</p>
                    <p className="text-xs text-gray-600">Found all pairs</p>
                  </div>
                </div>
              )}
              
              {results.moves < cards.length && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Efficiency Expert</p>
                    <p className="text-xs text-gray-600">Minimal moves used</p>
                  </div>
                </div>
              )}
              
              {results.timeSpent < getTimeLimit() / 2 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Speed Demon</p>
                    <p className="text-xs text-gray-600">Finished in record time</p>
                  </div>
                </div>
              )}
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Family Faces</p>
                  <p className="text-xs text-gray-600">Recognized family members</p>
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
                <span>Enhanced short-term memory and recall</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                </div>
                <span>Improved concentration and focus</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                </div>
                <span>Better facial recognition of family members</span>
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