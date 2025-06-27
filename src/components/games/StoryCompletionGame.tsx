import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Clock, Award, ArrowLeft, 
  Check, X, Share2, Trophy, AlertCircle,
  Heart, ThumbsUp, Mic, FileText
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface StoryPrompt {
  id: string;
  title: string;
  imageUrl?: string;
  storyStart: string;
  missingDetails: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
  storyEnd?: string;
}

interface GameResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  date: string;
}

interface StoryCompletionGameProps {
  gameId: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'adaptive';
  onComplete?: (result: GameResult) => void;
  className?: string;
}

export function StoryCompletionGame({
  gameId,
  difficulty = 'adaptive',
  onComplete,
  className = ''
}: StoryCompletionGameProps) {
  const { isMobile } = useDeviceDetection();
  const navigate = useNavigate();
  
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'results'>('intro');
  const [storyPrompts, setStoryPrompts] = useState<StoryPrompt[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [currentDetailIndex, setCurrentDetailIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [results, setResults] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showStoryReview, setShowStoryReview] = useState(false);

  // Get time limit based on difficulty
  const getTimeLimit = () => {
    switch (difficulty) {
      case 'easy': return 30;
      case 'medium': return 20;
      case 'hard': return 15;
      case 'adaptive': return 20;
      default: return 20;
    }
  };

  // Load story prompts
  useEffect(() => {
    if (gameState === 'intro') {
      loadStoryPrompts();
    }
  }, [gameState, difficulty]);

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === 'playing' && timeLeft > 0 && !showFeedback && !showStoryReview) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      if (timeLeft === 0) {
        // Time's up
        handleAnswer('');
      }
    }
    
    return () => clearTimeout(timer);
  }, [gameState, timeLeft, showFeedback, showStoryReview]);

  // Calculate total questions
  useEffect(() => {
    if (storyPrompts.length > 0) {
      const total = storyPrompts.reduce((sum, prompt) => sum + prompt.missingDetails.length, 0);
      setTotalQuestions(total);
    }
  }, [storyPrompts]);

  const loadStoryPrompts = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - in a real app, this would come from your API with actual family stories
    const mockPrompts: StoryPrompt[] = [
      {
        id: '1',
        title: 'Family Vacation Memory',
        imageUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=300',
        storyStart: "Our family vacation to Hawaii in the summer of 2018 was one of our most memorable trips. We stayed at a beautiful resort right on the beach in",
        missingDetails: [
          {
            id: '1-1',
            question: "Which Hawaiian island did the family visit?",
            options: ['Maui', 'Oahu', 'Kauai', 'The Big Island'],
            correctAnswer: 'Maui'
          },
          {
            id: '1-2',
            question: "Who was afraid of the ocean at first?",
            options: ['Dad', 'Mom', 'Little Emma', 'Grandpa'],
            correctAnswer: 'Little Emma'
          },
          {
            id: '1-3',
            question: "What activity did the family enjoy the most?",
            options: ['Snorkeling', 'Hiking', 'Surfing lessons', 'Luau dinner'],
            correctAnswer: 'Snorkeling'
          }
        ],
        storyEnd: "We took so many photos and created memories that we still talk about today. Everyone agrees it was our best family vacation ever."
      },
      {
        id: '2',
        title: 'Grandma\'s Special Recipe',
        imageUrl: 'https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=300',
        storyStart: "Grandma's famous apple pie has been a family tradition for generations. She learned the recipe from her mother, who brought it from",
        missingDetails: [
          {
            id: '2-1',
            question: "Where did the recipe originate from?",
            options: ['Italy', 'Ireland', 'Germany', 'Poland'],
            correctAnswer: 'Ireland'
          },
          {
            id: '2-2',
            question: "What was Grandma's secret ingredient?",
            options: ['Cinnamon', 'Nutmeg', 'Lemon zest', 'Vanilla extract'],
            correctAnswer: 'Lemon zest'
          },
          {
            id: '2-3',
            question: "Who did Grandma teach the recipe to first?",
            options: ['Mom', 'Aunt Sarah', 'Uncle John', 'Cousin Emma'],
            correctAnswer: 'Mom'
          }
        ],
        storyEnd: "Now we make the pie every Thanksgiving and Christmas, and it always reminds us of Grandma's love and care."
      }
    ];
    
    // Adjust number of prompts based on difficulty
    const numPrompts = 
      difficulty === 'easy' ? 1 :
      difficulty === 'medium' ? 2 :
      difficulty === 'hard' ? 3 : 2;
    
    const selectedPrompts = mockPrompts.slice(0, numPrompts);
    
    setStoryPrompts(selectedPrompts);
    setLoading(false);
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentPromptIndex(0);
    setCurrentDetailIndex(0);
    setUserAnswers({});
    setScore(0);
    setTimeLeft(getTimeLimit());
    setGameStartTime(Date.now());
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
    setCorrectAnswers(0);
    setShowStoryReview(false);
  };

  const handleAnswer = (answer: string) => {
    const currentPrompt = storyPrompts[currentPromptIndex];
    const currentDetail = currentPrompt.missingDetails[currentDetailIndex];
    const correct = answer === currentDetail.correctAnswer;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Save user answer
    setUserAnswers(prev => ({
      ...prev,
      [`${currentPrompt.id}-${currentDetail.id}`]: answer
    }));
    
    if (correct) {
      // Calculate points based on time left and difficulty
      const timeBonus = Math.floor(timeLeft / 2);
      const difficultyMultiplier = 
        difficulty === 'easy' ? 1 :
        difficulty === 'medium' ? 1.5 :
        difficulty === 'hard' ? 2 : 1.5;
      
      const pointsEarned = Math.floor((10 + timeBonus) * difficultyMultiplier);
      setScore(prev => prev + pointsEarned);
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Show feedback for 1.5 seconds
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      
      // Move to next detail or prompt
      if (currentDetailIndex < currentPrompt.missingDetails.length - 1) {
        // Next detail in current prompt
        setCurrentDetailIndex(prev => prev + 1);
        setTimeLeft(getTimeLimit());
      } else {
        // Show completed story
        setShowStoryReview(true);
        
        // After 5 seconds, move to next prompt or end game
        setTimeout(() => {
          setShowStoryReview(false);
          
          if (currentPromptIndex < storyPrompts.length - 1) {
            // Next prompt
            setCurrentPromptIndex(prev => prev + 1);
            setCurrentDetailIndex(0);
            setTimeLeft(getTimeLimit());
          } else {
            // End game
            const totalTime = Math.floor((Date.now() - gameStartTime) / 1000);
            
            const result: GameResult = {
              score,
              correctAnswers,
              totalQuestions,
              timeSpent: totalTime,
              date: new Date().toISOString()
            };
            
            setResults(result);
            setGameState('results');
            
            if (onComplete) {
              onComplete(result);
            }
          }
        }, 5000);
      }
    }, 1500);
  };

  const handlePlayAgain = () => {
    loadStoryPrompts();
    startGame();
  };

  const handleBackToGames = () => {
    navigate('/games');
  };

  // Get completed story text
  const getCompletedStory = (prompt: StoryPrompt) => {
    let story = prompt.storyStart;
    
    prompt.missingDetails.forEach((detail, index) => {
      const userAnswer = userAnswers[`${prompt.id}-${detail.id}`] || '...';
      story += ` ${userAnswer}`;
      
      // Add some connecting text between details
      if (index < prompt.missingDetails.length - 1) {
        const connectors = [
          '. We also remember that ',
          '. It was amazing when ',
          '. Everyone loved when ',
          '. I\'ll never forget how '
        ];
        story += connectors[index % connectors.length];
      }
    });
    
    if (prompt.storyEnd) {
      story += '. ' + prompt.storyEnd;
    }
    
    return story;
  };

  const currentPrompt = storyPrompts[currentPromptIndex];
  const currentDetail = currentPrompt?.missingDetails[currentDetailIndex];

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Game Intro */}
      {gameState === 'intro' && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-sage-700 p-3 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Story Completion</h2>
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
              Complete family stories by filling in missing details
            </p>
            
            <div className="bg-sage-50 rounded-lg p-4 border border-sage-100">
              <h3 className="font-semibold text-gray-900 mb-2">How to Play:</h3>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                  </div>
                  <span>You'll be shown family stories with missing details</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                  </div>
                  <span>Choose the correct missing information from multiple choices</span>
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
                  <span>See the complete story with your answers at the end</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{storyPrompts.length} stories</span>
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
      {gameState === 'playing' && currentPrompt && currentDetail && (
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
                
                <h2 className="font-semibold text-gray-900">Story Completion</h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-sage-600" />
                  <span className="font-medium text-gray-900">{score}</span>
                </div>
                
                {!showStoryReview && (
                  <div className="flex items-center space-x-2">
                    <Clock className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-600' : 'text-gray-600'}`} />
                    <span className={`font-medium ${timeLeft <= 5 ? 'text-red-600' : 'text-gray-900'}`}>
                      {timeLeft}s
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-sage-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ 
                  width: `${(((currentPromptIndex * currentPrompt.missingDetails.length) + currentDetailIndex + 1) / totalQuestions) * 100}%` 
                }}
              ></div>
            </div>
            <div className="mt-1 text-xs text-gray-500 text-right">
              Question {(currentPromptIndex * currentPrompt.missingDetails.length) + currentDetailIndex + 1} of {totalQuestions}
            </div>
          </div>
          
          {/* Story Review */}
          {showStoryReview ? (
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Completed Story</h3>
              </div>
              
              {currentPrompt.imageUrl && (
                <div className="mb-4">
                  <img
                    src={currentPrompt.imageUrl}
                    alt={currentPrompt.title}
                    className="w-full max-h-60 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 mb-6">
                <h4 className="font-semibold text-purple-800 mb-2">{currentPrompt.title}</h4>
                <p className="text-gray-700 leading-relaxed">
                  {getCompletedStory(currentPrompt)}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  {currentPromptIndex < storyPrompts.length - 1 
                    ? 'Next story coming up...' 
                    : 'Finishing game...'}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 max-w-xs mx-auto">
                  <div 
                    className="bg-sage-600 h-1.5 rounded-full transition-all duration-300 animate-pulse" 
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{currentPrompt.title}</h3>
              </div>
              
              {currentPrompt.imageUrl && (
                <div className="mb-4">
                  <img
                    src={currentPrompt.imageUrl}
                    alt={currentPrompt.title}
                    className="w-full max-h-60 object-cover rounded-lg"
                  />
                </div>
              )}
              
              {/* Story Fragment */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
                <p className="text-gray-700">
                  {currentPrompt.storyStart}...
                </p>
              </div>
              
              {/* Question */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  {currentDetail.question}
                </h4>
                
                {/* Answer Options */}
                <div className="space-y-3">
                  {currentDetail.options.map((option, index) => (
                    <TouchOptimized key={index}>
                      <button
                        onClick={() => !showFeedback && handleAnswer(option)}
                        disabled={showFeedback}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                          showFeedback
                            ? option === currentDetail.correctAnswer
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
                          {showFeedback && option === currentDetail.correctAnswer && (
                            <Check className="w-5 h-5 text-green-600" />
                          )}
                          {showFeedback && option === selectedAnswer && option !== currentDetail.correctAnswer && (
                            <X className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      </button>
                    </TouchOptimized>
                  ))}
                </div>
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
                        <span className="font-medium">Correct! That's the right detail.</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">
                          {selectedAnswer 
                            ? 'Incorrect. The correct answer is: ' + currentDetail.correctAnswer
                            : 'Time\'s up! The correct answer is: ' + currentDetail.correctAnswer
                          }
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
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
              You've completed the Story Completion game
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
                    <p className="font-medium text-gray-900">Story Master</p>
                    <p className="text-xs text-gray-600">All answers correct</p>
                  </div>
                </div>
              )}
              
              {results.correctAnswers >= Math.floor(results.totalQuestions * 0.75) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Family Historian</p>
                    <p className="text-xs text-gray-600">75%+ correct answers</p>
                  </div>
                </div>
              )}
              
              {results.score > 150 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Memory Keeper</p>
                    <p className="text-xs text-gray-600">Scored over 150 points</p>
                  </div>
                </div>
              )}
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Storyteller</p>
                  <p className="text-xs text-gray-600">Completed a story game</p>
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
                <span>Enhanced episodic and autobiographical memory</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                </div>
                <span>Improved verbal memory and narrative skills</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-1.5 h-1.5 bg-sage-600 rounded-full"></div>
                </div>
                <span>Strengthened emotional connections to family memories</span>
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