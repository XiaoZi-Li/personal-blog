'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users, MessageSquare, Eye, TrendingUp, LogOut, LayoutDashboard, 
  Trash2, Pin, PinOff, RefreshCw, ChevronLeft, ChevronRight,
  MessageCircle, UserX, UserCheck, Ban
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Stats {
  totalViews: number;
  todayViews: number;
  totalUsers: number;
  totalMessages: number;
}

interface Message {
  id: number;
  user_id: number | null;
  nickname: string;
  content: string;
  is_public: boolean;
  is_pinned: boolean;
  created_at: string;
  // 管理员可见邮箱
  user_email?: string;
}

interface Reply {
  id: number;
  parent_id: number;
  nickname: string;
  content: string;
  is_admin_reply: boolean;
  is_public: boolean;
  created_at: string;
  user_email?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  nickname: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
}

interface CurrentUser {
  id: number;
  username: string;
  nickname: string;
  role: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'messages' | 'users'>('stats');
  
  // 统计数据
  const [stats, setStats] = useState<Stats | null>(null);
  const [viewsByDate, setViewsByDate] = useState<{ date: string; count: number }[]>([]);
  const [topPages, setTopPages] = useState<{ page: string; count: number }[]>([]);
  
  // 留言数据
  const [messages, setMessages] = useState<Message[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [messagePage, setMessagePage] = useState(1);
  const [messageTotal, setMessageTotal] = useState(0);
  const messageLimit = 10;

  // 用户数据
  const [users, setUsers] = useState<User[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);
  const userLimit = 10;

  const fetchData = useCallback(async () => {
    try {
      // 检查登录状态
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      
      if (!userData.user || userData.user.role !== 'admin') {
        toast({
          title: '无权限访问',
          description: '请使用管理员账号登录',
          variant: 'destructive',
        });
        router.push('/login');
        return;
      }

      setUser(userData.user);
      setLoading(false);

      // 获取统计数据
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();

      if (statsRes.ok) {
        setStats(statsData.stats);
        setTopPages(statsData.topPages || []);
        const chartData = Object.entries(statsData.viewsByDate || {}).map(([date, count]) => ({
          date,
          count: count as number,
        }));
        setViewsByDate(chartData);
      }
    } catch (error) {
      toast({
        title: '加载失败',
        description: '无法加载数据',
        variant: 'destructive',
      });
    }
  }, [router, toast]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/messages?page=${messagePage}&limit=${messageLimit}`);
      const data = await response.json();

      if (response.ok) {
        setMessages(data.messages || []);
        setReplies(data.replies || []);
        setMessageTotal(data.total || 0);
      }
    } catch (error) {
      toast({
        title: '加载失败',
        description: '无法加载留言',
        variant: 'destructive',
      });
    }
  }, [messagePage, toast]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/users?page=${userPage}&limit=${userLimit}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
        setUserTotal(data.total || 0);
      }
    } catch (error) {
      toast({
        title: '加载失败',
        description: '无法加载用户列表',
        variant: 'destructive',
      });
    }
  }, [userPage, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, messagePage, userPage, fetchMessages, fetchUsers]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('确定要删除这条留言吗？相关的回复也会被删除。')) return;

    try {
      const response = await fetch(`/api/admin/messages?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) {
        toast({ title: '删除失败', description: data.error, variant: 'destructive' });
        return;
      }

      toast({ title: '删除成功' });
      fetchMessages();
    } catch {
      toast({ title: '删除失败', description: '网络错误', variant: 'destructive' });
    }
  };

  const handleTogglePin = async (id: number, isPinned: boolean) => {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_pinned: !isPinned }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast({ title: '操作失败', description: data.error, variant: 'destructive' });
        return;
      }

      toast({ title: data.message });
      fetchMessages();
    } catch {
      toast({ title: '操作失败', description: '网络错误', variant: 'destructive' });
    }
  };

  const handleDeleteUser = async (id: number, nickname: string) => {
    if (!confirm(`确定要删除用户 "${nickname}" 吗？该用户的留言将保留但不再关联账号。`)) return;

    try {
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) {
        toast({ title: '删除失败', description: data.error, variant: 'destructive' });
        return;
      }

      toast({ title: '删除成功' });
      fetchUsers();
    } catch {
      toast({ title: '删除失败', description: '网络错误', variant: 'destructive' });
    }
  };

  const handleToggleUserStatus = async (id: number, isActive: boolean, nickname: string) => {
    const action = isActive ? '禁用' : '启用';
    if (!confirm(`确定要${action}用户 "${nickname}" 吗？`)) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, is_active: !isActive }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast({ title: '操作失败', description: data.error, variant: 'destructive' });
        return;
      }

      toast({ title: data.message });
      fetchUsers();
    } catch {
      toast({ title: '操作失败', description: '网络错误', variant: 'destructive' });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const messageTotalPages = Math.ceil(messageTotal / messageLimit);
  const userTotalPages = Math.ceil(userTotal / userLimit);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pt-20 flex items-center justify-center">
        <div className="text-slate-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6" />
              管理后台
            </h1>
            <p className="text-slate-500">欢迎，{user?.nickname || user?.username}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </Button>
        </div>

        {/* 标签页切换 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={activeTab === 'stats' ? 'default' : 'outline'}
            onClick={() => setActiveTab('stats')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            访问统计
          </Button>
          <Button
            variant={activeTab === 'messages' ? 'default' : 'outline'}
            onClick={() => setActiveTab('messages')}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            留言管理
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
          >
            <Users className="w-4 h-4 mr-2" />
            用户管理
          </Button>
        </div>

        {/* 统计标签页 */}
        {activeTab === 'stats' && (
          <>
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">总访问量</p>
                      <p className="text-3xl font-bold">{stats?.totalViews || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">今日访问</p>
                      <p className="text-3xl font-bold">{stats?.todayViews || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">注册用户</p>
                      <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">留言总数</p>
                      <p className="text-3xl font-bold">{stats?.totalMessages || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 图表 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>访问趋势（近7天）</CardTitle>
                </CardHeader>
                <CardContent>
                  {viewsByDate.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={viewsByDate}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-slate-400">
                      暂无数据
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>热门页面</CardTitle>
                </CardHeader>
                <CardContent>
                  {topPages.length > 0 ? (
                    <div className="space-y-3">
                      {topPages.map((page, index) => (
                        <div key={page.page} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-sm font-mono">{page.page}</span>
                          </div>
                          <span className="text-sm text-slate-500">{page.count} 次</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-slate-400">
                      暂无数据
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* 留言管理标签页 */}
        {activeTab === 'messages' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>留言管理</CardTitle>
              <Button variant="outline" size="sm" onClick={() => fetchMessages()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新
              </Button>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <div className="py-12 text-center text-slate-500">暂无留言</div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`p-4 rounded-lg border ${msg.is_pinned ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{msg.nickname}</span>
                            {/* 管理员可见邮箱 */}
                            {msg.user_email && (
                              <span className="text-xs text-slate-400">({msg.user_email})</span>
                            )}
                            {msg.is_pinned && (
                              <Badge variant="secondary" className="text-xs">
                                <Pin className="w-3 h-3 mr-1" />
                                置顶
                              </Badge>
                            )}
                            {!msg.is_public && (
                              <Badge variant="destructive" className="text-xs">私密</Badge>
                            )}
                            <span className="text-xs text-slate-400">
                              {formatDate(msg.created_at)}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{msg.content}</p>

                          {/* 显示回复 */}
                          {replies.filter(r => r.parent_id === msg.id).map((reply) => (
                            <div key={reply.id} className="mt-3 ml-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{reply.nickname}</span>
                                {/* 管理员可见回复者邮箱 */}
                                {reply.user_email && (
                                  <span className="text-xs text-slate-400">({reply.user_email})</span>
                                )}
                                {reply.is_admin_reply && (
                                  <Badge variant="default" className="text-xs bg-indigo-600">博主</Badge>
                                )}
                                {!reply.is_public && (
                                  <Badge variant="destructive" className="text-xs">私密</Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-500">{reply.content}</p>
                            </div>
                          ))}
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTogglePin(msg.id, msg.is_pinned)}
                          >
                            {msg.is_pinned ? (
                              <>
                                <PinOff className="w-4 h-4 mr-1" />
                                取消置顶
                              </>
                            ) : (
                              <>
                                <Pin className="w-4 h-4 mr-1" />
                                置顶
                              </>
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteMessage(msg.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            删除
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 分页 */}
              {messageTotalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMessagePage(p => Math.max(1, p - 1))}
                    disabled={messagePage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    上一页
                  </Button>
                  <span className="text-sm text-slate-500">
                    第 {messagePage} / {messageTotalPages} 页
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMessagePage(p => Math.min(messageTotalPages, p + 1))}
                    disabled={messagePage === messageTotalPages}
                  >
                    下一页
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 用户管理标签页 */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>用户管理</CardTitle>
              <Button variant="outline" size="sm" onClick={() => fetchUsers()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新
              </Button>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="py-12 text-center text-slate-500">暂无用户</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4">昵称</th>
                        <th className="text-left py-3 px-4">邮箱</th>
                        <th className="text-left py-3 px-4">角色</th>
                        <th className="text-left py-3 px-4">状态</th>
                        <th className="text-left py-3 px-4">注册时间</th>
                        <th className="text-left py-3 px-4">最后登录</th>
                        <th className="text-right py-3 px-4">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-3 px-4">
                            <span className="font-medium">{u.nickname || u.username}</span>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-500">{u.email}</td>
                          <td className="py-3 px-4">
                            <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                              {u.role === 'admin' ? '管理员' : '用户'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={u.is_active ? 'default' : 'destructive'} 
                              className={u.is_active ? 'bg-green-600' : ''}>
                              {u.is_active ? '正常' : '已禁用'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-500">
                            {formatDate(u.created_at)}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-500">
                            {u.last_login_at ? formatDate(u.last_login_at) : '从未登录'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              {u.id !== user?.id && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleUserStatus(u.id, u.is_active, u.nickname)}
                                  >
                                    {u.is_active ? (
                                      <>
                                        <Ban className="w-4 h-4 mr-1" />
                                        禁用
                                      </>
                                    ) : (
                                      <>
                                        <UserCheck className="w-4 h-4 mr-1" />
                                        启用
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteUser(u.id, u.nickname)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    删除
                                  </Button>
                                </>
                              )}
                              {u.id === user?.id && (
                                <span className="text-xs text-slate-400">当前账号</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 分页 */}
              {userTotalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUserPage(p => Math.max(1, p - 1))}
                    disabled={userPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    上一页
                  </Button>
                  <span className="text-sm text-slate-500">
                    第 {userPage} / {userTotalPages} 页
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUserPage(p => Math.min(userTotalPages, p + 1))}
                    disabled={userPage === userTotalPages}
                  >
                    下一页
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
