import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 记录页面访问
export async function POST(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    const { page } = await request.json();

    if (!page) {
      return NextResponse.json({ error: '页面路径不能为空' }, { status: 400 });
    }

    // 获取用户ID（如果已登录）
    let userId = null;
    const token = request.cookies.get('auth_token')?.value;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        userId = payload.userId;
      } catch {
        // token 无效，忽略
      }
    }

    // 获取客户端信息
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';

    // 防刷机制：检查同一 IP 在 1 分钟内是否已访问过同一页面
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { data: recentViews } = await client
      .from('page_views')
      .select('id')
      .eq('ip_address', ipAddress)
      .eq('page', page)
      .gte('created_at', oneMinuteAgo)
      .limit(1);

    // 如果 1 分钟内已有记录，则不重复记录
    if (recentViews && recentViews.length > 0) {
      return NextResponse.json({ success: true, duplicate: true });
    }

    // 记录访问
    await client.from('page_views').insert({
      user_id: userId,
      page,
      ip_address: ipAddress,
      user_agent: userAgent,
      referrer,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('记录访问错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
