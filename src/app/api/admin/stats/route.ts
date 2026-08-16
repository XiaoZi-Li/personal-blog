import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 获取统计数据（仅管理员）
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    
    const client = getSupabaseClient();
    
    // 获取用户信息验证权限
    const { data: user } = await client
      .from('users')
      .select('role')
      .eq('id', payload.userId)
      .single();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限访问' }, { status: 403 });
    }

    // 获取访问统计
    const { count: totalViews } = await client
      .from('page_views')
      .select('*', { count: 'exact', head: true });

    // 获取今日访问量
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todayViews } = await client
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // 获取用户统计
    const { count: totalUsers } = await client
      .from('users')
      .select('*', { count: 'exact', head: true });

    // 获取留言统计
    const { count: totalMessages } = await client
      .from('wall_messages')
      .select('*', { count: 'exact', head: true });

    // 获取最近7天访问趋势
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { data: recentViews } = await client
      .from('page_views')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    // 按日期分组统计
    const viewsByDate: Record<string, number> = {};
    recentViews?.forEach(view => {
      const date = new Date(view.created_at).toLocaleDateString('zh-CN');
      viewsByDate[date] = (viewsByDate[date] || 0) + 1;
    });

    // 获取热门页面
    const { data: pageViews } = await client
      .from('page_views')
      .select('page');
    
    const pageViewCounts: Record<string, number> = {};
    pageViews?.forEach(pv => {
      pageViewCounts[pv.page] = (pageViewCounts[pv.page] || 0) + 1;
    });
    const topPages = Object.entries(pageViewCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }));

    return NextResponse.json({
      stats: {
        totalViews: totalViews || 0,
        todayViews: todayViews || 0,
        totalUsers: totalUsers || 0,
        totalMessages: totalMessages || 0,
      },
      viewsByDate,
      topPages,
    });
  } catch (error) {
    console.error('获取统计错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
