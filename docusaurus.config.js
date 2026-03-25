// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// Giscus 配置（直接内联，避免 webpack 解析路径问题）
const giscusConfig = {
  repo: 'sstilman/dev-journal.discussions',
  repoId: 'R_kgDORtscZA',
  category: 'Announcements',
  categoryId: 'DIC_kwDORtscZM4C5BYZ',
  mapping: 'title',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
  lang: 'zh-CN',
  loading: 'lazy',
};

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Dev Journal",
  tagline: '全栈技术笔记 | 从嵌入式到 Web，探索软件的无限可能',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://dev.stilman.space',  // 技术站子域名
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // // GitHub pages deployment config.
  // // If you aren't using GitHub pages, you don't need these.
  // organizationName: 'stilman',  // 与域名前缀呼应，自定义即可
  // projectName: 'dev-journal',  // 与工程名一致

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebarsprojects.js',
          exclude: ['tutorials/**', '.author/**'],
        },
        blog: {
          showReadingTime: true,
          exclude: ['**/.author/**'],
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
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
    
    // Algolia DocSearch 搜索插件配置
    // 请替换以下占位符为你的 Algolia 凭证:
    // - appId: Algolia Dashboard 中获取的 Application ID
    // - apiKey: Algolia Search-Only API Key (public key)
    // - indexName: 你的索引名称 (通常是 "docusaurus" 或自定义名称)
    // @see https://docusaurus.io/docs/search#using-algolia-docsearch
    // [
    //   '@docusaurus/plugin-search-algolia',
    //   {
    //     // 【重要】请替换为你的 Algolia App ID
    //     appId: 'YOUR_APP_ID',
    //     // 【重要】请替换为你的 Algolia Search-Only API Key (public key)
    //     apiKey: 'YOUR_SEARCH_API_KEY',
    //     // 【重要】请替换为你的 Algolia Index Name
    //     indexName: 'YOUR_INDEX_NAME',
    //     // 搜索结果的语言环境
    //     contextualSearch: true,
    //     // 搜索参数配置
    //     searchParameters: {},
    //     // 搜索结果页面路径
    //     searchPagePath: 'search',
    //   },
    // ],

    // @easyops-cn/docusaurus-search-local - 本地搜索插件
    // 完全离线工作，构建时生成搜索索引，无需公网
    // @see https://github.com/easyops-cn/docusaurus-search-local
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

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      docs: {
        sidebar: {
          autoCollapseCategories: true,
        },
      },
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: "Dev Journal",  // 导航栏显示站点名
        logo: {
          alt: "Dev Journal Logo",
          src: 'img/logo.svg',  // 后续可添加个性化logo
        },
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
            label: '技术教程',
          },
          {to: '/blog', label: '技术博客', position: 'left'},
          // 本地搜索栏（由 docusaurus-search-local 插件提供，位于导航栏右侧）
          {
            type: 'search',
            position: 'right',
          },
          {
            href: 'https://life.stilman.space',
            label: '浮生杂记',
            position: 'right',
          },
          // {
          //   type: 'localeDropdown',
          //   position: 'right',
          // },
          // {
          //   href: 'https://github.com/facebook/docusaurus',
          //   label: 'GitHub',
          //   position: 'right',
          // },
        ],
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
      footer: {
        style: 'dark',
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      giscus: giscusConfig,
    }),
};

export default config;

// ============================================================
// Client Modules
// 用于加载客户端模块
// ============================================================
config.clientModules = [
  require.resolve('./src/clientModules/routeModules.js'),
];
