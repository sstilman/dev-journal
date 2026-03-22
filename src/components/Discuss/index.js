/**
 * Giscus 评论组件
 *
 * 基于 @giscus/react 封装的 Docusaurus 评论组件
 * 支持亮色/暗色主题自动切换、多语言支持
 *
 * 注意：
 * - 不在此处使用 useThemeConfig / useColorMode 等需在 Layout 树中的 hook（见项目札记 discuss-component-ssr-fix）
 * - 配置以 src/data/giscusConfig.js 为准（与 docusaurus.config.js 中 themeConfig.giscus 同源）
 *
 * @see https://giscus.app/zh-CN
 */

import {useState, useEffect, useMemo} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {giscusConfig, giscusThemeConfig} from '@site/src/data/giscusConfig';

/** 与构建时 themeConfig.giscus 等价的合并结果（避免运行时依赖 window / useThemeConfig） */
function useGiscusConfig() {
  return useMemo(
    () => ({
      ...giscusThemeConfig,
      ...giscusConfig,
    }),
    [],
  );
}

/**
 * 读取当前 Docusaurus 主题：'light' | 'dark'。
 */
function getDocusaurusColorMode() {
  if (typeof document === 'undefined') {
    return 'light';
  }
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';
}

/**
 * 根据站点明暗模式返回 Giscus 的 theme 名称（对应脚本里 preferred_color_scheme 的效果）
 */
function getGiscusThemeName(cfg) {
  const isDark = getDocusaurusColorMode() === 'dark';
  return isDark
    ? cfg.darkTheme ?? giscusThemeConfig.darkTheme
    : cfg.lightTheme ?? giscusThemeConfig.lightTheme;
}

/**
 * 渲染 Giscus 组件。
 */
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
      <div
        style={{
          padding: '20px',
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          margin: '10px 0',
        }}>
        <strong>评论功能未启用</strong>
        <p style={{margin: '10px 0', fontSize: '14px'}}>
          请在 <code>src/data/giscusConfig.js</code> 中填写{' '}
          <code>repo</code>、<code>repoId</code>、<code>categoryId</code>。
        </p>
      </div>
    );
  }

  const theme = getGiscusThemeName(cfg);

  if (!GiscusComponent) {
    return <div className="giscus-loading">正在加载评论...</div>;
  }

  return (
    <div data-giscus-theme={theme} key={routeKey}>
      <GiscusComponent
        id="discuss"
        repo={cfg.repo}
        repoId={cfg.repoId}
        category={cfg.category ?? giscusThemeConfig.category}
        categoryId={cfg.categoryId}
        mapping={cfg.mapping ?? giscusThemeConfig.mapping}
        term={cfg.term}
        strict={cfg.strict ?? giscusThemeConfig.strict}
        reactionsEnabled={cfg.reactionsEnabled ?? giscusThemeConfig.reactionsEnabled}
        emitMetadata={cfg.emitMetadata ?? giscusThemeConfig.emitMetadata}
        inputPosition={cfg.inputPosition ?? giscusThemeConfig.inputPosition}
        theme={theme}
        lang={cfg.lang ?? 'zh-CN'}
        loading={giscusThemeConfig.loading}
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
