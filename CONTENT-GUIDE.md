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

## 二、替换简历 PDF 文件

把新 PDF 重命名为 `resume.pdf`，覆盖 `public/resume.pdf`，提交推送即可。网站"下载简历 PDF"按钮下载的就是它。

## 三、改首页内容（自我介绍、竞赛卡、项目卡）

**文件：`src/contexts/LanguageContext.tsx`**（这是全站文案中心，三份语言包从上到下依次是 zh-CN / en-US / ja-JP，**改一处记得三份同步**）

- **竞赛卡片** → 搜 `competitions:`，三张卡是 `comp1`（最新）、`comp2`、`comp0`
- **项目卡片** → 搜 `project1` / `project2` / `project3`
- **首页自我介绍、求职描述** → 搜 `about:` 或 `career:`
- **技术热情卡片** → 搜 `passions`
- **获奖统计数字**（国家级 x2 / 总计 3）→ 搜 `stats`（在 `src/app/page.tsx` 里，第 200 行附近）

## 四、管理数据库数据（留言、用户、浏览量）

不碰代码，直接在 **Supabase 后台**操作（supabase.com → 你的项目）：

- 留言 → Table Editor → `wall_messages`（is_pinned 置顶、is_public 公开、直接删行）
- 用户 → `users`
- 浏览统计 → `page_views`（可按 page 字段筛选看各页面访问量）

网站后台 `/admin` 也能做日常管理（删评论、看数据）。

## 五、翻译覆盖现状

- 已支持三语切换：首页、简历、项目、留言、登录注册
- **暂未接入翻译**（固定中文）：`/admin` 后台、`/settings` 设置、`/notifications` 通知、`/robotics`——这几个是自用页面，如需翻译让 AI 补即可

## 六、出问题时

- 本地预览：项目目录跑 `pnpm dev` → 浏览器开 http://localhost:3000
- 构建失败就看 Vercel → Deployments → 点最新记录看日志，报错贴给 AI
- Supabase 一周没人访问会休眠，每周打开一次自己的网站即可保活
