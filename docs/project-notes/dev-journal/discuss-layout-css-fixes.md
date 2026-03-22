---
id: discuss-layout-css-fixes
date: 2026-03-22
authors: stilman
tags: [Docusaurus, CSS, Bug Fix]
keywords: [CSS, Giscus, TOC, 布局]
draft: false
---

# Discuss 组件与 TOC 布局样式修复

本文档记录修复评论组件和目录（TOC）在暗色主题下显示异常以及布局错位的问题。

<!-- truncate -->

## 问题描述

### 问题 1：暗色主题下白色干扰线

在暗色主题下，评论区域出现白色边框或背景干扰。

### 问题 2：Docs 中目录位置错误

Docs 页面的目录（TOC）没有显示在文章右侧，而是显示在评论下方。

## 解决方案

### 1. Giscus 暗色主题样式修复

在 `src/css/custom.css` 中添加以下样式：

```css
/* 修复暗色主题下 giscus iframe 的边框和背景 */
[data-theme='dark'] .giscus-frame {
  background-color: transparent !important;
  border: none !important;
  color-scheme: dark !important;
}

[data-theme='dark'] .giscus .giscus-comment {
  background-color: transparent !important;
}
```

### 2. DocItem 布局样式调整

修改 `src/theme/DocItem/Layout/styles.module.css`：

```css
@media (min-width: 997px) {
  /* 当有 TOC 时，内容区占 75% */
  .docItemCol {
    max-width: 75% !important;
    flex: 0 0 75% !important;
  }
}
```

添加全局 TOC 样式修复：

```css
/* DocItem 右侧 TOC 区 - 确保占 25% 宽度 */
@media (min-width: 997px) {
  .col--3:has(ul.table-of-contents) {
    flex: 0 0 25% !important;
    max-width: 25% !important;
  }
}
```

### 3. BlogPostPage 布局修复

将 `Discuss` 组件移到 `<BlogLayout>` 外部，确保评论在页面底部渲染：

```javascript
function BlogPostPageContent({sidebar, children}) {
  return (
    <>
      <BlogLayout sidebar={sidebar} toc={<TOC />}>
        <BlogPostItem>{children}</BlogPostItem>
        <BlogPostPaginator />
      </BlogLayout>
      <Discuss />  {/* 在布局外部渲染 */}
    </>
  );
}
```

## 相关文件

- `src/css/custom.css` - 全局样式
- `src/theme/DocItem/Layout/styles.module.css` - DocItem 布局样式
- `src/theme/BlogPostPage/index.js` - 博客页面组件

## 调试技巧

1. **检查浏览器开发者工具**：使用 F12 打开 DevTools，查看元素的实际 CSS 计算值
2. **检查 DOM 结构**：确认 HTML 结构是否符合预期（特别是 `.row` > `.col` > `.col--3` 的嵌套）
3. **测试响应式**：在 997px 以上和以下分别测试布局
