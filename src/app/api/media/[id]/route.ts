import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const MEDIA_CATEGORIES = ['works', 'competition', 'life'];

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

// 更新媒体（仅管理员）
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 });
    }

    const { id } = await params;
    const client = getSupabaseClient();
    const body = await request.json();
    const { title, description, category, is_published, sort_order } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) {
      if (!title?.trim()) return NextResponse.json({ error: '标题不能为空' }, { status: 400 });
      updateData.title = title.trim();
    }
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (category !== undefined && MEDIA_CATEGORIES.includes(category)) updateData.category = category;
    if (is_published !== undefined) updateData.is_published = is_published;
    if (sort_order !== undefined) updateData.sort_order = Number(sort_order) || 0;

    const { data: media, error } = await client
      .from('media')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !media) {
      return NextResponse.json({ error: '更新媒体失败' }, { status: 500 });
    }

    return NextResponse.json({ media });
  } catch (error) {
    console.error('更新媒体错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 删除媒体（仅管理员；若文件在本站存储桶且配置了服务密钥，同时删除文件）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 });
    }

    const { id } = await params;
    const client = getSupabaseClient();

    const { data: item } = await client
      .from('media')
      .select('url')
      .eq('id', id)
      .single();

    if (!item) {
      return NextResponse.json({ error: '媒体不存在' }, { status: 404 });
    }

    // 尝试删除存储桶中的文件（仅当 URL 属于本站 media 桶）
    const supabaseUrl = process.env.COZE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && serviceKey && item.url?.startsWith(`${supabaseUrl}/storage/v1/object/public/media/`)) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const adminClient = createClient(supabaseUrl, serviceKey);
        const objectPath = decodeURIComponent(
          item.url.replace(`${supabaseUrl}/storage/v1/object/public/media/`, '')
        );
        await adminClient.storage.from('media').remove([objectPath]);
      } catch (e) {
        console.error('删除存储文件失败（仅删除记录）:', e);
      }
    }

    const { error } = await client.from('media').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ error: '删除媒体失败' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除媒体错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
