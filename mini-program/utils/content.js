const config = require('../config');

/**
 * 格式化图片 URL
 * 支持本地资产和服务器上传资产的自动识别
 */
const formatUrl = (url) => {
  if (!url) return '';
  // 仅对服务器上传图片补全域名
  if (url.startsWith('/uploads/')) {
    return `${config.BASE_URL}${url}`;
  }
  // 绝对路径或本地资产直接返回
  return url;
};

/**
 * 处理富文本内容
 * @param {string} html 原始 HTML
 * @param {string} mode 'default' | 'banner' (banner 模式会强制图片全宽)
 */
const processRichText = (html, mode = 'default') => {
  if (!html) return '';

  let processed = html;

  // 1. 处理图片路径
  processed = processed.replace(/src="(\/uploads\/[^"]+)"/g, (match, src) => {
    return `src="${config.BASE_URL}${src}"`;
  });

  // 2. 注入自适应样式
  processed = processed.replace(/<img/g, (match) => {
    // 基础自适应样式
    let style = 'max-width:100%;height:auto;margin:10px 0;';
    
    // 如果是 banner 模式，额外强制 block 和全宽
    if (mode === 'banner') {
      style += 'display:block;width:100%;';
    }

    return `<img style="${style}"`;
  });

  // 3. 处理 Quill 特有的类名（如果需要转换）
  // 这里的转换逻辑集中管理，不再散落在各页面

  return processed;
};

module.exports = {
  formatUrl,
  processRichText
};
