import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 点赞/取消点赞
export async function POST(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    const { message_id, action } = await request.json();

    if (!message_id) {
      return NextResponse.json({ error: '缺少消息ID' }, { status: 400 });
    }

    // 获取用户ID
    let userId = 'anonymous';
    const sessionToken = request.cookies.get('session_token')?.value;
    if (sessionToken) {
      try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(sessionToken, secret);
        userId = payload.userId as string || 'anonymous';
      } catch {
        // token无效，使用匿名用户
      }
    }

    // 检查用户是否已点赞
    const { data: existingLike } = await client
      .from('message_likes')
      .select('id')
      .eq('message_id', message_id)
      .eq('user_id', userId)
      .single();

    let isLiked: boolean;
    let newLikeCount: number;

    if (action === 'toggle') {
      // 切换模式：已点赞则取消，未点赞则添加
      if (existingLike) {
        // 取消点赞
        await client
          .from('message_likes')
          .delete()
          .eq('id', existingLike.id);
        
        const { data: msg } = await client
          .from('wall_messages')
          .select('like_count')
          .eq('id', message_id)
          .single();
        
        newLikeCount = Math.max((msg?.like_count || 1) - 1, 0);
        await client
          .from('wall_messages')
          .update({ like_count: newLikeCount })
          .eq('id', message_id);
        
        isLiked = false;
      } else {
        // 添加点赞
        await client
          .from('message_likes')
          .insert({ message_id, user_id: userId });
        
        const { data: msg } = await client
          .from('wall_messages')
          .select('like_count')
          .eq('id', message_id)
          .single();
        
        newLikeCount = (msg?.like_count || 0) + 1;
        await client
          .from('wall_messages')
          .update({ like_count: newLikeCount })
          .eq('id', message_id);
        
        isLiked = true;
      }
    } else {
      // 兼容旧模式：只增加
      const { data: message } = await client
        .from('wall_messages')
        .select('like_count')
        .eq('id', message_id)
        .single();

      newLikeCount = (message?.like_count || 0) + 1;
      await client
        .from('wall_messages')
        .update({ like_count: newLikeCount })
        .eq('id', message_id);
      
      isLiked = true;
    }

    return NextResponse.json({ 
      success: true, 
      like_count: newLikeCount,
      is_liked: isLiked
    });
  } catch (error) {
    console.error('点赞错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 获取用户点赞状态
export async function GET(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const messageIds = searchParams.get('message_ids')?.split(',').map(Number) || [];

    if (messageIds.length === 0) {
      return NextResponse.json({ liked_ids: [] });
    }

    // 获取用户ID
    let userId = 'anonymous';
    const sessionToken = request.cookies.get('session_token')?.value;
    if (sessionToken) {
      try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(sessionToken, secret);
        userId = payload.userId as string || 'anonymous';
      } catch {
        // token无效
      }
    }

    const { data: likes } = await client
      .from('message_likes')
      .select('message_id')
      .eq('user_id', userId)
      .in('message_id', messageIds);

    const likedIds = likes?.map(l => l.message_id) || [];

    return NextResponse.json({ liked_ids: likedIds });
  } catch (error) {
    console.error('获取点赞状态错误:', error);
    return NextResponse.json({ liked_ids: [] });
  }
}
