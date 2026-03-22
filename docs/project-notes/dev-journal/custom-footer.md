---
description: Docusaurus 自定义页脚设计与实现
draft: false
tags: [Docusaurus, footer]
---

# Docusaurus 自定义页脚设计与实现

## 背景

Docusaurus 默认的页脚样式较为简洁，但与个人博客的品牌形象不够契合。为了打造更具辨识度的站点风格，决定对页脚区域进行深度定制，实现品牌信息展示与导航功能的融合。

## 实现方案

### 1. 数据层抽象

创建独立的数据配置文件 `src/data/footerLinks.js`，将页脚内容与组件逻辑分离：

```javascript
// src/data/footerLinks.js
export const footerLinks = [
  {
    title: '导航',
    links: [
      // { label: '项目札记', to: '/docs/intro' },
    ],
  },
  {
    title: '资源',
    links: [
      // { label: 'GitHub', href: 'https://github.com' },
    ],
  },
  {
    title: '社交',
    links: [],
  },
  {
    title: '关于',
    links: [
      // { label: '自己', to: '/about' },
    ],
  },
];

export const brandConfig = {
  description: {
    en: 'Embedded Development Notes',
    zh: '以码为笔，记深耕之路',
  },
};
```

这种设计的好处：
- 内容编辑者无需了解代码逻辑
- 支持后续灵活扩展链接分类
- 便于多语言场景下的文案管理

### 2. 组件开发

重写 Footer 主题组件 `src/theme/Footer/index.js`：

```javascript
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { footerLinks, brandConfig } from '@site/src/data/footerLinks';
import styles from './Footer.module.css';

function FooterLink({ link }) {
  const isInternal = link.to && !link.href;
  const className = styles.footerLink;

  if (isInternal) {
    return (
      <li>
        <Link to={link.to} className={className}>
          {link.label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <a
        href={link.href}
        target={link.href?.startsWith('http') ? '_blank' : undefined}
        rel={link.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {link.label}
      </a>
    </li>
  );
}
```

关键设计点：
- 自动识别内部链接和外部链接
- 外部链接使用安全属性配置
- 组件职责单一，便于维护

### 3. 样式实现

采用现代 CSS 特性，打造响应式且支持明暗主题的页脚：

```css
/* src/theme/Footer/Footer.module.css */
.footer {
  --footer-heading-color: #ffffff;
  background: linear-gradient(to bottom, #1a1a1a, #0d0d0d);
  color: #e5e5e5;
  padding: 4rem 0 2rem;
  font-size: 0.875rem;
  line-height: 1.6;
}

.footerTop {
  display: grid;
  grid-template-columns: 1.5fr 2.5fr;
  gap: 4rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brandSection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.linksGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}
```

#### 明暗主题适配

```css
[data-theme='light'] .footer {
  --footer-heading-color: #0f172a;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  color: #1e293b;
  border-top: 1px solid #e2e8f0;
}

[data-theme='light'] .footerLink:hover {
  color: #2e8555;
}
```

#### 响应式布局

```css
@media (max-width: 1024px) {
  .footerTop {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .linksGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .footerBottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
```

### 4. 配置整合

从 `docusaurus.config.js` 中移除内联的 footer 配置：

```javascript
footer: {
  style: 'dark',
  // links 和 copyright 已迁移到独立组件
},
```

## 最终效果

自定义后的页脚具备以下特性：

| 特性 | 说明 |
|------|------|
| 品牌展示 | 左侧显示站点名称和 tagline |
| 分类导航 | 右侧四列链接网格，支持灵活配置 |
| 主题适配 | 自动响应明暗模式切换 |
| 响应式布局 | 适配桌面、平板、手机等设备 |
| 渐变背景 | 深色主题使用微妙渐变，增加层次感 |

## 后续优化方向

- 添加社交媒体图标链接
- 集成订阅/RSS 功能入口
- 添加访问统计小部件
- 实现页脚内容的 CMS 管理

---

*追求细节，打造专业的技术博客体验。*
