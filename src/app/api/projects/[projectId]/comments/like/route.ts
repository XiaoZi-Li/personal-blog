import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { projectId } = await params;
    const { comment_id, action } = await request.json();

    // 获取用户ID - 使用 JWT cookie 认证
    let userId = 'anonymous';
    const token = request.cookies.get('auth_token')?.value;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        userId = payload.userId as string;
      } catch {
        // token 无效，使用匿名身份
      }
    }

    // 检查用户是否已点赞
    const { data: existingLike } = await supabase
      .from('project_comment_likes')
      .select('id')
      .eq('comment_id', comment_id)
      .eq('user_id', userId)
      .single();

    let isLiked: boolean;
    let newLikeCount: number;

    if (action === 'toggle') {
      if (existingLike) {
        // 取消点赞
        await supabase
          .from('project_comment_likes')
          .delete()
          .eq('id', existingLike.id);
        
        const { data: comment } = await supabase
          .from('project_comments')
          .select('like_count')
          .eq('id', comment_id)
          .single();
        
        newLikeCount = Math.max(0, (comment?.like_count || 1) - 1);
        isLiked = false;
      } else {
        // 添加点赞
        await supabase
          .from('project_comment_likes')
          .insert({ comment_id, user_id: userId });
        
        const { data: comment } = await supabase
          .from('project_comments')
          .select('like_count')
          .eq('id', comment_id)
          .single();
        
        newLikeCount = (comment?.like_count || 0) + 1;
        isLiked = true;
      }

      // 更新点赞数
      await supabase
        .from('project_comments')
        .update({ like_count: newLikeCount })
        .eq('id', comment_id);
    } else {
      // 兼容旧的点赞逻辑
      if (existingLike) {
        isLiked = true;
        const { data: comment } = await supabase
          .from('project_comments')
          .select('like_count')
          .eq('id', comment_id)
          .single();
        newLikeCount = comment?.like_count || 0;
      } else {
        await supabase
          .from('project_comment_likes')
          .insert({ comment_id, user_id: userId });
        
        const { data: comment } = await supabase
          .from('project_comments')
          .select('like_count')
          .eq('id', comment_id)
          .single();
        
        newLikeCount = (comment?.like_count || 0) + 1;
        
        await supabase
          .from('project_comments')
          .update({ like_count: newLikeCount })
          .eq('id', comment_id);
        
        isLiked = true;
      }
    }

    return NextResponse.json({ success: true, isLiked, likeCount: newLikeCount });
  } catch (error) {
    console.error('点赞操作失败:', error);
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}

// 获取用户已点赞的评论列表
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { projectId } = await params;
    const { searchParams } = new URL(request.url);
    const commentIds = searchParams.get('comment_ids')?.split(',') || [];

    // 获取用户ID
    let userId = 'anonymous';
    const session = request.headers.get('x-session');
    if (session) {
      const { data: { user } } = await supabase.auth.getUser(session);
      if (user) {
        userId = user.id;
      }
    }

    if (commentIds.length === 0) {
      return NextResponse.json({ liked_ids: [] });
    }

    const { data: likes } = await supabase
      .from('project_comment_likes')
      .select('comment_id')
      .eq('user_id', userId)
      .in('comment_id', commentIds.map(Number));

    return NextResponse.json({ liked_ids: likes?.map(l => l.comment_id) || [] });
  } catch (error) {
    console.error('获取点赞状态失败:', error);
    return NextResponse.json({ liked_ids: [] });
  }
}
