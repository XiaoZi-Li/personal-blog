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

// 获取内容详情（浏览量 +1）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = getSupabaseClient();

    const { data: post, error } = await client
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !post) {
      return NextResponse.json({ error: '内容不存在' }, { status: 404 });
    }

    // 未发布内容仅管理员可见
    if (!post.is_published) {
      const isAdmin = await verifyAdmin(request);
      if (!isAdmin) {
        return NextResponse.json({ error: '内容不存在' }, { status: 404 });
      }
    }

    // 浏览量 +1（预览请求不计）
    const { searchParams } = new URL(request.url);
    if (searchParams.get('count_view') !== 'false') {
      await client
        .from('posts')
        .update({ views: (post.views || 0) + 1 })
        .eq('id', id);
      post.views = (post.views || 0) + 1;
    }

    // 相关推荐：同类型同分区，排除自身
    let related: any[] = [];
    const relatedQuery = client
      .from('posts')
      .select('id, title, type, category, summary, cover, difficulty, views, like_count, created_at')
      .eq('is_published', true)
      .neq('id', id)
      .order('created_at', { ascending: false })
      .limit(4);

    if (post.type === 'tutorial' && post.category) {
      const { data } = await relatedQuery.eq('type', 'tutorial').eq('category', post.category);
      related = data || [];
    } else {
      const { data } = await relatedQuery.eq('type', post.type);
      related = data || [];
    }

    return NextResponse.json({ post, related });
  } catch (error) {
    console.error('获取内容详情错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 更新内容（仅管理员）
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
    const {
      title, type, category, summary, content,
      cover, tags, difficulty, mood, weather, is_published, is_pinned
    } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) {
      if (!title?.trim()) return NextResponse.json({ error: '标题不能为空' }, { status: 400 });
      updateData.title = title.trim();
    }
    if (type !== undefined) updateData.type = type;
    if (category !== undefined) updateData.category = type === 'tutorial' ? category : null;
    if (summary !== undefined) updateData.summary = summary?.trim() || null;
    if (content !== undefined) {
      if (!content?.trim()) return NextResponse.json({ error: '内容不能为空' }, { status: 400 });
      updateData.content = content.trim();
    }
    if (cover !== undefined) updateData.cover = cover?.trim() || null;
    if (tags !== undefined) updateData.tags = tags?.trim() || null;
    if (difficulty !== undefined) updateData.difficulty = type === 'tutorial' ? difficulty : null;
    if (mood !== undefined) updateData.mood = type === 'diary' ? mood : null;
    if (weather !== undefined) updateData.weather = type === 'diary' ? weather : null;
    if (is_published !== undefined) updateData.is_published = is_published;
    if (is_pinned !== undefined) updateData.is_pinned = is_pinned;

    const { data: post, error } = await client
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !post) {
      console.error('更新内容失败:', error);
      return NextResponse.json({ error: '更新内容失败' }, { status: 500 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('更新内容错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 删除内容（仅管理员）
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

    const { error } = await client
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除内容失败:', error);
      return NextResponse.json({ error: '删除内容失败' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除内容错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
