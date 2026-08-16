import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 设置/取消精华评论（仅管理员）
export async function POST(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    const { message_id, is_essence } = await request.json();

    if (!message_id) {
      return NextResponse.json({ error: '缺少消息ID' }, { status: 400 });
    }

    // 检查是否是管理员
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const userId = payload.userId;

    const { data: user } = await client
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    // 更新精华状态
    const { error: updateError } = await client
      .from('wall_messages')
      .update({ is_essence: is_essence })
      .eq('id', message_id);

    if (updateError) {
      return NextResponse.json({ error: '操作失败' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      is_essence 
    });
  } catch (error) {
    console.error('精华操作错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
