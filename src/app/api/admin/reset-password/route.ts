import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import bcrypt from 'bcryptjs';

// 重置管理员密码
export async function POST(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    const { email, password } = await request.json();

    if (!email) {
      return NextResponse.json({ error: '请提供邮箱' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: '密码长度至少6位' }, { status: 400 });
    }

    // 通过邮箱查找管理员账号
    const { data: admin, error: findError } = await client
      .from('users')
      .select('id, username, nickname, role')
      .eq('email', email)
      .single();

    if (findError || !admin) {
      return NextResponse.json({ error: '未找到该邮箱对应的账号' }, { status: 404 });
    }

    // 自动设置为管理员（如果没有）
    if (admin.role !== 'admin') {
      await client
        .from('users')
        .update({ role: 'admin' })
        .eq('id', admin.id);
    }

    // 更新密码
    const hashedPassword = await bcrypt.hash(password, 10);
    const { error: updateError } = await client
      .from('users')
      .update({ password: hashedPassword, role: 'admin' })
      .eq('id', admin.id);

    if (updateError) {
      return NextResponse.json({ error: '密码重置失败' }, { status: 500 });
    }

    return NextResponse.json({
      message: '密码重置成功',
      admin: {
        id: admin.id,
        username: admin.username,
        nickname: admin.nickname,
        email: email
      }
    });
  } catch (error) {
    console.error('重置密码错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
