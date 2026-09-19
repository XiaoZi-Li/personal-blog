import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import Providers from '@/components/Providers';
import AuroraField from '@/components/tech/AuroraField';
import CursorAura from '@/components/tech/CursorAura';
import ScrollProgress from '@/components/tech/ScrollProgress';
import RouteFade from '@/components/tech/RouteFade';
import BackToTop from '@/components/tech/BackToTop';

export const metadata: Metadata = {
  title: {
    default: '李俊杰 | 个人博客 - 嵌入式开发工程师',
    template: '%s | 李俊杰',
  },
  description:
    '天津工业大学电子信息工程专业大四学生李俊杰，专注于端侧 AI 部署、嵌入式开发与具身智能。拥有多项国家级/省级竞赛获奖经历。',
  keywords: [
    '李俊杰',
    'XiaoZi-Li',
    '天津工业大学',
    '电子信息工程',
    '嵌入式开发',
    '具身智能',
    '端侧 AI 部署',
    'ESP32',
    'MCP',
    'FPGA',
  ],
  authors: [{ name: '李俊杰', url: 'https://github.com/XiaoZi-Li' }],
  openGraph: {
    title: '李俊杰 | 嵌入式开发工程师 - 具身智能技术',
    description:
      '电子信息工程专业大四学生，聚焦端侧 AI 部署与具身智能交叉领域，具备"硬件-软件-算法"的综合技术视角。获得多项国家级竞赛奖项。',
    type: 'website',
    url: process.env.COZE_PROJECT_DOMAIN_DEFAULT 
      ? `https://${process.env.COZE_PROJECT_DOMAIN_DEFAULT}` 
      : 'https://zenithfall.top',
    siteName: '李俊杰的个人博客',
    images: [
      {
        url: process.env.COZE_PROJECT_DOMAIN_DEFAULT 
          ? `https://${process.env.COZE_PROJECT_DOMAIN_DEFAULT}/og-image.jpg`
          : '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '李俊杰 - 嵌入式开发工程师',
      },
    ],
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '李俊杰 | 嵌入式开发工程师',
    description:
      '电子信息工程专业大四学生，聚焦端侧 AI 部署与具身智能交叉领域',
    images: process.env.COZE_PROJECT_DOMAIN_DEFAULT 
      ? [`https://${process.env.COZE_PROJECT_DOMAIN_DEFAULT}/og-image.jpg`]
      : ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://zenithfall.top'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`antialiased`}>
        {/* 滚动渐显的「失败要开」开关：只有这个脚本跑起来，.reveal 才会先隐藏。
            JS 被禁用或脚本报错时 html 上没有 .js，所有内容默认可见。 */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <Providers>
          {isDev && <Inspector />}
          <AuroraField />
          <CursorAura />
          <ScrollProgress />
          <RouteFade />
          <Navigation />
          <main className="relative z-10 min-h-screen pt-20">
            {children}
          </main>
          <Footer />
          <BackToTop />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
