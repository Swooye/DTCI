/**
 * 格式化数字，参考小红书风格 (XiaoHongShu Style)
 * - 小于 1000: 直接显示数字 (包括 0)
 * - 大于等于 1000: 显示 X.Yk (如 1234 -> 1.2k, 12560 -> 12.5k)
 * - 优化: 如果是整数倍，则不显示小数位 (如 1000 -> 1k)
 * @param {number|string} count 
 * @returns {string}
 */
function formatCount(count) {
  const n = Number(count);
  if (isNaN(n) || n <= 0) return '0';
  if (n < 1000) return n.toString();
  
  // 计算 k (千)
  const kCount = n / 1000;
  
  // 如果是整数千 (如 1000, 2000)，直接返回 1k, 2k
  if (n % 1000 === 0) {
    return kCount.toFixed(0) + 'k';
  }
  
  // 否则保留一位小数，并去掉末尾多余的 0
  // 如 1234 -> 1.2k
  return kCount.toFixed(1).replace(/\.0$/, '') + 'k';
}

module.exports = {
  formatCount
}
