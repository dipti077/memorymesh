import React, { useState } from 'react';
import { 
  X, Heart, MessageCircle, Share2, Edit3, Download, Calendar, 
  MapPin, User, Tag, Sparkles, ThumbsUp, Eye, Play, Volume2,
  ChevronLeft, ChevronRight, Flag, Copy, ExternalLink
} from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface Memory {
  id: string;
  title: string;
  description: string;
  type: 'photo' | 'video' | 'audio' | 'story';
  date: string;
  location?: string;
  author: {
    name: string;
    avatar?: string;
    relationship?: string;
  };
  thumbnail?: string;
  fileUrl?: string;
  tags: string[];
  interactions: {
    likes: number;
    comments: number;
    views: number;
    isLiked: boolean;
  };
  aiInsights?: {
    faces: string[];
    objects: string[];
    events: string[];
    connections: string[];
  };
  privacy: 'private' | 'family' | 'public';
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
}

interface MemoryDetailModalProps {
  memory: Memory;
  isOpen: boolean;
  onClose: () => void;
  onLike: (memoryId: string) => void;
  onShare: (memoryId: string) => void;
  onEdit: (memoryId: string) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export function MemoryDetailModal({
  memory,
  isOpen,
  onClose,
  onLike,
  onShare,
  onEdit,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious
}: MemoryDetailModalProps) {
  const { isMobile } = useDeviceDetection();
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'insights'>('details');
  const [newComment, setNewComment] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Mock comments data
  const comments: Comment[] = [
    {
      id: '1',
      author: { name: 'Mom', avatar: undefined },
      content: 'Such a beautiful memory! I remember this day so clearly.',
      date: '2024-12-20T10:30:00Z',
      likes: 5,
      isLiked: false
    },
    {
      id: '2',
      author: { name: 'Dad', avatar: undefined },
      content: 'One of my favorite family moments. Thanks for capturing this!',
      date: '2024-12-20T11:15:00Z',
      likes: 3,
      isLiked: true
    }
  ];

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getTypeIcon = () => {
    switch (memory.type) {
      case 'video': return Play;
      case 'audio': return Volume2;
      default: return null;
    }
  };

  const TypeIcon = getTypeIcon();

  const tabs = [
    { id: 'details', label: 'Details', count: null },
    { id: 'comments', label: 'Comments', count: comments.length },
    { id: 'insights', label: 'AI Insights', count: memory.aiInsights ? 1 : null }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900 truncate">{memory.title}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              memory.type === 'photo' ? 'bg-blue-100 text-blue-700' :
              memory.type === 'video' ? 'bg-purple-100 text-purple-700' :
              memory.type === 'audio' ? 'bg-green-100 text-green-700' :
              'bg-orange-100 text-orange-700'
            }`}>
              {memory.type.charAt(0).toUpperCase() + memory.type.slice(1)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Navigation Arrows */}
            {hasPrevious && (
              <TouchOptimized>
                <button
                  onClick={onPrevious}
                  className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
                >
                  <ChevronLeft size={24} />
                </button>
              </TouchOptimized>
            )}
            
            {hasNext && (
              <TouchOptimized>
                <button
                  onClick={onNext}
                  className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
                >
                  <ChevronRight size={24} />
                </button>
              </TouchOptimized>
            )}

            <TouchOptimized>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </TouchOptimized>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Media Section */}
          <div className="lg:w-2/3 bg-gray-50 flex items-center justify-center relative">
            {memory.thumbnail ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={memory.thumbnail}
                  alt={memory.title}
                  className="max-w-full max-h-full object-contain"
                />
                
                {/* Play Button for Videos */}
                {memory.type === 'video' && (
                  <TouchOptimized>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-full shadow-lg hover:bg-white transition-colors">
                        <Play className="w-12 h-12 text-sage-700 ml-1" />
                      </div>
                    </button>
                  </TouchOptimized>
                )}
              </div>
            ) : (
              <div className="text-center p-12">
                {TypeIcon ? (
                  <TypeIcon className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>
                )}
                <p className="text-xl text-gray-600 font-medium">
                  {memory.type === 'story' ? 'Written Story' : 'Audio Recording'}
                </p>
              </div>
            )}

            {/* Zoom Controls for Photos */}
            {memory.type === 'photo' && (
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <TouchOptimized>
                  <button className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-white transition-colors">
                    <span className="text-sm font-medium">Zoom</span>
                  </button>
                </TouchOptimized>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="lg:w-1/3 flex flex-col">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                {tabs.map(tab => (
                  <TouchOptimized key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-sage-500 text-sage-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                      {tab.count !== null && (
                        <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  </TouchOptimized>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Author Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                      {memory.author.avatar ? (
                        <img 
                          src={memory.author.avatar} 
                          alt={memory.author.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={24} className="text-sage-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{memory.author.name}</p>
                      {memory.author.relationship && (
                        <p className="text-sm text-gray-500">{memory.author.relationship}</p>
                      )}
                    </div>
                  </div>

                  {/* Date and Location */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar size={16} />
                      <span className="text-sm">{formatDate(memory.date)}</span>
                    </div>
                    {memory.location && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin size={16} />
                        <span className="text-sm">{memory.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {memory.description && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className={`text-gray-700 leading-relaxed ${
                        !showFullDescription && memory.description.length > 200 ? 'line-clamp-4' : ''
                      }`}>
                        {memory.description}
                      </p>
                      {memory.description.length > 200 && (
                        <TouchOptimized>
                          <button
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="text-sage-600 hover:text-sage-700 text-sm font-medium mt-2"
                          >
                            {showFullDescription ? 'Show less' : 'Show more'}
                          </button>
                        </TouchOptimized>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {memory.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Tag size={16} className="mr-2" />
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {memory.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interaction Stats */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{memory.interactions.likes}</p>
                        <p className="text-sm text-gray-600">Likes</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{memory.interactions.comments}</p>
                        <p className="text-sm text-gray-600">Comments</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{memory.interactions.views}</p>
                        <p className="text-sm text-gray-600">Views</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-4">
                  {/* Add Comment */}
                  <div className="space-y-3">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 resize-none"
                      rows={3}
                    />
                    <TouchOptimized>
                      <button
                        disabled={!newComment.trim()}
                        className="bg-sage-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-sage-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Post Comment
                      </button>
                    </TouchOptimized>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map(comment => (
                      <div key={comment.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                            {comment.author.avatar ? (
                              <img 
                                src={comment.author.avatar} 
                                alt={comment.author.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User size={16} className="text-sage-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-semibold text-gray-900 text-sm">{comment.author.name}</p>
                              <p className="text-xs text-gray-500">{formatDate(comment.date)}</p>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <TouchOptimized>
                                <button className={`flex items-center space-x-1 text-xs ${
                                  comment.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                                }`}>
                                  <Heart size={12} className={comment.isLiked ? 'fill-current' : ''} />
                                  <span>{comment.likes}</span>
                                </button>
                              </TouchOptimized>
                              <TouchOptimized>
                                <button className="text-xs text-gray-500 hover:text-gray-700">
                                  Reply
                                </button>
                              </TouchOptimized>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'insights' && memory.aiInsights && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center space-x-2 mb-4">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-700">AI-Generated Insights</h4>
                    </div>

                    <div className="space-y-4">
                      {memory.aiInsights.faces.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">People Detected</h5>
                          <div className="flex flex-wrap gap-2">
                            {memory.aiInsights.faces.map((face, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                {face}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {memory.aiInsights.objects.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Objects & Scenes</h5>
                          <div className="flex flex-wrap gap-2">
                            {memory.aiInsights.objects.map((object, index) => (
                              <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                {object}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {memory.aiInsights.events.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Event Type</h5>
                          <div className="flex flex-wrap gap-2">
                            {memory.aiInsights.events.map((event, index) => (
                              <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                                {event}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {memory.aiInsights.connections.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Related Memories</h5>
                          <div className="space-y-2">
                            {memory.aiInsights.connections.map((connection, index) => (
                              <TouchOptimized key={index}>
                                <div className="p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-300 transition-colors cursor-pointer">
                                  <p className="text-sm text-purple-700 font-medium">{connection}</p>
                                </div>
                              </TouchOptimized>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <TouchOptimized>
                    <button
                      onClick={() => onLike(memory.id)}
                      className={`flex items-center space-x-2 transition-colors ${
                        memory.interactions.isLiked
                          ? 'text-red-600'
                          : 'text-gray-600 hover:text-red-600'
                      }`}
                    >
                      <ThumbsUp size={20} className={memory.interactions.isLiked ? 'fill-current' : ''} />
                      <span className="font-medium">{memory.interactions.likes}</span>
                    </button>
                  </TouchOptimized>

                  <TouchOptimized>
                    <button
                      onClick={() => setActiveTab('comments')}
                      className="flex items-center space-x-2 text-gray-600 hover:text-sage-600 transition-colors"
                    >
                      <MessageCircle size={20} />
                      <span className="font-medium">{memory.interactions.comments}</span>
                    </button>
                  </TouchOptimized>
                </div>

                <div className="flex items-center space-x-2">
                  <TouchOptimized>
                    <button
                      onClick={() => onShare(memory.id)}
                      className="p-2 text-gray-600 hover:text-sage-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Share2 size={20} />
                    </button>
                  </TouchOptimized>

                  <TouchOptimized>
                    <button
                      onClick={() => onEdit(memory.id)}
                      className="p-2 text-gray-600 hover:text-sage-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Edit3 size={20} />
                    </button>
                  </TouchOptimized>

                  <TouchOptimized>
                    <button className="p-2 text-gray-600 hover:text-sage-600 rounded-lg hover:bg-gray-100 transition-colors">
                      <Download size={20} />
                    </button>
                  </TouchOptimized>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}