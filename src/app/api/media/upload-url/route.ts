import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const client = getSupabaseClient();
    const { data: user } = await client
      .from('users')
      .select('role')
      .eq('id', payload.userId)
      .single();
    return user?.role === 'admin';
  } catch {
    return false;
  }
}

// 生成临时签名上传 URL（仅管理员）
// 浏览器拿到 URL 后直接把文件 PUT 到 Supabase 存储，不经过本站服务器，不受 Serverless 请求体大小限制
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 });
    }

    const supabaseUrl = process.env.COZE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: '尚未配置 SUPABASE_SERVICE_ROLE_KEY 环境变量，无法使用文件上传。请到 Supabase → Settings → API 复制 service_role key，添加到 Vercel 环境变量后重试；或改用「外部链接」方式添加。' },
        { status: 503 }
      );
    }

    const { filename, contentType } = await request.json();
    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ error: '缺少文件名' }, { status: 400 });
    }

    // 只允许图片和视频
    if (contentType && !contentType.startsWith('image/') && !contentType.startsWith('video/')) {
      return NextResponse.json({ error: '只支持图片和视频文件' }, { status: 400 });
    }

    // 清理文件名，避免路径问题
    const safeName = filename
      .replace(/[^\w.-]+/g, '_')
      .replace(/_{2,}/g, '_')
      .slice(-80) || 'file';
    const objectPath = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

    const { createClient } = await import('@supabase/supabase-js');
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data, error } = await adminClient.storage
      .from('media')
      .createSignedUploadUrl(objectPath);

    if (error || !data) {
      console.error('生成上传 URL 失败:', error);
      return NextResponse.json({ error: '生成上传 URL 失败' }, { status: 500 });
    }

    return NextResponse.json({
      path: objectPath,
      token: data.token,
      uploadUrl: `${supabaseUrl}/storage/v1/object/upload/sign/media/${objectPath}?token=${data.token}`,
      publicUrl: `${supabaseUrl}/storage/v1/object/public/media/${objectPath}`,
    });
  } catch (error) {
    console.error('生成上传 URL 错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
