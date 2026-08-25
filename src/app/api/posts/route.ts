import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const POST_TYPES = ['tutorial', 'article', 'diary'];
const TUTORIAL_CATEGORIES = ['51mcu', 'stm32', 'esp32', 'dcdc'];

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

// 获取内容列表
export async function GET(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.trim();
    const difficulty = searchParams.get('difficulty');
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '12'), 1), 50);
    const offset = (page - 1) * limit;

    let query = client
      .from('posts')
      .select('id, title, type, category, summary, cover, tags, difficulty, mood, weather, views, like_count, is_published, is_pinned, created_at, updated_at', { count: 'exact' });

    if (type && POST_TYPES.includes(type)) {
      query = query.eq('type', type);
    }
    if (category && TUTORIAL_CATEGORIES.includes(category)) {
      query = query.eq('category', category);
    }
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%,tags.ilike.%${search}%`);
    }

    // 管理员可看未发布内容
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      query = query.eq('is_published', true);
    }

    query = query
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: posts, error, count } = await query;

    if (error) {
      console.error('获取内容失败:', error);
      return NextResponse.json({ error: '获取内容失败' }, { status: 500 });
    }

    return NextResponse.json({
      posts: posts || [],
      total: count || 0,
      page,
      limit
    });
  } catch (error) {
    console.error('获取内容错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 创建内容（仅管理员）
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 });
    }

    const client = getSupabaseClient();
    const body = await request.json();
    const {
      title, type, category, summary, content,
      cover, tags, difficulty, mood, weather, is_published, is_pinned
    } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: '标题不能为空' }, { status: 400 });
    }
    if (!content?.trim()) {
      return NextResponse.json({ error: '内容不能为空' }, { status: 400 });
    }
    if (type && !POST_TYPES.includes(type)) {
      return NextResponse.json({ error: '无效的内容类型' }, { status: 400 });
    }
    if (type === 'tutorial' && category && !TUTORIAL_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: '无效的教程分区' }, { status: 400 });
    }

    const { data: post, error } = await client
      .from('posts')
      .insert({
        title: title.trim(),
        type: type || 'article',
        category: type === 'tutorial' ? (category || null) : null,
        summary: summary?.trim() || null,
        content: content.trim(),
        cover: cover?.trim() || null,
        tags: tags?.trim() || null,
        difficulty: type === 'tutorial' ? (difficulty || 'beginner') : null,
        mood: type === 'diary' ? (mood || null) : null,
        weather: type === 'diary' ? (weather || null) : null,
        is_published: is_published !== false,
        is_pinned: is_pinned === true,
      })
      .select()
      .single();

    if (error) {
      console.error('创建内容失败:', error);
      return NextResponse.json({ error: '创建内容失败' }, { status: 500 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('创建内容错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
