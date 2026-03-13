# Vercel 部署指南

## 方法一：GitHub 网页直接创建文件

### 1. 访问仓库
https://github.com/XiaoZi-Li/personal-blog

### 2. 依次创建以下文件

按顺序点击 "Add file" → "Create new file"，创建以下文件：

#### 必需文件列表：

1. `package.json` - 项目配置
2. `.coze` - 部署配置  
3. `next.config.ts` - Next.js 配置
4. `tsconfig.json` - TypeScript 配置
5. `postcss.config.mjs` - PostCSS 配置
6. `src/app/layout.tsx` - 页面布局
7. `src/app/page.tsx` - 首页
8. `src/app/globals.css` - 全局样式
9. `src/components/Navigation.tsx` - 导航组件

### 3. 部署到 Vercel

1. 访问 https://vercel.com
2. 使用 GitHub 登录
3. 导入仓库 XiaoZi-Li/personal-blog
4. 点击 Deploy

### 4. 绑定域名

1. Vercel 项目设置 → Domains
2. 添加 zenithfall.top 和 www.zenithfall.top
3. 在域名服务商添加 DNS 解析：
   - 类型: CNAME
   - 主机记录: @
   - 记录值: cname.vercel-dns.com

---

## 方法二：使用 GitHub Desktop

1. 下载 GitHub Desktop: https://desktop.github.com
2. 登录 GitHub 账号
3. Clone 仓库 XiaoZi-Li/personal-blog
4. 复制文件到本地
5. Commit 并 Push

---

## 方法三：使用 Gitee 镜像

1. 访问 https://gitee.com
2. 导入 GitHub 仓库
3. 从 Gitee 克隆（国内速度快）
