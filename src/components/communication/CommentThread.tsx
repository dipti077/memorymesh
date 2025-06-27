import React, { useState, useRef } from 'react';
import { 
  User, Heart, Reply, MoreHorizontal, Trash2, Flag, 
  Edit2, Send, AtSign, Smile, Image, X, Clock
} from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { useAuth } from '../../hooks/useAuth';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    relationship?: string;
  };
  likes: number;
  isLiked: boolean;
  mentions: string[];
  replies?: Comment[];
  isEditing?: boolean;
  isDeleted?: boolean;
}

interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  relationship?: string;
}

interface CommentThreadProps {
  memoryId: string;
  comments: Comment[];
  familyMembers: FamilyMember[];
  onAddComment: (content: string, mentions: string[], parentId?: string) => Promise<void>;
  onEditComment: (commentId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onLikeComment: (commentId: string) => Promise<void>;
  onReportComment?: (commentId: string, reason: string) => Promise<void>;
  className?: string;
}

export function CommentThread({
  memoryId,
  comments,
  familyMembers,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onReportComment,
  className = ''
}: CommentThreadProps) {
  const { isMobile } = useDeviceDetection();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReportModal, setShowReportModal] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCommentChange = (value: string) => {
    setNewComment(value);
    
    // Check for @ mentions
    const atIndex = value.lastIndexOf('@');
    if (atIndex !== -1 && (atIndex === 0 || value[atIndex - 1] === ' ')) {
      const query = value.substring(atIndex + 1).split(' ')[0];
      setMentionQuery(query);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionSelect = (member: FamilyMember) => {
    const textarea = commentInputRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = newComment;
    const atIndex = text.lastIndexOf('@', start);
    
    if (atIndex !== -1) {
      const beforeMention = text.substring(0, atIndex);
      const afterMention = text.substring(start);
      
      const updatedText = `${beforeMention}@${member.name} ${afterMention}`;
      setNewComment(updatedText);
      setMentionedUsers([...mentionedUsers, member.id]);
    }
    
    setShowMentions(false);
    setMentionQuery('');
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      const newPosition = atIndex + member.name.length + 2; // +2 for @ and space
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await onAddComment(newComment, mentionedUsers, replyingTo || undefined);
      setNewComment('');
      setMentionedUsers([]);
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (commentId: string) => {
    if (!editContent.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await onEditComment(commentId, editContent);
      setEditingComment(null);
      setEditContent('');
    } catch (error) {
      console.error('Error editing comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await onDeleteComment(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (isSubmitting) return;
    
    try {
      await onLikeComment(commentId);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReportSubmit = async () => {
    if (!showReportModal || !reportReason.trim() || isSubmitting || !onReportComment) return;
    
    setIsSubmitting(true);
    
    try {
      await onReportComment(showReportModal, reportReason);
      setShowReportModal(null);
      setReportReason('');
    } catch (error) {
      console.error('Error reporting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file and insert it into the comment
      // For now, we'll just add a placeholder
      setNewComment(prev => `${prev} [Image: ${file.name}] `);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredMembers = familyMembers.filter(member => 
    member.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const renderComment = (comment: Comment, isReply = false) => {
    if (comment.isDeleted) {
      return (
        <div className={`${isReply ? 'ml-10' : ''} py-2 px-3 text-gray-500 italic text-sm`}>
          This comment has been deleted.
        </div>
      );
    }

    return (
      <div key={comment.id} className={`${isReply ? 'ml-10 mt-2' : 'mb-4'}`}>
        <div className={`rounded-xl p-3 ${isReply ? 'bg-gray-50 border border-gray-100' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-start space-x-3">
            {/* Author Avatar */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                {comment.author.avatar ? (
                  <img 
                    src={comment.author.avatar} 
                    alt={comment.author.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-gray-500" />
                )}
              </div>
            </div>
            
            {/* Comment Content */}
            <div className="flex-1 min-w-0">
              {/* Author and Timestamp */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-900 text-sm">
                    {comment.author.name}
                  </span>
                  {comment.author.relationship && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({comment.author.relationship})
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock size={12} className="mr-1" />
                  {formatTimestamp(comment.createdAt)}
                </span>
              </div>
              
              {/* Comment Text */}
              {editingComment === comment.id ? (
                <div className="mb-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-sm"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <TouchOptimized>
                      <button
                        onClick={() => setEditingComment(null)}
                        className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </TouchOptimized>
                    <TouchOptimized>
                      <button
                        onClick={() => handleEditSubmit(comment.id)}
                        disabled={!editContent.trim() || isSubmitting}
                        className="px-3 py-1 text-xs bg-sage-600 text-white rounded-lg hover:bg-sage-700 disabled:opacity-50 transition-colors"
                      >
                        Save
                      </button>
                    </TouchOptimized>
                  </div>
                </div>
              ) : (
                <p className="text-gray-800 text-sm whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              )}
              
              {/* Comment Actions */}
              <div className="flex items-center space-x-4 mt-2">
                <TouchOptimized>
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center space-x-1 text-xs transition-colors ${
                      comment.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                    }`}
                  >
                    <Heart size={14} className={comment.isLiked ? 'fill-current' : ''} />
                    <span>{comment.likes}</span>
                  </button>
                </TouchOptimized>
                
                {!isReply && (
                  <TouchOptimized>
                    <button
                      onClick={() => {
                        setReplyingTo(comment.id);
                        setNewComment('');
                        setTimeout(() => commentInputRef.current?.focus(), 0);
                      }}
                      className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Reply size={14} />
                      <span>Reply</span>
                    </button>
                  </TouchOptimized>
                )}
                
                {comment.author.id === user?.id && (
                  <>
                    <TouchOptimized>
                      <button
                        onClick={() => {
                          setEditingComment(comment.id);
                          setEditContent(comment.content);
                        }}
                        className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <Edit2 size={14} />
                        <span>Edit</span>
                      </button>
                    </TouchOptimized>
                    
                    <TouchOptimized>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </TouchOptimized>
                  </>
                )}
                
                {comment.author.id !== user?.id && onReportComment && (
                  <div className="relative ml-auto">
                    <TouchOptimized>
                      <button
                        onClick={() => setShowReportModal(comment.id)}
                        className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    </TouchOptimized>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${className}`}>
      {/* Comment List */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h3>
            <p className="text-gray-600 mb-4">
              Be the first to share your thoughts on this memory.
            </p>
          </div>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
      </div>
      
      {/* Comment Input */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start space-x-3">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                {user?.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt={user.user_metadata?.full_name || 'User'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-sage-600" />
                )}
              </div>
            </div>
            
            {/* Comment Form */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <textarea
                  ref={commentInputRef}
                  value={newComment}
                  onChange={(e) => handleCommentChange(e.target.value)}
                  placeholder={replyingTo ? "Write a reply..." : "Share your thoughts..."}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 resize-none"
                  rows={3}
                />
                
                {/* Mention Dropdown */}
                {showMentions && filteredMembers.length > 0 && (
                  <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                    {filteredMembers.map(member => (
                      <TouchOptimized key={member.id}>
                        <button
                          onClick={() => handleMentionSelect(member)}
                          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <User size={16} className="text-sage-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            {member.relationship && (
                              <p className="text-xs text-gray-500">{member.relationship}</p>
                            )}
                          </div>
                        </button>
                      </TouchOptimized>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Comment Actions */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-3">
                  <TouchOptimized>
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Smile size={20} />
                    </button>
                  </TouchOptimized>
                  
                  <TouchOptimized>
                    <button
                      onClick={handleImageUpload}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Image size={20} />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelected}
                      />
                    </button>
                  </TouchOptimized>
                  
                  <TouchOptimized>
                    <button
                      onClick={() => {
                        handleCommentChange(`${newComment}@`);
                        setShowMentions(true);
                        setMentionQuery('');
                        setTimeout(() => commentInputRef.current?.focus(), 0);
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <AtSign size={20} />
                    </button>
                  </TouchOptimized>
                </div>
                
                <div className="flex items-center space-x-2">
                  {replyingTo && (
                    <TouchOptimized>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </TouchOptimized>
                  )}
                  
                  <TouchOptimized>
                    <button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim() || isSubmitting}
                      className="flex items-center space-x-2 bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={16} />
                      <span>{replyingTo ? 'Reply' : 'Comment'}</span>
                    </button>
                  </TouchOptimized>
                </div>
              </div>
              
              {/* Mention Helper */}
              <div className="mt-2 text-xs text-gray-500">
                Type @ to mention a family member
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Report Comment</h3>
              <TouchOptimized>
                <button
                  onClick={() => {
                    setShowReportModal(null);
                    setReportReason('');
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </TouchOptimized>
            </div>
            
            <p className="text-gray-600 mb-4">
              Please let us know why you're reporting this comment. This will be reviewed by a family admin.
            </p>
            
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Tell us why you're reporting this comment..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 resize-none mb-4"
              rows={4}
            />
            
            <div className="flex justify-end space-x-3">
              <TouchOptimized>
                <button
                  onClick={() => {
                    setShowReportModal(null);
                    setReportReason('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </TouchOptimized>
              
              <TouchOptimized>
                <button
                  onClick={handleReportSubmit}
                  disabled={!reportReason.trim() || isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  Report
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}