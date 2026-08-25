import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 获取当前用户标识（登录用户用 userId，匿名用户用 IP）
async function getUserId(request: NextRequest): Promise<string> {
  const token = request.cookies.get('auth_token')?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      if (payload.userId) return String(payload.userId);
    } catch {
      // token 无效
    }
  }
  return 'ip:' + (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous');
}

// 点赞/取消点赞（toggle）
export async function POST(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    const { post_id } = await request.json();

    if (!post_id) {
      return NextResponse.json({ error: '缺少内容ID' }, { status: 400 });
    }

    const userId = await getUserId(request);

    const { data: existingLike } = await client
      .from('post_likes')
      .select('id')
      .eq('post_id', post_id)
      .eq('user_id', userId)
      .single();

    const { data: post } = await client
      .from('posts')
      .select('like_count')
      .eq('id', post_id)
      .single();

    if (!post) {
      return NextResponse.json({ error: '内容不存在' }, { status: 404 });
    }

    let isLiked: boolean;
    let newLikeCount: number;

    if (existingLike) {
      await client.from('post_likes').delete().eq('id', existingLike.id);
      newLikeCount = Math.max((post.like_count || 1) - 1, 0);
      isLiked = false;
    } else {
      await client.from('post_likes').insert({ post_id, user_id: userId });
      newLikeCount = (post.like_count || 0) + 1;
      isLiked = true;
    }

    await client
      .from('posts')
      .update({ like_count: newLikeCount })
      .eq('id', post_id);

    return NextResponse.json({
      success: true,
      like_count: newLikeCount,
      is_liked: isLiked
    });
  } catch (error) {
    console.error('内容点赞错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 获取点赞状态
export async function GET(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const postIds = searchParams.get('post_ids')?.split(',').filter(Boolean) || [];

    if (postIds.length === 0) {
      return NextResponse.json({ liked_ids: [] });
    }

    const userId = await getUserId(request);

    const { data: likes } = await client
      .from('post_likes')
      .select('post_id')
      .eq('user_id', userId)
      .in('post_id', postIds);

    return NextResponse.json({ liked_ids: likes?.map(l => l.post_id) || [] });
  } catch (error) {
    console.error('获取点赞状态错误:', error);
    return NextResponse.json({ liked_ids: [] });
  }
}
