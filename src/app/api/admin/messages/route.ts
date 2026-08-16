import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 获取所有留言（管理员用，包括私密留言和用户邮箱）
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 获取所有留言（包括私密留言）
    const { data: messages, error } = await client
      .from('wall_messages')
      .select('id, user_id, nickname, content, is_public, parent_id, is_admin_reply, is_pinned, like_count, created_at')
      .is('parent_id', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: '获取留言失败' }, { status: 500 });
    }

    // 获取所有回复
    const messageIds = messages?.map(m => m.id) || [];
    let replies: any[] = [];
    if (messageIds.length > 0) {
      const { data: repliesData } = await client
        .from('wall_messages')
        .select('id, user_id, nickname, content, parent_id, is_admin_reply, is_public, created_at')
        .in('parent_id', messageIds)
        .order('created_at', { ascending: true });
      replies = repliesData || [];
    }

    // 获取所有相关用户的邮箱
    const allUserIds = [
      ...(messages?.filter(m => m.user_id).map(m => m.user_id) || []),
      ...(replies?.filter(r => r.user_id).map(r => r.user_id) || [])
    ];
    const uniqueUserIds = [...new Set(allUserIds)] as number[];

    let userEmails: Record<number, string> = {};
    if (uniqueUserIds.length > 0) {
      const { data: usersData } = await client
        .from('users')
        .select('id, email')
        .in('id', uniqueUserIds);
      
      usersData?.forEach(u => {
        userEmails[u.id] = u.email;
      });
    }

    // 为留言和回复添加邮箱信息
    const messagesWithEmail = messages?.map(m => ({
      ...m,
      user_email: m.user_id ? userEmails[m.user_id] : null
    }));

    const repliesWithEmail = replies?.map(r => ({
      ...r,
      user_email: r.user_id ? userEmails[r.user_id] : null
    }));

    // 获取总数
    const { count } = await client
      .from('wall_messages')
      .select('*', { count: 'exact', head: true })
      .is('parent_id', null);

    return NextResponse.json({ 
      messages: messagesWithEmail || [],
      replies: repliesWithEmail || [],
      total: count || 0,
      page,
      limit
    });
  } catch (error) {
    console.error('获取留言错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 删除留言（管理员用）
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '留言ID不能为空' }, { status: 400 });
    }

    // 先删除该留言的所有回复
    await client
      .from('wall_messages')
      .delete()
      .eq('parent_id', parseInt(id));

    // 再删除留言本身
    const { error } = await client
      .from('wall_messages')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('删除留言失败:', error);
      return NextResponse.json({ error: '删除失败' }, { status: 500 });
    }

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除留言错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 置顶/取消置顶留言
export async function PATCH(request: NextRequest) {
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

    const { id, is_pinned } = await request.json();

    if (!id) {
      return NextResponse.json({ error: '留言ID不能为空' }, { status: 400 });
    }

    const { error } = await client
      .from('wall_messages')
      .update({ is_pinned })
      .eq('id', id);

    if (error) {
      console.error('更新留言失败:', error);
      return NextResponse.json({ error: '更新失败' }, { status: 500 });
    }

    return NextResponse.json({ message: is_pinned ? '已置顶' : '已取消置顶' });
  } catch (error) {
    console.error('更新留言错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
