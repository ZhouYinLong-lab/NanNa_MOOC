<p align="center">
  <img src="public/logo.png" alt="南哪MOOC Logo" width="128" />
</p>

<h1 align="center">南哪MOOC</h1>

<p align="center">
  <strong>南京大学一站式开放学习平台</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vuedotjs&logoColor=white" alt="Vue" />
  <img src="https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.2-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Pinia-2.1-FFD859?logo=vuedotjs&logoColor=black" alt="Pinia" />
  <img src="https://img.shields.io/badge/Vue_Router-4.3-4FC08D?logo=vuedotjs&logoColor=white" alt="Vue Router" />
</p>

---

## 📖 项目简介

南哪MOOC 是面向南京大学师生的在线学习管理系统（LMS），支持课程创建、内容管理、在线讨论、题库练习、学习进度追踪等核心教学场景。系统提供四种角色：**管理员**、**教师/助教**、**学生** 和 **游客**，覆盖教学全流程。

### ✨ 核心特性

- 🏠 **课程管理** — 创建课程、编辑目录树、上传多媒体教学内容（Markdown / 视频 / 音频 / 图片）
- 💬 **课程讨论** — 课程级讨论区，支持发帖、回帖、点赞
- 📝 **题库练习** — 在线刷题、自动判分、错题本
- 📊 **进度追踪** — 学生学习进度可视化，教师端学生数据看板
- 🔐 **角色权限** — 管理员 / 教师 / 助教 / 学生 / 游客，五类角色，不同权限
- 🎓 **游客模式** — 无需登录即可浏览公开课程内容
- 📐 **数学公式** — 基于 KaTeX 的数学公式渲染
- 🎨 **Markdown 渲染** — 基于 markdown-it + highlight.js 的富文本内容展示

---

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API + `<script setup>`) |
| 语言 | TypeScript |
| 构建 | Vite 5 |
| 状态管理 | Pinia |
| 路由 | Vue Router 4 |
| HTTP | Axios |
| Markdown | markdown-it + highlight.js |
| 数学公式 | KaTeX |
| 样式 | 纯 CSS (CSS Variables + Utility Classes) |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9（或 pnpm / yarn）

### 安装与运行

```bash
# 克隆仓库
git clone <repo-url>
cd NanNa_MOOC

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

开发服务器默认运行在 `http://localhost:3000`，API 请求将代理至 `http://localhost:8080`。

### 构建生产版本

```bash
npm run build     # 类型检查 + 构建
npm run preview   # 预览生产构建
```

---

## 📁 项目结构

```
NanNa_MOOC/
├── public/
│   └── logo.png                # 站点 Logo
├── src/
│   ├── api/                    # API 请求层 (Axios)
│   │   ├── request.ts          # 请求实例 & 拦截器
│   │   ├── auth.ts             # 认证 API
│   │   ├── course.ts           # 课程 API
│   │   ├── content.ts          # 内容 API
│   │   ├── discussion.ts       # 讨论 API
│   │   ├── media.ts            # 媒体 API
│   │   ├── progress.ts         # 进度 API
│   │   └── user.ts             # 用户 API
│   ├── assets/
│   │   └── global.css          # 全局样式 & CSS 变量
│   ├── components/
│   │   ├── common/             # 通用组件 (Pagination, LoadingSpinner, etc.)
│   │   ├── course/             # 课程组件 (目录树, 内容渲染, 编辑器)
│   │   ├── discussion/         # 讨论组件 (帖子列表, 编辑器)
│   │   ├── layout/             # 布局组件 (AppLayout, AppNavbar)
│   │   └── media/              # 媒体组件 (视频/音频播放器, 图片查看器)
│   ├── composables/            # 组合式函数 (useAuth, usePermission, etc.)
│   ├── router/                 # Vue Router 配置
│   ├── stores/                 # Pinia 状态管理
│   ├── types/                  # TypeScript 类型定义
│   └── views/                  # 页面视图
│       ├── admin/              # 管理后台
│       ├── auth/               # 登录页
│       ├── course/             # 课程页
│       ├── discussion/         # 讨论页
│       ├── home/               # 首页
│       ├── profile/            # 个人设置
│       ├── student/            # 学生端
│       └── teacher/            # 教师端
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🏗 系统设计

本项目的完整前端设计方案由 **[Dog-Frontier](https://github.com/ZhouYinLong-lab/Dog-Skills/tree/main/dog-frontier)** 技能系统生成。

Dog-Frontier 是一个前端设计综合技能系统，通过多轮对话精确理解需求，整合 18 个专业前端技能的精华，输出高质量、高结构化的前端设计方案与代码。覆盖 UI/UX 设计系统、Tailwind/shadcn 组件库、Vue/React 技术栈、CSS 高级技巧、落地页生成、品牌设计、设计令牌等全链路。

本项目从需求分析、信息架构、页面路由设计、组件树拆分、数据流设计到完整的代码实现，均由 Dog-Frontier 编排驱动完成。

---

## 📄 License

MIT

---

<p align="center">
  <sub>Built with ❤️ using <a href="https://github.com/ZhouYinLong-lab/Dog-Skills/tree/main/dog-frontier">Dog-Frontier</a></sub>
</p>
