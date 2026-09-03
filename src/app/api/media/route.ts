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

// 获取媒体列表
export async function GET(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '200'), 1), 500);

    let query = client
      .from('media')
      .select('*')
      .order('sort_order', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      query = query.eq('is_published', true);
    }
    if (category && MEDIA_CATEGORIES.includes(category)) {
      query = query.eq('category', category);
    }
    if (type === 'image' || type === 'video') {
      query = query.eq('type', type);
    }

    const { data: media, error } = await query;
    if (error) {
      console.error('获取媒体失败:', error);
      return NextResponse.json({ error: '获取媒体失败' }, { status: 500 });
    }

    return NextResponse.json({ media: media || [] });
  } catch (error) {
    console.error('获取媒体错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 创建媒体记录（仅管理员）
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 });
    }

    const client = getSupabaseClient();
    const body = await request.json();
    const { title, description, type, url, thumbnail, category, is_published } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: '标题不能为空' }, { status: 400 });
    }
    if (!url?.trim()) {
      return NextResponse.json({ error: '链接不能为空' }, { status: 400 });
    }
    if (type !== 'image' && type !== 'video') {
      return NextResponse.json({ error: '无效的媒体类型' }, { status: 400 });
    }

    const { data: media, error } = await client
      .from('media')
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        type,
        url: url.trim(),
        thumbnail: thumbnail?.trim() || null,
        category: category && MEDIA_CATEGORIES.includes(category) ? category : 'works',
        is_published: is_published !== false,
      })
      .select()
      .single();

    if (error) {
      console.error('创建媒体失败:', error);
      return NextResponse.json({ error: '创建媒体失败' }, { status: 500 });
    }

    return NextResponse.json({ media });
  } catch (error) {
    console.error('创建媒体错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
