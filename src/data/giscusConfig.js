/**
 * Giscus 评论服务配置
 *
 * 本配置文件用于配置 giscus 评论服务。
 * 在使用前，请先完成以下准备工作：
 *
 * 1. 在 GitHub Settings > Integrations > GitHub Apps 中安装 giscus App
 * 2. 在你的仓库 Settings > Features 中开启 Discussions
 * 3. 访问 https://giscus.app/zh-CN 配置并获取相关参数
 *
 * 说明：不必手动在 Discussions 里先发帖；giscus 会在首次评论时自动创建对应 Discussion。
 *
 * @see https://giscus.app/zh-CN
 */

export const giscusConfig = {
  /**
   * GitHub 仓库（与 giscus.app 生成的 data-repo 一致）
   *
   * @type {string}
   */
  repo: 'sstilman/dev-journal.discussions',

  /**
   * 仓库 ID（data-repo-id）
   *
   * @type {string}
   */
  repoId: 'R_kgDORtscZA',

  /**
   * Discussion 分类名称（data-category）
   *
   * @type {string}
   */
  category: 'Announcements',

  /**
   * 分类 ID（data-category-id）
   *
   * @type {string}
   */
  categoryId: 'DIC_kwDORtscZM4C5BYZ',
};

/**
 * Giscus 主题与行为配置（与嵌入脚本 / @giscus/react 参数对应）
 */
export const giscusThemeConfig = {
  /**
   * 浅色主题（脚本里 preferred_color_scheme 由 Discuss 组件按站点明暗模式映射为 light/dark）
   *
   * @type {string}
   */
  lightTheme: 'github_dark',
  // lightTheme: 'light',

  /**
   * 深色主题
   *
   * @type {string}
   */
  darkTheme: 'github_dark',

  /**
   * 映射方式（data-mapping）
   *
   * @type {string}
   */
  mapping: 'title',

  /**
   * 是否严格匹配标题（data-strict，"0" / "1"）
   *
   * @type {string}
   */
  strict: '0',

  /**
   * 是否启用表情反应（data-reactions-enabled）
   *
   * @type {string}
   */
  reactionsEnabled: '1',

  /**
   * 是否发送元数据（data-emit-metadata）
   *
   * @type {string}
   */
  emitMetadata: '0',

  /**
   * 输入框位置（data-input-position）
   *
   * @type {string}
   */
  inputPosition: 'bottom',

  /**
   * 语言（data-lang）
   *
   * @type {string}
   */
  lang: 'zh-CN',

  /**
   * 懒加载（loading）
   *
   * @type {string}
   */
  loading: 'lazy',
};
