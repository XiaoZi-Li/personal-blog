import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 获取留言列表
export async function GET(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 获取公开留言，按置顶和时间排序
    const { data: messages, error } = await client
      .from('wall_messages')
      .select('id, user_id, nickname, content, is_public, parent_id, reply_to_user_id, reply_to_nickname, is_admin_reply, is_pinned, like_count, created_at, updated_at')
      .eq('is_public', true)
      .is('parent_id', null)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('获取留言失败:', error);
      return NextResponse.json({ error: '获取留言失败' }, { status: 500 });
    }

    // 获取所有回复（包括嵌套回复）
    const messageIds = messages?.map(m => m.id) || [];
    let allReplies: any[] = [];
    if (messageIds.length > 0) {
      const { data: repliesData } = await client
        .from('wall_messages')
        .select('id, user_id, nickname, content, parent_id, reply_to_user_id, reply_to_nickname, is_admin_reply, created_at')
        .not('parent_id', 'is', null)
        .order('created_at', { ascending: true });
      allReplies = repliesData || [];
    }

    // 获取总数
    const { count } = await client
      .from('wall_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_public', true)
      .is('parent_id', null);

    return NextResponse.json({ 
      messages: messages || [],
      replies: allReplies,
      total: count || 0,
      page,
      limit
    });
  } catch (error) {
    console.error('获取留言错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 发表留言
export async function POST(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    const { content, nickname, parent_id, reply_to_user_id, reply_to_nickname } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: '留言内容不能为空' }, { status: 400 });
    }

    if (content.length > 500) {
      return NextResponse.json({ error: '留言内容不能超过500字' }, { status: 400 });
    }

    let userId = null;
    let userNickname = nickname || '匿名用户';
    let isAdminReply = false;

    // 检查是否登录
    const token = request.cookies.get('auth_token')?.value;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        userId = payload.userId;
        
        // 获取用户信息
        const { data: user } = await client
          .from('users')
          .select('nickname, role')
          .eq('id', userId)
          .single();
        
        if (user) {
          userNickname = user.nickname || userNickname;
          isAdminReply = user.role === 'admin';
        }
      } catch {
        // token 无效，使用匿名身份
      }
    }

    // 如果是回复，需要找到根留言的 parent_id
    let actualParentId = parent_id || null;
    
    if (parent_id) {
      // 检查 parent_id 是否是一条回复，如果是，则使用它的 parent_id（保持扁平化）
      const { data: parentMessage } = await client
        .from('wall_messages')
        .select('id, parent_id, user_id, nickname')
        .eq('id', parent_id)
        .single();
      
      if (parentMessage) {
        // 如果回复的是一条回复，则将 parent_id 设置为该回复的 parent_id（即根留言）
        // 这样所有回复都在根留言下，形成扁平结构，但通过 reply_to_* 字段记录实际回复目标
        if (parentMessage.parent_id) {
          actualParentId = parentMessage.parent_id;
        }
      }
    }

    const { data: message, error } = await client
      .from('wall_messages')
      .insert({
        user_id: userId,
        nickname: userNickname,
        content: content.trim(),
        is_public: true,
        parent_id: actualParentId,
        reply_to_user_id: reply_to_user_id || null,
        reply_to_nickname: reply_to_nickname || null,
        is_admin_reply: isAdminReply,
      })
      .select()
      .single();

    if (error) {
      console.error('发表留言失败:', error);
      return NextResponse.json({ error: '发表留言失败' }, { status: 500 });
    }

    // 发送通知
    if (reply_to_user_id && reply_to_user_id !== userId) {
      // 回复的是某条回复，给被回复的用户发送通知
      await client
        .from('notifications')
        .insert({
          user_id: reply_to_user_id,
          type: 'reply',
          title: `${userNickname} 回复了你的评论`,
          content: content.trim().substring(0, 100) + (content.length > 100 ? '...' : ''),
          related_id: message.id,
        });
    } else if (parent_id && message) {
      // 回复的是根留言，给根留言作者发送通知
      const { data: parentMessage } = await client
        .from('wall_messages')
        .select('user_id')
        .eq('id', parent_id)
        .single();

      if (parentMessage?.user_id && parentMessage.user_id !== userId) {
        await client
          .from('notifications')
          .insert({
            user_id: parentMessage.user_id,
            type: 'reply',
            title: `${userNickname} 回复了你的留言`,
            content: content.trim().substring(0, 100) + (content.length > 100 ? '...' : ''),
            related_id: message.id,
          });
      }
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error('发表留言错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
