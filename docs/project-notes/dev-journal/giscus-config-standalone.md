---
id: giscus-config-standalone
date: 2026-03-22
authors: stilman
tags: [Docusaurus, Giscus, 配置文件]
keywords: [Giscus, 配置, themeConfig]
draft: false
---

# Giscus 配置独立文件化

本文档记录将 Giscus 配置从内联方式改为独立配置文件的维护过程。

<!-- truncate -->

## 背景

在初始集成 Giscus 时，配置是直接写在 `docusaurus.config.js` 的 `themeConfig.giscus` 中的。随着配置项增多，为了便于管理和维护，决定将配置独立到单独的文件中。

## 实现方案

### 文件结构

```
src/data/
└── giscusConfig.js      # Giscus 配置（新建）
```

### 配置文件内容

```javascript
/**
 * Giscus 评论服务配置
 */
export const giscusConfig = {
  repo: 'sstilman/dev-journal',
  repoId: 'R_kgDORtXURw',
  category: 'Announcements',
  categoryId: 'DIC_kwDORtXURw',
};

export const giscusThemeConfig = {
  lightTheme: 'light',
  darkTheme: 'dark_dimmed',
  mapping: 'title',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
  lang: 'zh-CN',
  loading: 'lazy',
};
```

### Docusaurus 配置导入

在 `docusaurus.config.js` 中导入并使用：

```javascript
import {themes as prismThemes} from 'prism-react-renderer';
import {giscusConfig, giscusThemeConfig} from './src/data/giscusConfig.js';

const config = {
  // ...
  themeConfig: {
    giscus: {
      ...giscusConfig,
      ...giscusThemeConfig,
    },
  },
};
```

## 配置项说明

| 配置项 | 说明 | 示例值 |
|--------|------|--------|
| `repo` | GitHub 仓库 | `用户名/仓库名` |
| `repoId` | 仓库 ID | `R_kgD0XXXXX` |
| `category` | Discussion 分类 | `Announcements` |
| `categoryId` | 分类 ID | `DIC_kwD0XXXXX` |
| `lightTheme` | 浅色主题 | `light` |
| `darkTheme` | 深色主题 | `dark_dimmed` |
| `mapping` | 映射方式 | `title` |
| `inputPosition` | 输入框位置 | `bottom` |

## 相关文件

- `src/data/giscusConfig.js` - Giscus 配置文件
- `docusaurus.config.js` - Docusaurus 主配置
