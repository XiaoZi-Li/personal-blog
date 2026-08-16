import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 获取当前用户信息
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const client = getSupabaseClient();

    const { data: user, error } = await client
      .from('users')
      .select('id, username, email, nickname, avatar, role, created_at')
      .eq('id', payload.userId)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }
}

// 更新用户信息
export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const client = getSupabaseClient();

    const { nickname, avatar } = await request.json();
    const updates: Record<string, string> = {};

    if (nickname !== undefined) {
      if (!nickname || nickname.trim().length === 0) {
        return NextResponse.json({ error: '昵称不能为空' }, { status: 400 });
      }
      if (nickname.length > 20) {
        return NextResponse.json({ error: '昵称不能超过20个字符' }, { status: 400 });
      }
      updates.nickname = nickname.trim();
    }

    if (avatar !== undefined) {
      updates.avatar = avatar;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: '没有要更新的内容' }, { status: 400 });
    }

    const { error } = await client
      .from('users')
      .update(updates)
      .eq('id', payload.userId);

    if (error) {
      console.error('更新用户信息失败:', error);
      return NextResponse.json({ error: '更新失败' }, { status: 500 });
    }

    return NextResponse.json({ message: '更新成功', ...updates });
  } catch {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
