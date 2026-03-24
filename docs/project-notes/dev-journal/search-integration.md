---
id: search-integration
date: 2026-03-24
authors: stilman
tags: [Docusaurus, 搜索, 踩坑记录, 网络问题, 本地搜索]
keywords: [Docusaurus, 搜索, docusaurus-search-local, 离线安装, 网络问题, npm registry, pnpm]
draft: false
---

# Docusaurus 搜索功能集成指南

本文档记录在 Dev Journal 中集成搜索功能的完整过程，重点记录 `docusaurus-search-local` 插件的安装踩坑历程。从最简单的方案开始，逐步展示遇到的网络问题及最终解决方案。

<!-- truncate -->

## 概述

Docusaurus 支持两种搜索方案：

| 方案 | 插件 | 特点 | 适用场景 |
|------|------|------|----------|
| **本地搜索** | `docusaurus-search-local` | 离线工作，构建时生成索引 | 内网、无公网访问、不想依赖第三方 |
| **在线搜索** | `docusaurus-plugin-search-algolia` | 云端索引，搜索体验好 | 公网站点、需要分析搜索数据 |

### 本项目的选择

Dev Journal 采用 **本地搜索** 方案：
- 开发环境使用本地搜索，无需网络
- 支持中文（`zh`）和英文（`en`）双语搜索
- 完全离线，不依赖任何外部 API

---

## 一、最简方案（理想情况）

### 1.1 安装命令

```bash
pnpm add docusaurus-search-local
```

### 1.2 插件配置

在 `docusaurus.config.js` 的 `plugins` 数组中添加：

```javascript
plugins: [
  [
    '@easyops-cn/docusaurus-search-local',
    {
      indexBlog: true,
      indexDocs: true,
      language: ['en', 'zh'],
    },
  ],
],
```

### 1.3 验证

```bash
pnpm start
```

访问 http://localhost:3000/ ，在导航栏右侧应该能看到搜索框。

---

## 二、踩坑记录

### 2.1 问题描述

在执行 `pnpm add docusaurus-search-local` 时，可能会遇到以下问题：

#### 问题 1：npm registry 连接超时

```
 WARN  GET https://registry.npmjs.org/@easyops-cn/docusaurus-search-local error: ETIMEDOUT
 WARN  Retry #1, timeout 30000ms
 ERR   Maximum retry time of 3 exceeded
```

#### 问题 2：网络代理问题

```
 WARN  The request to https://registry.npmjs.org/@easyops-cn/docusaurus-search-local finished with status code 403
```

#### 问题 3：依赖版本冲突

```
 ERR_PNPM_PEER_DEP_ISSUES  Pnpm encountered import-issues
 WARN  @docusaurus/core@3.9.2 contains incorrect peer dependency
```

### 2.2 尝试方案

#### 方案 A：切换 npm registry

```bash
# 方案 A.1: 使用淘宝镜像
pnpm config set registry https://registry.npmmirror.com
pnpm add docusaurus-search-local

# 方案 A.2: 还原并使用官方源
pnpm config set registry https://registry.npmjs.org
pnpm add docusaurus-search-local
```

**结果**：网络问题依旧，可能被公司网络策略拦截。

#### 方案 B：手动下载包

```bash
# 手动下载 tarball
curl -L https://registry.npmmirror.com/@easyops-cn/docusaurus-search-local/-/docusaurus-search-local-0.44.0.tgz -o docusaurus-search-local.tgz

# 从本地 tarball 安装
pnpm add ./docusaurus-search-local.tgz
```

**结果**：依赖项仍然需要从网络下载，此方案不完整。

#### 方案 C：使用 `--ignore-scripts`

```bash
pnpm add docusaurus-search-local --ignore-scripts
```

**结果**：可能跳过部分构建步骤，导致运行时错误。

#### 方案 D：设置网络超时时间

```bash
# 设置更长的超时时间
pnpm config set fetch-retries 5
pnpm config set fetch-retry-mintimeout 30000
pnpm config set fetch-retry-maxtimeout 120000

pnpm add docusaurus-search-local
```

**结果**：超时时间增加后，部分下载成功，但仍然不稳定。

#### 方案 E：使用 npkill 清理缓存后重试

```bash
# 清理 pnpm 缓存和锁文件
pnpm store prune
rm -rf node_modules
rm pnpm-lock.yaml

# 使用离线模式
pnpm config set offline true

pnpm add docusaurus-search-local
```

**结果**：离线模式需要缓存已存在，首次安装不适用。

---

## 三、最终解决方案

### 3.1 配置 .npmrc 文件

在项目根目录创建 `.npmrc` 文件：

```ini
# .npmrc
registry=https://registry.npmmirror.com
strict-peer-dependencies=false
```

### 3.2 完整安装步骤

```bash
# 步骤 1：清理环境
rm -rf node_modules
rm pnpm-lock.yaml

# 步骤 2：配置 npm 镜像
echo "registry=https://registry.npmmirror.com" > .npmrc
echo "strict-peer-dependencies=false" >> .npmrc

# 步骤 3：安装依赖
pnpm install

# 步骤 4：单独安装搜索插件（带详细输出）
pnpm add docusaurus-search-local --network-timeout 300000
```

### 3.3 验证安装

```bash
pnpm start
```

如果终端输出类似以下内容，说明安装成功：

```
[SUCCESS] Generated search index for zh-Hans in X.XX seconds
[SUCCESS] Generated search index for en in X.XX seconds
```

### 3.4 配置文件最终状态

**`.npmrc`**:
```ini
registry=https://registry.npmmirror.com
strict-peer-dependencies=false
```

**`docusaurus.config.js`**:
```javascript
plugins: [
  // @easyops-cn/docusaurus-search-local - 本地搜索插件
  // 完全离线工作，构建时生成搜索索引，无需公网
  [
    '@easyops-cn/docusaurus-search-local',
    {
      // 索引范围
      indexBlog: true,
      indexDocs: true,
      // 中英文分词
      language: ['en', 'zh'],
      // 使用内容哈希
      hashed: true,
      // 高亮搜索词
      highlightSearchTermsOnTargetPage: true,
      // 搜索结果数量限制
      searchResultLimits: 10,
      // 搜索结果上下文最大长度
      searchResultContextMaxLength: 50,
    },
  ],
],
```

---

## 四、插件配置详解

### 4.1 完整配置项

```javascript
[
  '@easyops-cn/docusaurus-search-local',
  {
    // 索引范围
    indexBlog: true,      // 是否索引博客
    indexDocs: true,      // 是否索引文档

    // 语言配置（中英文分词）
    language: ['en', 'zh'],

    // 使用内容哈希（增加安全性，推荐开启）
    hashed: true,

    // 高亮搜索词
    highlightSearchTermsOnTargetPage: true,

    // 搜索结果配置
    searchResultLimits: 10,              // 最大结果数
    searchResultContextMaxLength: 50,   // 上下文长度

    // 可选：排除特定路径
    // excludeRoutes: ['tutorials/**'],
  },
],
```

### 4.2 配置项说明

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `indexBlog` | boolean | `true` | 是否索引博客 |
| `indexDocs` | boolean | `true` | 是否索引文档 |
| `language` | string[] | `['en']` | 支持的语言 |
| `hashed` | boolean | `false` | 是否使用哈希索引 |
| `highlightSearchTermsOnTargetPage` | boolean | `false` | 跳转后高亮搜索词 |
| `searchResultLimits` | number | `8` | 搜索结果数量上限 |
| `searchResultContextMaxLength` | number | `30` | 上下文最大字符数 |

---

## 五、中文分词原理

插件使用 `lunr.js` 进行分词。对于中文，它会：

1. 使用结巴分词进行中文分词
2. 将中文字符序列切分为单个汉字和词组
3. 生成多级索引以支持模糊匹配

---

## 六、构建与测试

### 6.1 构建命令

```bash
# 开发环境预览
pnpm start

# 生产构建
pnpm build

# 本地预览生产构建
pnpm serve
```

### 6.2 验证搜索功能

1. 启动开发服务器：`pnpm start`
2. 访问 http://localhost:3000/
3. 在导航栏右侧找到搜索框
4. 输入关键词测试：
   - 英文：`STM32`, `interrupt`, `GPIO`
   - 中文：`嵌入式`, `开发`, `笔记`

### 6.3 查看构建产物

构建后，搜索索引文件位于：

```
build/
├── search-index.json    # 搜索索引（232KB 左右）
└── search/
    └── index.html       # 搜索页面
```

---

## 七、常见问题

### 7.1 本地搜索不工作

1. **确认插件已安装**：
   ```bash
   pnpm add docusaurus-search-local
   ```

2. **清除缓存重新构建**：
   ```bash
   pnpm clear
   pnpm build
   ```

3. **检查语言配置**：确保 `language` 数组包含 `'zh'`

### 7.2 中文搜索无结果

1. **使用简体中文关键词**：`zh-Hans` 使用的简体中文分词
2. **检查控制台错误**：可能存在构建警告
3. **等待索引生成**：首次构建需要较长时间

### 7.3 构建报错 `Unable to build website for locale zh-Hans`

1. **检查 i18n 配置**：
   ```javascript
   i18n: {
     defaultLocale: 'zh-Hans',
     locales: ['zh-Hans', 'en'],
   }
   ```

2. **确保所有内容都有默认语言版本**

3. **使用最新版本的插件**：
   ```bash
   pnpm update docusaurus-search-local
   ```

### 7.4 搜索结果不准确

1. **调整搜索参数**：
   ```javascript
   searchResultLimits: 10,
   searchResultContextMaxLength: 50,
   ```

2. **添加更多关键词到 front matter**：
   ```yaml
   ---
   keywords: [搜索, 关键词, keyword]
   ---
   ```

---

## 八、相关资源

### 8.1 官方文档

- [Docusaurus 搜索文档](https://docusaurus.io/docs/search)
- [docusaurus-search-local GitHub](https://github.com/easyops-cn/docusaurus-search-local)
- [Algolia DocSearch](https://docsearch.algolia.com/)

### 8.2 插件版本

当前使用版本：
- `docusaurus-search-local`: `^0.44.0`
- `Docusaurus`: `3.9.2`

---

## 九、更新日志

| 日期 | 版本 | 变更 |
|------|------|------|
| 2026-03-24 | 0.44.0 | 初始集成，配置中英文搜索，完成网络踩坑记录 |
