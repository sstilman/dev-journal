/**
 * 路由更新事件发射器
 *
 * 用于解决 Docusaurus 路由切换时评论组件不刷新的问题
 * @see https://github.com/facebook/docusaurus/issues/8278
 *
 * 该模块通过 mitt 事件发射器在路由更新时发出通知，
 * 使得 giscus 评论组件能够正确响应路由变化。
 */

import mitt from 'mitt';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const emitter = mitt();

if (ExecutionEnvironment.canUseDOM) {
  window.emitter = emitter;
}

/**
 * 路由更新处理函数
 * 当 Docusaurus 路由发生更新时调用此函数
 */
export function onRouteDidUpdate() {
  if (ExecutionEnvironment.canUseDOM) {
    setTimeout(() => {
      window.emitter.emit('onRouteDidUpdate');
    });
  }
}
