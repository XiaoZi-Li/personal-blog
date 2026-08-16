import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, getSupabaseCredentials } from '@/storage/database/supabase-client';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 上传头像（存储到 Supabase Storage 的 avatars 公开桶）
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

    const formData = await request.formData();
    const file = formData.get('avatar') as File | null;

    if (!file) {
      return NextResponse.json({ error: '请选择图片' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '只支持 JPG、PNG、GIF、WebP 格式的图片' }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: '图片大小不能超过 2MB' }, { status: 400 });
    }

    // 上传客户端：配置了 service role key 时用它（可写），否则回退到 anon key（依赖桶的 INSERT 策略）
    const { url, anonKey } = getSupabaseCredentials();
    const storageClient = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY || anonKey, {
      db: { timeout: 60000 },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const arrayBuffer = await file.arrayBuffer();
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${payload.userId}_${Date.now()}.${ext}`;

    const { error: uploadError } = await storageClient.storage
      .from('avatars')
      .upload(fileName, Buffer.from(arrayBuffer), { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error('上传头像失败:', uploadError);
      return NextResponse.json({ error: '上传头像失败' }, { status: 500 });
    }

    const { data: urlData } = storageClient.storage.from('avatars').getPublicUrl(fileName);
    const avatarUrl = urlData.publicUrl;

    // 更新用户头像
    const client = getSupabaseClient();
    const { data: oldUser } = await client
      .from('users')
      .select('avatar')
      .eq('id', payload.userId)
      .single();

    const { error } = await client
      .from('users')
      .update({ avatar: avatarUrl })
      .eq('id', payload.userId);

    if (error) {
      console.error('更新头像失败:', error);
      return NextResponse.json({ error: '更新头像失败' }, { status: 500 });
    }

    // 清理旧头像文件（仅限本用户上传的 supabase 文件）
    const oldAvatar = oldUser?.avatar;
    if (oldAvatar?.includes('/storage/v1/object/public/avatars/')) {
      const oldName = oldAvatar.split('/storage/v1/object/public/avatars/')[1]?.split('?')[0];
      if (oldName && oldName.startsWith(`${payload.userId}_`)) {
        await storageClient.storage.from('avatars').remove([oldName]);
      }
    }

    return NextResponse.json({
      message: '头像上传成功',
      avatar: avatarUrl,
    });
  } catch (error) {
    console.error('上传头像错误:', error);
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
}
