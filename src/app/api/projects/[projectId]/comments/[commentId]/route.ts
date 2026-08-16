import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function verifyAdmin(request: NextRequest): Promise<{ userId: number; isAdmin: boolean } | null> {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    if (!payload.userId || !payload.isAdmin) return null;
    
    return { userId: payload.userId as number, isAdmin: payload.isAdmin as boolean };
  } catch {
    return null;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; commentId: string }> }
) {
  try {
    // 验证管理员权限
    const admin = await verifyAdmin(request);
    if (!admin || !admin.isAdmin) {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const { commentId } = await params;
    const supabase = getSupabaseClient();

    // 删除评论（级联删除子评论和点赞记录）
    const { error } = await supabase
      .from('project_comments')
      .delete()
      .eq('id', parseInt(commentId));

    if (error) {
      console.error('删除评论失败:', error);
      return NextResponse.json({ error: '删除失败' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除评论异常:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
