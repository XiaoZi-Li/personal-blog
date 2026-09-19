'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * RouteFade —— 切页时给 `main` 挂一次入场动画。
 *
 * 不包一层 div、不用 key 强制重建子树：那样会把整棵页面树卸载再挂载，
 * 对 Supabase 数据拉取和滚动位置都是负收益。这里只是给 `main` 换一个类名，
 * 动画本身（route-enter）定义在 globals.css。
 *
 * 「减少动效」偏好由 globals.css 的全局规则统一压掉，这里不重复判断。
 */
export default function RouteFade() {
  const pathname = usePathname();

  useEffect(() => {
    const el = document.querySelector('main');
    if (!el) return;

    // 同名动画要重播：先摘掉类名并强制重排，再挂回去
    el.classList.remove('route-enter');
    void el.getBoundingClientRect();
    el.classList.add('route-enter');
  }, [pathname]);

  return null;
}
