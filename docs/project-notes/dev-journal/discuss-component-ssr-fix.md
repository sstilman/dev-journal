---
id: discuss-component-ssr-fix
date: 2026-03-22
authors: stilman
tags: [Docusaurus, React, SSR, Bug Fix]
keywords: [SSR, useColorMode, BrowserOnly, React Hook]
draft: false
---

# Discuss 组件 SSR 兼容性问题修复

本文档记录修复 Discuss 组件在博客页面 SSR 渲染时出现的 `useColorMode` hook 错误问题。

<!-- truncate -->

## 问题描述

博客页面在 SSR 编译时报错：

```
Error: Hook useColorMode is called outside the <ColorModeProvider>
```

导致博客文章页面无法正常显示。

## 原因分析

`useColorMode` 是 Docusaurus 提供的 React Hook，用于获取当前主题模式。该 Hook 必须在 `ColorModeProvider` 内部调用。

在原实现中，`useColorMode` 在 `Discuss` 组件顶层调用：

```javascript
export default function Discuss() {
  const { colorMode } = useColorMode();  // ❌ SSR 时 ColorModeProvider 不可用
  // ...
}
```

SSR 期间，`ColorModeProvider` 尚未初始化，直接调用 `useColorMode` 会报错。

## 解决方案

将所有需要客户端上下文的 hooks 移到 `BrowserOnly` 组件内部，使用 `require` 延迟加载来避免 SSR 问题：

```javascript
function GiscusComponent() {
  // 延迟加载，只在客户端执行
  const {useColorMode, useThemeConfig} = require('@docusaurus/theme-common');
  const useDocusaurusContext = require('@docusaurus/useDocusaurusContext').default;
  const Giscus = require('@giscus/react').default;

  const themeConfig_ = useThemeConfig();
  const {i18n} = useDocusaurusContext();
  const {colorMode} = useColorMode();

  // ... 使用 hooks
  return <Giscus {...mergedConfig} />;
}

export default function Discuss() {
  return (
    <BrowserOnly fallback={<div className="giscus-loading">正在加载评论...</div>}>
      {() => <GiscusComponent />}
    </BrowserOnly>
  );
}
```

## 关键点

1. **`BrowserOnly` 组件**：Docusaurus 提供的封装组件，确保内容只在客户端渲染
2. **延迟加载 `require`**：在 `BrowserOnly` 的回调函数内部使用 `require`，确保模块只在客户端加载
3. **`fallback` 属性**：提供 SSR 期间的加载提示

## 相关文件

- `src/components/Discuss/index.js` - Discuss 组件

## 参考资料

- [Docusaurus BrowserOnly 文档](https://docusaurus.io/docs/docusaurus-core#browseronly)
- [React SSR 最佳实践](https://react.dev/reference/react-dom/server)
