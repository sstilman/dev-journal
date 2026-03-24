---
id: giscus-integration
date: 2026-03-22
authors: stilman
tags: [Docusaurus, Giscus, 评论服务, React, SSR]
keywords: [Docusaurus, Giscus, 评论, GitHub Discussions, React Hook, BrowserOnly, 主题切换]
draft: false
---

# Docusaurus 集成 Giscus 评论服务

本文档记录在 Dev Journal 中集成 Giscus 评论服务的完整过程，涵盖初始集成、SSR 兼容性处理、主题适配等所有细节。

<!-- truncate -->

## 概述

Giscus 是一个基于 GitHub Discussions 的评论服务，由 GitHub 官方支持。它允许访客通过 GitHub 账号在网站上发表评论，所有评论数据都存储在 GitHub Discussions 中。

### Giscus 的优势

- **免费开源**：完全免费且源代码开放
- **无需数据库**：评论存储在 GitHub Discussions 中
- **安全可靠**：使用 GitHub OAuth 进行身份验证
- **主题支持**：支持多种主题，与暗色模式无缝集成
- **无追踪**：无广告、无追踪器

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

:::info
不必手动在 Discussions 里先发帖；giscus 会在首次评论时自动创建对应 Discussion。
:::

### 3. 获取配置参数

访问 [https://giscus.app/zh-CN](https://giscus.app/zh-CN)，输入仓库信息后，页面会显示以下必要参数：

| 参数 | 说明 |
|------|------|
| `data-repo` | GitHub 仓库名称 |
| `data-repo-id` | 仓库 ID |
| `data-category` | Discussion 分类名称 |
| `data-category-id` | 分类 ID |

## 项目结构

```
src/
├── components/
│   └── Discuss/
│       └── index.js        # Giscus 评论组件
├── data/
│   └── giscusConfig.js    # Giscus 配置文件
└── css/
    └── custom.css         # 全局样式（含暗色主题适配）
```

## 配置文件

### giscusConfig.js

```javascript
// src/data/giscusConfig.js

export const giscusConfig = {
  repo: '用户名/仓库名',
  repoId: 'R_kgD0XXXXX',
  category: 'Announcements',
  categoryId: 'DIC_kwD0XXXXX',
};

export const giscusThemeConfig = {
  lightTheme: 'light',
  darkTheme: 'dark',
  mapping: 'title',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
  lang: 'zh-CN',
  loading: 'lazy',
};
```

### 配置项说明

| 配置项 | 说明 | 示例值 |
|--------|------|--------|
| `repo` | GitHub 仓库 | `用户名/仓库名` |
| `repoId` | 仓库 ID | `R_kgD0XXXXX` |
| `category` | Discussion 分类 | `Announcements` |
| `categoryId` | 分类 ID | `DIC_kwD0XXXXX` |
| `lightTheme` | 浅色主题 | `light` / `github_light` |
| `darkTheme` | 深色主题 | `dark` / `github_dark` |
| `mapping` | 映射方式 | `title` |
| `inputPosition` | 输入框位置 | `bottom` |

## 评论组件实现

### Discuss 组件核心代码

```javascript
// src/components/Discuss/index.js

import {useState, useEffect, useMemo} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {giscusConfig, giscusThemeConfig} from '@site/src/data/giscusConfig';

function useGiscusConfig() {
  return useMemo(
    () => ({
      ...giscusThemeConfig,
      ...giscusConfig,
    }),
    [],
  );
}

function getDocusaurusColorMode() {
  if (typeof document === 'undefined') {
    return 'light';
  }
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';
}

function GiscusInner() {
  const cfg = useGiscusConfig();
  const [GiscusComponent, setGiscusComponent] = useState(null);
  const [routeKey, setRouteKey] = useState(0);

  useEffect(() => {
    import('@giscus/react').then((mod) => {
      setGiscusComponent(() => mod.default);
    });
  }, []);

  // 监听路由更新
  useEffect(() => {
    if (typeof window.emitter !== 'undefined') {
      const handleRouteUpdate = () => {
        setRouteKey((k) => k + 1);
      };
      window.emitter.on('onRouteDidUpdate', handleRouteUpdate);
      return () => {
        window.emitter.off('onRouteDidUpdate', handleRouteUpdate);
      };
    }
  }, []);

  // 监听主题切换，重新渲染 giscus
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setRouteKey((k) => k + 1);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  if (!cfg.repo || !cfg.repoId || !cfg.categoryId) {
    return (
      <div style={{padding: '20px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px'}}>
        <strong>评论功能未启用</strong>
        <p>请在 <code>src/data/giscusConfig.js</code> 中填写配置。</p>
      </div>
    );
  }

  const isDark = getDocusaurusColorMode() === 'dark';
  const theme = isDark ? cfg.darkTheme : cfg.lightTheme;

  if (!GiscusComponent) {
    return <div className="giscus-loading">正在加载评论...</div>;
  }

  return (
    <div data-giscus-theme={theme} key={routeKey}>
      <GiscusComponent
        id="discuss"
        repo={cfg.repo}
        repoId={cfg.repoId}
        category={cfg.category}
        categoryId={cfg.categoryId}
        mapping={cfg.mapping}
        strict={cfg.strict}
        reactionsEnabled={cfg.reactionsEnabled}
        emitMetadata={cfg.emitMetadata}
        inputPosition={cfg.inputPosition}
        theme={theme}
        lang={cfg.lang}
        loading={cfg.loading}
      />
    </div>
  );
}

export default function Discuss() {
  return (
    <div className="discuss-root margin-top--xl margin-bottom--lg">
      <BrowserOnly fallback={<div className="giscus-loading">正在加载评论...</div>}>
        {() => <GiscusInner />}
      </BrowserOnly>
    </div>
  );
}
```

## SSR 兼容性处理

### 问题描述

博客页面在 SSR 编译时报错：

```
Error: Hook useColorMode is called outside the <ColorModeProvider>
```

### 原因分析

`useColorMode` 等 Docusaurus Hook 必须在 `ColorModeProvider` 内部调用。SSR 期间 Provider 尚未初始化，直接调用会报错。

### 解决方案

使用 Docusaurus 提供的 `BrowserOnly` 组件包裹客户端代码，确保这些代码只在浏览器端执行：

```javascript
export default function Discuss() {
  return (
    <BrowserOnly fallback={<div>加载中...</div>}>
      {() => <GiscusInner />}
    </BrowserOnly>
  );
}
```

关键点：
- `BrowserOnly` 确保内容只在客户端渲染
- `fallback` 属性提供 SSR 期间的加载提示
- 组件内部通过检测 `document` 对象判断环境

## 暗色主题适配

### CSS 样式

```css
/* src/css/custom.css */

/* 加载提示样式 */
.giscus-loading {
  padding: 1rem;
  text-align: center;
  color: var(--ifm-color-content-secondary);
}

/* 暗色主题下让 iframe 使用暗色配色 */
[data-theme='dark'] .discuss-root .giscus-frame {
  color-scheme: dark;
}

/* 暗色主题下讨论区背景（匹配 Docusaurus 暗色主题 #1a1a1b） */
[data-theme='dark'] .discuss-root {
  background-color: #1a1a1b;
  border-radius: var(--ifm-card-border-radius);
}
```

### 主题切换刷新

使用 `MutationObserver` 监听 `data-theme` 属性变化，切换主题时自动重新渲染 giscus：

```javascript
useEffect(() => {
  const observer = new MutationObserver(() => {
    setRouteKey((k) => k + 1);
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}, []);
```

## 路由切换处理

页面路由变化时，需要重新渲染 giscus 以加载对应文章的评论：

```javascript
useEffect(() => {
  if (typeof window.emitter !== 'undefined') {
    const handleRouteUpdate = () => {
      setRouteKey((k) => k + 1);
    };
    window.emitter.on('onRouteDidUpdate', handleRouteUpdate);
    return () => {
      window.emitter.off('onRouteDidUpdate', handleRouteUpdate);
    };
  }
}, []);
```

## 使用说明

### 默认行为

- 所有文档页面和博客文章都会显示评论组件
- 评论会随页面主题自动切换亮色/暗色模式
- 评论内容会与文章标题建立映射关系

### 禁用单页评论

在 front matter 中添加：

```yaml
---
hide_discussion: true
---
```

## 故障排除

### 评论不显示

1. 确认已填写 `repo`、`repoId` 和 `categoryId`
2. 检查 GitHub 仓库是否已开启 Discussions
3. 检查浏览器控制台是否有错误信息

### 路由切换后评论不更新

确保 `BrowserOnly` 组件正确包裹了 giscus 渲染逻辑。

### 主题不切换

确认 CSS 中正确设置了 `color-scheme: dark`，且 giscus 的 `theme` 属性随 `data-theme` 变化。

## 相关资源

- [Giscus 官网](https://giscus.app/zh-CN)
- [Giscus React 组件](https://github.com/giscus/giscus-component)
- [Docusaurus BrowserOnly 文档](https://docusaurus.io/docs/docusaurus-core#browseronly)
- [Docusaurus 官方文档](https://docusaurus.io/docs)
