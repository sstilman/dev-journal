---
id: giscus-integration
date: 2026-03-22
authors: stilman
tags: [Docusaurus, Giscus, 评论服务]
keywords: [Docusaurus, Giscus, 评论, GitHub Discussions]
draft: false
---

# Docusaurus 集成 Giscus 评论服务

本文档记录了在 Dev Journal 中集成 Giscus 评论服务的完整过程。

<!-- truncate -->

## 概述

Giscus 是一个基于 GitHub Discussions 的评论服务，由 GitHub 官方支持。它允许访客通过 GitHub 账号在您的网站上发表评论和反应，所有评论数据都存储在 GitHub Discussions 中。

### Giscus 的优势

- **免费开源**: 完全免费且源代码开放
- **无需数据库**: 评论存储在 GitHub Discussions 中
- **安全可靠**: 使用 GitHub OAuth 进行身份验证
- **主题支持**: 支持多种主题，与暗色模式无缝集成
- **无追踪**: 无广告、无追踪器

## 前置准备

### 1. 安装 Giscus GitHub App

1. 进入 GitHub 首页 `Settings` → `Integrations` → `Application`
2. 点击 `Authorized GitHub Apps`
3. 在搜索栏中搜索 `giscus`
4. 根据提示完成安装
5. 选择要开启讨论的仓库

### 2. 开启仓库 Discussions

1. 在仓库页面点击 `Settings`
2. 向下滚动到 `Features` 部分
3. 勾选 `Discussions` 开启讨论功能

### 3. 获取配置参数

访问 [https://giscus.app/zh-CN](https://giscus.app/zh-CN)，输入您的仓库信息：

| 参数 | 说明 | 示例 |
|------|------|------|
| 仓库 | GitHub 仓库名称 | `用户名/仓库名` |
| 映射关系 | 评论与文章的映射方式 | `title` |
| Discussion 分类 | 创建 Discussion 的分类 | `Announcements` |

配置完成后，页面会显示以下必要参数：
- `data-repo`
- `data-repo-id`
- `data-category`
- `data-category-id`

## 项目集成

### 文件结构

```
src/
├── components/
│   └── Discuss/
│       └── index.js        # Giscus 评论组件
├── data/
│   └── giscusConfig.js      # Giscus 配置文件
├── clientModules/
│   └── routeModules.js     # 路由更新事件处理
└── theme/
    ├── DocItem/
    │   └── Layout/          # 文档页面布局（已 swizzle）
    └── BlogPostPage/
        └── index.js         # 博客页面（已 swizzle）
```

### 配置文件

编辑 `src/data/giscusConfig.js`：

```javascript
export const giscusConfig = {
  repo: '用户名/仓库名',
  repoId: 'R_kgD0XXXXX',
  category: 'Announcements',
  categoryId: 'DIC_kwD0XXXXX',
};
```

### Docusaurus 配置

编辑 `docusaurus.config.js`，取消注释并填写 giscus 配置：

```javascript
themeConfig: {
  giscus: {
    repo: '用户名/仓库名',
    repoId: 'R_kgD0XXXXX',
    category: 'Announcements',
    categoryId: 'DIC_kwD0XXXXX',
    theme: 'light',
    darkTheme: 'dark_dimmed',
  },
},
```

## 使用说明

### 默认行为

- 所有文档页面和博客文章都会显示评论组件
- 评论会随页面主题自动切换亮色/暗色模式
- 评论内容会与文章标题建立映射关系

### 禁用单页评论

如需在特定页面禁用评论，在 front matter 中添加：

```yaml
---
hide_discussion: true
---
```

### 获取配置 ID

除了使用 giscus.app 页面，还可以通过 GitHub GraphQL API 获取：

```graphql
{
  repository(owner: "用户名", name: "仓库名") {
    id
    discussionCategories(first: 5) {
      nodes {
        name
        id
      }
    }
  }
}
```

访问 [GitHub GraphQL API Explorer](https://docs.github.com/en/graphql/overview/explorer) 运行此查询。

## 故障排除

### 评论不显示

1. 确认已填写 `repo`、`repoId` 和 `categoryId`
2. 检查 GitHub 仓库是否已开启 Discussions
3. 检查浏览器控制台是否有错误信息

### 路由切换后评论不更新

项目已配置 `routeModules.js` 处理此问题。如仍有问题，请检查：
- 是否正确加载了 `clientModules`
- `mitt` 依赖是否正确安装

### 主题不切换

确保在 `giscusConfig.js` 中正确配置了 `lightTheme` 和 `darkTheme`。

## 相关资源

- [Giscus 官网](https://giscus.app/zh-CN)
- [Giscus React 组件](https://github.com/giscus/giscus-component)
- [Docusaurus 官方文档](https://docusaurus.io/docs)
- [GitHub GraphQL API](https://docs.github.com/en/graphql)
