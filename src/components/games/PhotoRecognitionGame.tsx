import React, { useState, useEffect } from 'react';
import { 
  User, Clock, HelpCircle, ArrowLeft, 
  Check, X, Award, Heart, ThumbsUp, 
  AlertCircle, ChevronRight, Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface GameQuestion {
  id: string;
  type: 'who' | 'when' | 'where' | 'what';
  question: string;
  image?: string;
  options: string[];
  correctAnswer: string;
  hint?: string;
}

interface GameResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  date: string;
}

interface PhotoRecognitionGameProps {
  gameId: string;
  gameType: 'who' | 'when' | 'where' | 'what';
  difficulty?: 'easy' | 'medium' | 'hard' | 'adaptive';
  onComplete?: (result: GameResult) => void;
  className?: string;
}

export function PhotoRecognitionGame({
  gameId,
  gameType,
  difficulty = 'adaptive',
  onComplete,
  className = ''
}: PhotoRecognitionGameProps) {
  const { isMobile } = useDeviceDetection();
  const navigate = useNavigate();
  
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'results'>('intro');
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [results, setResults] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  // Get game title based on type
  const getGameTitle = () => {
    switch (gameType) {
      case 'who': return 'Who Is This?';
      case 'when': return 'When Was This?';
      case 'where': return 'Where Was This?';
      case 'what': return 'What Happened Here?';
      default: return 'Photo Recognition';
    }
  };

  // Get game description based on type
  const getGameDescription = () => {
    switch (gameType) {
      case 'who': return 'Identify family members in your photos';
      case 'when': return 'Guess when these family photos were taken';
      case 'where': return 'Identify locations where these photos were taken';
      case 'what': return 'Identify events in your family photos';
      default: return 'Test your memory of family photos';
    }
  };

  // Get time limit based on difficulty
  const getTimeLimit = () => {
    switch (difficulty) {
      case 'easy': return 20;
      case 'medium': return 15;
      case 'hard': return 10;
      case 'adaptive': return 15; // Will be adjusted based on performance
      default: return 15;
    }
  };

  // Load questions
  useEffect(() => {
    if (gameState === 'intro') {
      loadQuestions();
    }
  }, [gameState, gameType, difficulty]);

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === 'playing' && timeLeft > 0 && isCorrect === null) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      if (timeLeft === 0) {
        // Time's up
        handleAnswer('');
      }
    }
    
    return () => clearTimeout(timer);
  }, [gameState, timeLeft, isCorrect]);

  const loadQuestions = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock questions based on game type
    let mockQuestions: GameQuestion[] = [];
    
    if (gameType === 'who') {
      mockQuestions = [
        {
          id: '1',
          type: 'who',
          question: 'Who is this person?',
          image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600',
          options: ['Grandma', 'Mom', 'Aunt Lisa', 'Cousin Sarah'],
          correctAnswer: 'Mom',
          hint: 'This person often bakes cookies for family gatherings'
        },
        {
          id: '2',
          type: 'who',
          question: 'Who is this person?',
          image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=600',
          options: ['Uncle John', 'Dad', 'Grandpa', 'Brother Mike'],
          correctAnswer: 'Dad',
          hint: 'This person loves fishing on weekends'
        },
        {
          id: '3',
          type: 'who',
          question: 'Who is this person?',
          image: 'https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=600',
          options: ['Grandma', 'Aunt Mary', 'Cousin Emma', 'Sister Kate'],
          correctAnswer: 'Grandma',
          hint: 'This person makes the best apple pie'
        },
        {
          id: '4',
          type: 'who',
          question: 'Who is this person?',
          image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600',
          options: ['Uncle Bob', 'Cousin Jake', 'Grandpa', 'Dad'],
          correctAnswer: 'Grandpa',
          hint: 'This person tells stories about the war'
        },
        {
          id: '5',
          type: 'who',
          question: 'Who is this person?',
          image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
          options: ['Sister Emma', 'Cousin Sarah', 'Aunt Lisa', 'Mom'],
          correctAnswer: 'Sister Emma',
          hint: 'This person plays the piano'
        }
      ];
    } else if (gameType === 'when') {
      mockQuestions = [
        {
          id: '1',
          type: 'when',
          question: 'When was this photo taken?',
          image: 'https://images.pexels.com/photos/1449057/pexels-photo-1449057.jpeg?auto=compress&cs=tinysrgb&w=600',
          options: ['Summer 2018', 'Winter 2019', 'Spring 2020', 'Fall 2021'],
          correctAnswer: 'Summer 2018',
          hint: 'This was during a family vacation to the beach'
        },
        {
          id: '2',
          type: 'when',
          question: 'When was this photo taken?',
          image: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=600',
          options: ['Christmas 2019', 'Christmas 2020', 'Christmas 2021', 'Christmas 2022'],
          correctAnswer: 'Christmas 2021',
          hint: 'This was the year we got the new tree ornaments'
        }
      ];
    } else if (gameType === 'where') {
      mockQuestions = [
        {
          id: '1',
          type: 'where',
          question: 'Where was this photo taken?',
          image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=600',
          options: ['Florida Beach', 'California Coast', 'Hawaii', 'Mexico'],
          correctAnswer: 'Hawaii',
          hint: 'This was during our family vacation to a tropical island'
        },
        {
          id: '2',
          type: 'where',
          question: 'Where was this photo taken?',
          image: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=600',
          options: ['Living Room', 'Grandma\'s House', 'Backyard', 'Community Center'],
          correctAnswer: 'Grandma\'s House',
          hint: 'Notice the familiar wallpaper in the background'
        }
      ];
    } else if (gameType === 'what') {
      mockQuestions = [
        {
          id: '1',
          type: 'what',
          question: 'What event is happening in this photo?',
          image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600',
          options: ['Birthday Party', 'Graduation', 'Wedding', 'Anniversary'],
          correctAnswer: 'Birthday Party',
          hint: 'Look for the cake and decorations'
        },
        {
          id: '2',
          type: 'what',
          question: 'What event is happening in this photo?',
          image: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=600',
          options: ['Family Reunion', 'Thanksgiving', 'Christmas Dinner', 'Easter'],
          correctAnswer: 'Thanksgiving',
          hint: 'This happens in November in the US'
        }
      ];
    }
    
    // Shuffle questions
    const shuffledQuestions = [...mockQuestions].sort(() => Math.random() - 0.5);
    
    setQuestions(shuffledQuestions);
    setLoading(false);
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(getTimeLimit());
    setGameStartTime(Date.now());
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowHint(false);
  };

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const correct = answer === currentQuestion.correctAnswer;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      // Calculate points based on time left and difficulty
      const timeBonus = Math.floor(timeLeft / 2);
      const difficultyMultiplier = 
        difficulty === 'easy' ? 1 :
        difficulty === 'medium' ? 1.5 :
        difficulty === 'hard' ? 2 : 1.5;
      
      const pointsEarned = Math.floor((10 + timeBonus) * difficultyMultiplier);
      setScore(prev => prev + pointsEarned);
    }
    
    // Show feedback for 1.5 seconds
    setTimeout(() => {
      setShowFeedback(false);
      
      // Move to next question or end game
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowHint(false);
        setTimeLeft(getTimeLimit());
      } else {
        // End game
        const totalTime = Math.floor((Date.now() - gameStartTime) / 1000);
        const correctAnswers = questions.filter((_, index) => 
          index < currentQuestionIndex || isCorrect
        ).length;
        
        const result: GameResult = {
          score,
          totalQuestions: questions.length,
          correctAnswers,
          timeSpent: totalTime,
          date: new Date().toISOString()
        };
        
        setResults(result);
        setGameState('results');
        
        if (onComplete) {
          onComplete(result);
        }
      }
    }, 1500);
  };

  const handleSkip = () => {
    handleAnswer('');
  };

  const handleShowHint = () => {
    setShowHint(true);
    // Penalty for using hint
    setTimeLeft(prev => Math.max(prev - 3, 1));
  };

  const handlePlayAgain = () => {
    startGame();
  };

  const handleBackToGames = () => {
    navigate('/games');
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Game Intro */}
      {gameState === 'intro' && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-sage-700 p-3 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{getGameTitle()}</h2>
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
              {getGameDescription()}
            </p>
            
            <div className="bg-sage-50 rounded-lg p-4 border border-sage-100">
              <h3 className="font-semibold text-gray-900 mb-2">How to Play:</h3>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                  </div>
                  <span>You'll be shown photos from your family collection</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                  </div>
                  <span>Select the correct answer from multiple choices</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                  </div>
                  <span>Answer quickly for bonus points</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                  </div>
                  <span>Use hints if you need help (time penalty applies)</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{questions.length} questions</span>
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
      {gameState === 'playing' && currentQuestion && (
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
                
                <h2 className="font-semibold text-gray-900">{getGameTitle()}</h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-sage-600" />
                  <span className="font-medium text-gray-900">{score}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-600' : 'text-gray-600'}`} />
                  <span className={`font-medium ${timeLeft <= 5 ? 'text-red-600' : 'text-gray-900'}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-sage-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="mt-1 text-xs text-gray-500 text-right">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          
          {/* Question */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.question}
            </h3>
            
            {/* Image */}
            {currentQuestion.image && (
              <div className="mb-6">
                <img
                  src={currentQuestion.image}
                  alt="Memory"
                  className="w-full max-h-80 object-contain rounded-lg border border-gray-200"
                />
              </div>
            )}
            
            {/* Answer Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <TouchOptimized key={index}>
                  <button
                    onClick={() => !showFeedback && handleAnswer(option)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      showFeedback
                        ? option === currentQuestion.correctAnswer
                          ? 'bg-green-50 border-green-500 text-green-700'
                          : selectedAnswer === option
                          ? 'bg-red-50 border-red-500 text-red-700'
                          : 'bg-white border-gray-200 text-gray-500'
                        : selectedAnswer === option
                        ? 'bg-sage-50 border-sage-500 text-sage-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-sage-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showFeedback && option === currentQuestion.correctAnswer && (
                        <Check className="w-5 h-5 text-green-600" />
                      )}
                      {showFeedback && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </button>
                </TouchOptimized>
              ))}
            </div>
            
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
                      <ThumbsUp className="w-5 h-5" />
                      <span className="font-medium">Correct! Well done!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">
                        {selectedAnswer 
                          ? 'Incorrect. The correct answer is: ' + currentQuestion.correctAnswer
                          : 'Time\'s up! The correct answer is: ' + currentQuestion.correctAnswer
                        }
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Hint */}
            {!showFeedback && currentQuestion.hint && (
              <div className="mb-6">
                {showHint ? (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-700">
                      <HelpCircle className="w-5 h-5" />
                      <span className="font-medium">Hint:</span>
                    </div>
                    <p className="text-blue-700 mt-1">{currentQuestion.hint}</p>
                  </div>
                ) : (
                  <TouchOptimized>
                    <button
                      onClick={handleShowHint}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
                    >
                      <HelpCircle size={16} />
                      <span>Show Hint (−3s)</span>
                    </button>
                  </TouchOptimized>
                )}
              </div>
            )}
            
            {/* Skip Button */}
            {!showFeedback && (
              <div className="flex justify-end">
                <TouchOptimized>
                  <button
                    onClick={handleSkip}
                    className="text-gray-500 hover:text-gray-700 font-medium"
                  >
                    Skip Question
                  </button>
                </TouchOptimized>
              </div>
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
              You've completed the {getGameTitle()} memory game
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
                  <span className="text-sm">Correct Answers</span>
                </div>
                <p className="text-xl font-semibold">
                  {results.correctAnswers} / {results.totalQuestions}
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
              {results.correctAnswers === results.totalQuestions && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Perfect Score!</p>
                    <p className="text-xs text-gray-600">All answers correct</p>
                  </div>
                </div>
              )}
              
              {results.timeSpent < 60 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Speed Demon</p>
                    <p className="text-xs text-gray-600">Completed in under 60s</p>
                  </div>
                </div>
              )}
              
              {results.score > 100 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">High Scorer</p>
                    <p className="text-xs text-gray-600">Scored over 100 points</p>
                  </div>
                </div>
              )}
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Memory Keeper</p>
                  <p className="text-xs text-gray-600">Completed a memory game</p>
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
                <span>Improved facial recognition and recall</span>
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
                <span>Strengthened family connections through shared memories</span>
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