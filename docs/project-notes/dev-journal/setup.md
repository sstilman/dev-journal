---
description: Dev Journal 基础搭建与框架整理记录
draft: false
---

# Dev Journal 基础搭建与框架整理

## 背景

作为嵌入式开发工程师，日常积累的技术笔记、项目经验常常散落在各个角落。这次决定使用 Docusaurus 重新搭建个人技术博客系统，将零散的知识系统化管理，形成可追溯、可分享的技术资产库。

## 项目初始化

项目基于 Docusaurus Classic 模板创建，采用了以下技术栈：

- **Docusaurus 3.x** - 现代化的静态站点生成器
- **React** - 用于主题定制和组件开发
- **MDX** - 支持在 Markdown 中嵌入 React 组件

### 站点基础配置

```javascript
// docusaurus.config.js
const config = {
  title: "Dev Journal",
  tagline: 'Embedded Development Notes | 以码为笔，记深耕之路',
  url: 'https://stilman.space',
  baseUrl: '/',
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
  },
  // ...
};
```

## 内容架构设计

根据实际需求，将文档划分为三大板块：

### 1. 项目札记 (docs)

用于记录具体项目的开发过程、技术调研和问题解决思路：

```
docs/
├── project-notes/
│   ├── intro.md
│   └── stm32mp1/
│       ├── intro.md
│       └── kernel/
│           └── kernel-compile.md
├── tech-notes/
│   └── linux-basics/
│       └── command-line.md
└── resources/
    └── intro.md
```

### 2. 教程专栏 (tutorials)

独立的文档实例，用于系统性教程内容：

```javascript
plugins: [
  [
    '@docusaurus/plugin-content-docs',
    {
      id: 'tutorials',
      path: 'tutorials',
      routeBasePath: 'tutorials',
      sidebarPath: './sidebarstutorials.js',
    },
  ],
],
```

### 3. 博客 (blog)

用于发布技术随笔、项目记录和学习心得。

## 导航栏配置

采用左侧导航结构，将主要入口集中展示：

```javascript
navbar: {
  items: [
    {
      type: 'docSidebar',
      sidebarId: 'docSidebar',
      position: 'left',
      label: '项目札记',
    },
    {
      type: 'docSidebar',
      sidebarId: 'tutorialsSidebar',
      docsPluginId: 'tutorials',
      position: 'left',
      label: '教程专栏',
    },
    {to: '/blog', label: '博客', position: 'left'},
  ],
},
```

## 侧边栏定制

### 项目札记侧边栏

```javascript
const sidebarsprojects = {
  docSidebar: [
    {
      type: 'category',
      label: '项目札记',
      link: { type: 'doc', id: 'project-notes/intro' },
      items: [
        {
          type: 'category',
          label: 'STM32MP1',
          link: { type: 'doc', id: 'project-notes/stm32mp1/intro' },
          items: ['project-notes/stm32mp1/kernel/kernel-compile']
        }
      ]
    },
    // ...
  ]
};
```

### 教程专栏侧边栏

```javascript
const sidebarstutorials = {
  tutorialsSidebar: [
    {
      type: 'category',
      label: '教程专栏',
      link: { type: 'doc', id: 'intro' },
      items: [
        {
          type: 'category',
          label: 'Linux',
          link: { type: 'doc', id: 'linux/intro' },
          items: []
        }
      ]
    }
  ]
};
```

## 清理与优化

将 Docusaurus 默认的 tutorial 模板内容全部移除，替换为符合嵌入式开发主题的结构。同时禁用了 `editUrl`，避免暴露示例仓库地址。

## 后续计划

### 功能增强
- 完成首页定制，打造更具个人风格的技术展示页面
- 完善页脚区域，添加必要的导航链接和社交入口
- **评论系统** - 集成 GitHub Issues 或 Giscus，实现文档级评论功能
- **全局搜索** - 配置 Algolia DocSearch 或本地搜索，提升内容发现效率

### 内容建设
- 持续输出 STM32MP1 系列开发笔记
- 建立 Linux 驱动开发知识体系
- 补充嵌入式工具链使用指南

### 运维优化
- 配置 CI/CD 自动化部署流程
- 实现定时备份与版本管理

---

*持续更新中，以码为笔，记深耕之路。*
