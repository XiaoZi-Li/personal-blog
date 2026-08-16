'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Send, Reply, Heart, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import EmojiPicker from '@/components/EmojiPicker';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';

interface ProjectComment {
  id: number;
  user_id: number | null;
  nickname: string;
  content: string;
  like_count: number;
  created_at: string;
}

interface ProjectReply {
  id: number;
  parent_id: number;
  user_id: number | null;
  nickname: string;
  content: string;
  reply_to_user_id: number | null;
  reply_to_nickname: string | null;
  is_admin_reply: boolean;
  created_at: string;
}

interface ProjectDiscussionProps {
  projectId: string;
  projectName: string;
}

export default function ProjectDiscussion({ projectId, projectName }: ProjectDiscussionProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [replies, setReplies] = useState<ProjectReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: number; nickname: string; userId: number | null } | null>(null);
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`);
      const data = await response.json();
      setComments(data.comments || []);
      setReplies(data.replies || []);
      
      // 获取点赞状态
      if (data.comments?.length > 0) {
        const commentIds = data.comments.map((c: ProjectComment) => c.id).join(',');
        const likeRes = await fetch(`/api/projects/${projectId}/comments/like?comment_ids=${commentIds}`);
        const likeData = await likeRes.json();
        setLikedComments(new Set(likeData.liked_ids || []));
      }
    } catch (error) {
      console.error('加载评论失败:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast({ title: '发送失败', description: data.error, variant: 'destructive' });
        return;
      }

      toast({ title: '评论成功', description: '你的评论已发布' });
      setNewComment('');
      fetchComments();
    } catch {
      toast({ title: '发送失败', description: '网络错误', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: number) => {
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent,
          parent_id: parentId,
          reply_to_user_id: replyingTo?.userId,
          reply_to_nickname: replyingTo?.nickname,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast({ title: '发送失败', description: data.error, variant: 'destructive' });
        return;
      }

      toast({ title: '回复成功', description: '你的回复已发布' });
      setReplyContent('');
      setReplyingTo(null);
      fetchComments();
    } catch {
      toast({ title: '发送失败', description: '网络错误', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: number) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/comments/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_id: commentId, action: 'toggle' }),
      });
      
      const data = await response.json();
      if (data.success) {
        // 更新点赞状态
        setLikedComments(prev => {
          const newSet = new Set(prev);
          if (data.is_liked) {
            newSet.add(commentId);
          } else {
            newSet.delete(commentId);
          }
          return newSet;
        });
        setComments(prev => prev.map(c => 
          c.id === commentId ? { ...c, like_count: data.like_count } : c
        ));
      }
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('确定要删除这条评论吗？')) return;
    
    try {
      const response = await fetch(`/api/projects/${projectId}/comments/${commentId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        toast({ title: '删除成功' });
        fetchComments();
      } else {
        toast({ title: '删除失败', description: data.error, variant: 'destructive' });
      }
    } catch (error) {
      console.error('删除失败:', error);
      toast({ title: '删除失败', variant: 'destructive' });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
  };

  const commentCount = comments.length + replies.length;
  const displayComments = comments.slice(0, 3);
  const hasMore = comments.length > 3;

  return (
    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          <span className="font-medium text-slate-700 dark:text-slate-300">项目讨论</span>
          <Badge variant="secondary" className="text-xs">
            {commentCount}
          </Badge>
        </div>
        {hasMore && (
          <Link 
            href={`/projects/${projectId}`}
            className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600 transition-colors"
          >
            查看更多评论
            <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* 评论输入框 */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`分享你对 ${projectName} 的看法...`}
              className="pr-10 bg-white/80 dark:bg-slate-800/80"
              maxLength={500}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <EmojiPicker onEmojiSelect={(emoji) => setNewComment(prev => prev + emoji)} />
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={submitting || !newComment.trim()}
            size="sm"
            className="bg-indigo-500 hover:bg-indigo-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>

      {/* 评论列表 - 显示前3条 */}
      {loading ? (
        <div className="py-3 text-center text-slate-400 text-sm">加载中...</div>
      ) : displayComments.length === 0 ? (
        <div className="py-4 text-center text-slate-400">
          <p className="text-sm">暂无讨论，来发表第一条吧！</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayComments.map((comment) => {
            const commentReplies = replies.filter(r => r.parent_id === comment.id);
            const isLiked = likedComments.has(comment.id);
            
            return (
              <div key={comment.id} className="group">
                {/* 主评论 */}
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                    {comment.nickname.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{comment.nickname}</span>
                      <span className="text-xs text-slate-400">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 break-words">{comment.content}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button
                        onClick={() => handleLike(comment.id)}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                          isLiked ? 'text-pink-500' : 'text-slate-400 hover:text-pink-500'
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                        {comment.like_count || 0}
                      </button>
                      <button
                        onClick={() => setReplyingTo({ id: comment.id, nickname: comment.nickname, userId: comment.user_id })}
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-500 transition-colors"
                      >
                        <Reply className="w-3 h-3" />
                        回复
                      </button>
                      {user?.isAdmin && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          删除
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 回复输入框 */}
                {replyingTo?.id === comment.id && (
                  <div className="mt-2 ml-10 flex gap-2">
                    <Input
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`回复 @${comment.nickname}...`}
                      className="flex-1 bg-white/80 dark:bg-slate-800/80 text-sm"
                      maxLength={300}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleReply(comment.id)}
                      disabled={submitting || !replyContent.trim()}
                      className="bg-indigo-500 hover:bg-indigo-600"
                    >
                      发送
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => { setReplyingTo(null); setReplyContent(''); }}
                    >
                      取消
                    </Button>
                  </div>
                )}

                {/* 回复列表 */}
                {commentReplies.length > 0 && (
                  <div className="ml-10 mt-2 space-y-2">
                    {commentReplies.map((reply) => (
                      <div key={reply.id} className="flex gap-2 text-sm">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-[10px] font-medium flex-shrink-0">
                          {reply.nickname.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-slate-600 dark:text-slate-400">{reply.nickname}</span>
                          {reply.reply_to_nickname && (
                            <span className="text-slate-400 mx-1">回复 @{reply.reply_to_nickname}</span>
                          )}
                          <span className="text-slate-600 dark:text-slate-400">: {reply.content}</span>
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
  );
}
