const app = getApp()
const config = require('../../config')

Page({
  data: {
    caseItem: null,
    loading: false
  },

  onLoad(options) {
    const id = options.id;
    if (id) {
      this.fetchCaseDetail(id);
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
    }
  },

  fetchCaseDetail(id) {
    this.setData({ loading: true });
    
    wx.request({
      url: `${config.BASE_URL}/cases/${id}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          const item = res.data;
          
          const formatUrl = (url) => {
            if (!url) return '';
            return url.startsWith('/') ? `${config.BASE_URL}${url}` : url;
          };

          // 过滤富文本中的图片路径，加上 BASE_URL，并设置图片宽度自适应
          const processedContent = item.content ? item.content.replace(/<img[^>]+src="([^">]+)"/g, (match, src) => {
            let newMatch = match;
            if (src && src.startsWith('/')) {
              newMatch = match.replace(src, `${config.BASE_URL}${src}`);
            }
            // 注入 style 确保宽度自适应
            if (!newMatch.includes('style=')) {
              newMatch = newMatch.replace('<img', '<img style="max-width:100%;height:auto;display:block;margin:10px 0;"');
            } else {
              newMatch = newMatch.replace(/style=["']([^"']+)["']/, (s, style) => {
                return `style="max-width:100%;height:auto;display:block;margin:10px 0;${style}"`;
              });
            }
            return newMatch;
          }) : '';

          this.setData({
            caseItem: {
              id: item.id,
              author: item.author?.nickname || '专家',
              avatar: formatUrl(item.author?.avatarUrl) || '/assets/images/default-avatar.png',
              date: item.createdAt.substring(0, 10).replace(/-/g, '/'),
              title: item.title,
              content: processedContent,
              tag: item.tag,
              tagColor: item.tagColor || '#FF6B35',
              likes: item.likes || 0,
              stars: item.stars || 0,
              shares: item.shares || 0,
              isLiked: false
            }
          });
        }
      },
      fail: (err) => {
        console.error('Fetch case detail failed:', err);
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  },

  onBackTap() {
    wx.navigateBack();
  }
})
