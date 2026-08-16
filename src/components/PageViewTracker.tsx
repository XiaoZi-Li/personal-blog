'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch('/api/page-views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page: pathname || '/' }),
        });
      } catch (error) {
        // 静默失败，不影响用户体验
        console.error('Failed to track page view:', error);
      }
    };

    // 延迟记录，避免阻塞页面加载
    const timer = setTimeout(trackPageView, 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
