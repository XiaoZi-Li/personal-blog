# 网站内容自助修改指南

改完代码后用 **GitHub Desktop**（打开本文件夹）→ 写个提交信息 → Commit → Push，Vercel 会在 2~3 分钟后自动上线。

> 所有文案只改**引号里的中文内容**，不要动引号外的 key 名（如 `title:`）和标点。

---

## 一、改简历页内容（获奖、项目、技能、自我评价）

**文件：`src/app/resume/page.tsx`**（文件前 270 行全是数据，往下才是页面样式，不用碰）

数据按语言分三段，**三段都要改**才不会中英日不一致：

| 语言 | 位置特征 |
|---|---|
| 英文 | `case 'en-US':` 开头的块 |
| 日文 | `case 'ja-JP':` 开头的块 |
| 中文 | `default: // cn` 开头的块 |

常用修改点（在每段里搜索这些字段名）：

- **获奖情况** → 搜 `awards: [`，每行一条 `{ award: '...', date: '...', emoji: '🥉' }`，增删行即可
- **项目经历** → 搜 `practices: [`，每条有 `title / role / period / desc`
- **技能栈** → 搜 `techCategories: [`，四组技能各一行
- **求职意向** → 搜 `intent: {`
- **自我评价** → 搜 `selfEval:`
- **教育经历** → 搜 `education: {`

## 二、发布学习教程 / 博客文章 / 日记（不用碰代码）

**入口：网站导航栏 → 登录管理员账号 → 头像菜单 → 管理后台 → 「内容管理」标签页**

- 点「新建内容」选择类型：**教程**（需选分区：51 单片机 / STM32 / ESP32 / DCDC 电源 + 难度）、**文章**、**日记**（可放心情和天气）
- 正文用 **Markdown** 语法写，支持标题、列表、代码块（带复制按钮）、表格、图片链接、引用；编辑器右上角可切换「预览」实时看排版
- 可以勾选「立即发布」，或取消勾选先存草稿，之后再发布
- 列表页支持：置顶（Pin）、下架/发布（眼睛图标）、编辑（铅笔）、删除
- 首次使用前需在 Supabase → SQL Editor 执行一次 `supabase-migrate-add-posts.sql`（建 posts 和 post_likes 两张表）

## 三、改首页内容（自我介绍、竞赛卡、项目卡）

**文件：`src/contexts/LanguageContext.tsx`**（这是全站文案中心，三份语言包从上到下依次是 zh-CN / en-US / ja-JP，**改一处记得三份同步**）

- **竞赛卡片** → 搜 `competitions:`，三张卡是 `comp1`（最新）、`comp2`、`comp0`
- **首页自我介绍、求职描述** → 搜 `about:` 或 `career:`
- **技术热情卡片** → 搜 `passions`
- **核心优势统计**（国家级 x2 / 总计 3 / 职业认证 1）→ `src/app/page.tsx` 第 200 行附近
- **项目详情页**（/projects/xxx）→ `src/app/projects/[id]/page.tsx` 顶部的 `projectsData`，加新项目就加一个条目

## 四、管理数据库数据（留言、用户、浏览量）

不碰代码，直接在 **Supabase 后台**操作（supabase.com → 你的项目）：

- 留言 → Table Editor → `wall_messages`（is_pinned 置顶、is_public 公开、直接删行）
- 用户 → `users`
- 浏览统计 → `page_views`（可按 page 字段筛选看各页面访问量）

网站后台 `/admin` 也能做日常管理（删评论、看数据）。

## 五、翻译覆盖现状

- 已支持三语切换：首页、简历、项目、留言、登录注册、学习专区、博客
- **暂未接入翻译**（固定中文）：`/admin` 后台、`/settings` 设置、`/notifications` 通知、`/robotics`——这几个是自用页面，如需翻译让 AI 补即可

## 六、出问题时

- 本地预览：项目目录跑 `pnpm dev` → 浏览器开 http://localhost:3000
- 构建失败就看 Vercel → Deployments → 点最新记录看日志，报错贴给 AI
- **网站打开正常但留言板转圈/报错** → 多半是 Supabase 免费项目暂停了：去 supabase.com → 你的项目 → 点 "Restore project" 恢复（暂停后定时任务也叫不醒，必须手动恢复一次）
- GitHub 每天会自动跑 Keep Alive 定时任务保活 Supabase（`.github/workflows/keep-alive.yml`），失败时会发邮件，按邮件里的提示处理即可
- Supabase 一周没人访问会休眠，每周打开一次自己的网站即可保活
