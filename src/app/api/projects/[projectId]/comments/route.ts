import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 获取项目评论
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { projectId } = await params;

    // 获取评论
    const { data: comments, error: commentsError } = await supabase
      .from('project_comments')
      .select('*')
      .eq('project_id', projectId)
      .is('parent_id', null)
      .order('created_at', { ascending: false });

    if (commentsError) throw commentsError;

    // 获取回复
    const { data: replies, error: repliesError } = await supabase
      .from('project_comments')
      .select('*')
      .eq('project_id', projectId)
      .not('parent_id', 'is', null)
      .order('created_at', { ascending: true });

    if (repliesError) throw repliesError;

    return NextResponse.json({ 
      comments: comments || [], 
      replies: replies || [] 
    });
  } catch (error) {
    console.error('获取项目评论失败:', error);
    return NextResponse.json({ error: '获取评论失败' }, { status: 500 });
  }
}

// 发布评论或回复
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { projectId } = await params;
    const body = await request.json();
    const { content, parent_id, reply_to_user_id, reply_to_nickname } = body;

    // 获取用户信息 - 使用 JWT cookie 认证
    let userId = null;
    let nickname = '匿名用户';
    let isAdmin = false;

    const token = request.cookies.get('auth_token')?.value;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        userId = payload.userId as string;
        
        // 获取用户信息
        const { data: userData } = await supabase
          .from('users')
          .select('nickname, username, role')
          .eq('id', userId)
          .single();
        
        if (userData) {
          nickname = userData.nickname || userData.username || '用户';
          isAdmin = userData.role === 'admin';
        }
      } catch {
        // token 无效，使用匿名身份
      }
    }

    const commentData: Record<string, unknown> = {
      project_id: projectId,
      user_id: userId,
      nickname,
      content,
      parent_id: parent_id || null,
      reply_to_user_id: reply_to_user_id || null,
      reply_to_nickname: reply_to_nickname || null,
      is_admin_reply: parent_id && isAdmin ? true : false,
    };

    const { error } = await supabase
      .from('project_comments')
      .insert(commentData);

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('发布项目评论失败:', error);
    return NextResponse.json({ 
      error: '发布失败', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
