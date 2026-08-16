import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import bcrypt from 'bcryptjs';

// 初始化管理员账号
export async function POST(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    const { username, password } = await request.json();

    // 默认管理员信息
    const adminUsername = username || 'lijunjie';
    const adminPassword = password || 'admin123456';

    // 检查是否已存在管理员
    const { data: existingAdmin } = await client
      .from('users')
      .select('id, username, role')
      .eq('role', 'admin')
      .single();

    if (existingAdmin) {
      return NextResponse.json({
        message: '管理员账号已存在',
        admin: { id: existingAdmin.id, username: existingAdmin.username }
      });
    }

    // 检查用户名是否已存在
    const { data: existingUser } = await client
      .from('users')
      .select('id')
      .eq('username', adminUsername)
      .single();

    if (existingUser) {
      // 更新为管理员
      const { data: updatedUser, error } = await client
        .from('users')
        .update({ role: 'admin' })
        .eq('id', existingUser.id)
        .select('id, username, email, nickname, role')
        .single();

      if (error) {
        return NextResponse.json({ error: '设置管理员失败' }, { status: 500 });
      }

      return NextResponse.json({
        message: '已将现有用户设为管理员',
        admin: updatedUser,
        note: '请使用该用户的原密码登录'
      });
    }

    // 创建新管理员账号
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const { data: newAdmin, error } = await client
      .from('users')
      .insert({
        username: adminUsername,
        email: 'purplemist@qq.com',
        password: hashedPassword,
        nickname: '李俊杰',
        role: 'admin',
        is_active: true,
      })
      .select('id, username, email, nickname, role')
      .single();

    if (error) {
      console.error('创建管理员失败:', error);
      return NextResponse.json({ error: '创建管理员失败' }, { status: 500 });
    }

    return NextResponse.json({
      message: '管理员账号创建成功',
      admin: newAdmin,
      credentials: {
        username: adminUsername,
        password: adminPassword
      },
      note: '请记录密码，此信息仅显示一次'
    });
  } catch (error) {
    console.error('初始化管理员错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
