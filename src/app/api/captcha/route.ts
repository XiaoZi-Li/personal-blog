import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 生成验证码
export async function GET() {
  // 生成简单的数学验证码
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  const operators = ['+', '-', '×'];
  const operatorIndex = Math.floor(Math.random() * operators.length);
  const operator = operators[operatorIndex];

  let answer: number;
  let question: string;

  switch (operator) {
    case '+':
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
      break;
    case '-':
      // 确保结果为正数
      const [a, b] = num1 >= num2 ? [num1, num2] : [num2, num1];
      answer = a - b;
      question = `${a} - ${b} = ?`;
      break;
    case '×':
      // 限制乘法范围
      const m1 = Math.min(num1, 5);
      const m2 = Math.min(num2, 5);
      answer = m1 * m2;
      question = `${m1} × ${m2} = ?`;
      break;
    default:
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
  }

  // 生成验证码token（包含答案）
  const token = await new SignJWT({ answer, timestamp: Date.now() })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('5m')
    .sign(new TextEncoder().encode(JWT_SECRET));

  const response = NextResponse.json({
    question,
    captchaId: token,
  });

  // 设置验证码token到cookie
  response.cookies.set('captcha_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 300, // 5分钟
    path: '/',
  });

  return response;
}

// 验证验证码
export async function POST(request: Request) {
  try {
    const { answer } = await request.json();
    const cookieHeader = request.headers.get('cookie');
    const cookies = new URLSearchParams(cookieHeader?.replace(/; /g, '&') || '');
    const token = cookies.get('captcha_token');

    if (!token) {
      return NextResponse.json({ valid: false, error: '验证码已过期' });
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      const storedAnswer = payload.answer as number;

      if (parseInt(answer) === storedAnswer) {
        return NextResponse.json({ valid: true });
      } else {
        return NextResponse.json({ valid: false, error: '验证码错误' });
      }
    } catch {
      return NextResponse.json({ valid: false, error: '验证码已过期' });
    }
  } catch {
    return NextResponse.json({ valid: false, error: '验证失败' });
  }
}
