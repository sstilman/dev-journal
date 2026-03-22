/**
 * 页脚链接配置
 * 统一管理所有页脚链接数据
 */

export const footerLinks = [
  {
    title: '本站导航',
    links: [
      // { label: '项目札记', to: '/docs/intro' },
      // { label: '博客', to: '/blog' },
    ],
  },
  {
    title: '其他站点',
    links: [
      { label: '📖 浮生杂记', href: 'https://life.stilman.space' },
    ],
  },
  {
    title: '资源',
    links: [
      // { label: 'GitHub', href: 'https://github.com' },
    ],
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

export const copyrightConfig = {
  poweredBy: 'Docusaurus',
  poweredByUrl: 'https://docusaurus.io',
};
