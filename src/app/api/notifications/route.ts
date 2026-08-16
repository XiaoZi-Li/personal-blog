import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 获取通知列表
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const client = getSupabaseClient();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 获取通知列表
    const { data: notifications, error } = await client
      .from('notifications')
      .select('*')
      .eq('user_id', payload.userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('获取通知失败:', error);
      return NextResponse.json({ error: '获取通知失败' }, { status: 500 });
    }

    // 获取未读数量
    const { count: unreadCount } = await client
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', payload.userId)
      .eq('is_read', false);

    // 获取总数
    const { count: total } = await client
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', payload.userId);

    return NextResponse.json({
      notifications: notifications || [],
      unreadCount: unreadCount || 0,
      total: total || 0,
      page,
      limit
    });
  } catch (error) {
    console.error('获取通知错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 标记通知为已读
export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const client = getSupabaseClient();

    const { id, all } = await request.json();

    if (all) {
      // 标记所有通知为已读
      const { error } = await client
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', payload.userId)
        .eq('is_read', false);

      if (error) {
        return NextResponse.json({ error: '操作失败' }, { status: 500 });
      }

      return NextResponse.json({ message: '已全部标记为已读' });
    }

    if (!id) {
      return NextResponse.json({ error: '通知ID不能为空' }, { status: 400 });
    }

    // 标记单个通知为已读
    const { error } = await client
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', payload.userId);

    if (error) {
      return NextResponse.json({ error: '操作失败' }, { status: 500 });
    }

    return NextResponse.json({ message: '已标记为已读' });
  } catch (error) {
    console.error('标记已读错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 删除通知
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const client = getSupabaseClient();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '通知ID不能为空' }, { status: 400 });
    }

    const { error } = await client
      .from('notifications')
      .delete()
      .eq('id', parseInt(id))
      .eq('user_id', payload.userId);

    if (error) {
      return NextResponse.json({ error: '删除失败' }, { status: 500 });
    }

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除通知错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
