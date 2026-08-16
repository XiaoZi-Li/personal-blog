import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 获取用户列表（管理员）
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
    const { data: adminUser } = await client
      .from('users')
      .select('role')
      .eq('id', payload.userId)
      .single();

    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: '无权限访问' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 获取用户列表
    const { data: users, error } = await client
      .from('users')
      .select('id, username, email, nickname, avatar, role, is_active, created_at, last_login_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: '获取用户列表失败' }, { status: 500 });
    }

    // 获取总数
    const { count } = await client
      .from('users')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({ 
      users: users || [],
      total: count || 0,
      page,
      limit
    });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 删除用户（管理员）
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
    const { data: adminUser } = await client
      .from('users')
      .select('id, role')
      .eq('id', payload.userId)
      .single();

    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: '无权限访问' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: '用户ID不能为空' }, { status: 400 });
    }

    // 不能删除自己
    if (parseInt(userId) === adminUser.id) {
      return NextResponse.json({ error: '不能删除自己的账号' }, { status: 400 });
    }

    // 删除用户（留言会保留，但user_id会变为null）
    const { error } = await client
      .from('users')
      .delete()
      .eq('id', parseInt(userId));

    if (error) {
      console.error('删除用户失败:', error);
      return NextResponse.json({ error: '删除失败' }, { status: 500 });
    }

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除用户错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 更新用户状态（管理员）
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
    const { data: adminUser } = await client
      .from('users')
      .select('id, role')
      .eq('id', payload.userId)
      .single();

    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: '无权限访问' }, { status: 403 });
    }

    const { userId, is_active } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: '用户ID不能为空' }, { status: 400 });
    }

    // 不能禁用自己
    if (userId === adminUser.id) {
      return NextResponse.json({ error: '不能禁用自己的账号' }, { status: 400 });
    }

    const { error } = await client
      .from('users')
      .update({ is_active })
      .eq('id', userId);

    if (error) {
      console.error('更新用户状态失败:', error);
      return NextResponse.json({ error: '更新失败' }, { status: 500 });
    }

    return NextResponse.json({ message: is_active ? '已启用' : '已禁用' });
  } catch (error) {
    console.error('更新用户状态错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
