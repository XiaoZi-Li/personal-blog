import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { email, password, nickname, captchaAnswer } = await request.json();

    // 验证验证码
    const captchaToken = request.cookies.get('captcha_token')?.value;
    if (!captchaToken) {
      return NextResponse.json(
        { error: '验证码已过期，请刷新验证码' },
        { status: 400 }
      );
    }

    try {
      const { payload } = await jwtVerify(captchaToken, new TextEncoder().encode(JWT_SECRET));
      const storedAnswer = payload.answer as number;

      if (parseInt(captchaAnswer) !== storedAnswer) {
        return NextResponse.json(
          { error: '验证码错误' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: '验证码已过期，请刷新验证码' },
        { status: 400 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少6位' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // 检查邮箱是否已存在
    const { data: existingEmail } = await client
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingEmail) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 生成用户名（基于邮箱）
    const emailPrefix = email.split('@')[0];
    const randomSuffix = Math.floor(Math.random() * 1000);
    const username = `${emailPrefix}_${randomSuffix}`;

    // 创建用户
    const { data: user, error } = await client
      .from('users')
      .insert({
        username,
        email,
        password: hashedPassword,
        nickname: nickname || emailPrefix,
        role: 'user',
        is_active: true,
      })
      .select('id, username, email, nickname, role, created_at')
      .single();

    if (error) {
      console.error('注册失败:', error);
      return NextResponse.json(
        { error: '注册失败，请稍后重试' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: '注册成功',
      user 
    });
  } catch (error) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
