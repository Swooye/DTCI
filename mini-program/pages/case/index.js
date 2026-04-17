const app = getApp()
const config = require('../../config')

Page({
  data: {
    tags: ['推荐', '事业', '亲子', '婚恋', '自我成长'],
    currentTag: 0,
    caseList: [],
    loading: false
  },

  onLoad() {
    this.fetchCases();
  },

  onShow() {
    // 每次进入页面刷新
    this.fetchCases();
  },

  fetchCases() {
    if (this.data.loading) return;
    this.setData({ loading: true });

    const tag = this.data.tags[this.data.currentTag];
    const query = tag === '推荐' ? 'isRecommended=true' : `tag=${tag}`;

    wx.request({
      url: `${config.BASE_URL}/cases?${query}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
            const formatUrl = (url) => {
              if (!url) return '';
              return url.startsWith('/') ? `${config.BASE_URL}${url}` : url;
            };

            const formattedList = res.data.map(item => {
              let images = [];
              try { images = JSON.parse(item.images || '[]') } catch (e) {}
              
              // 统一处理图片路径
              images = images.map(img => formatUrl(img));

              return {
                id: item.id,
                author: item.author?.nickname || '专家',
                avatar: formatUrl(item.author?.avatarUrl) || '/assets/images/default-avatar.png',
                date: item.createdAt.substring(0, 10).replace(/-/g, '/'),
                title: item.title,
                content: item.content ? item.content.replace(/<[^>]+>/g, '') : '',
                tag: item.tag,
                tagColor: item.tagColor || '#FF6B35',
                images: images,
                likes: item.likes,
                stars: item.stars,
                isLiked: false
              }
            });
          this.setData({ caseList: formattedList });
        }
      },
      fail: (err) => {
        console.error('Fetch cases failed:', err);
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  },

  onTagTap(e) {
    const idx = e.currentTarget.dataset.idx;
    this.setData({ currentTag: idx }, () => {
      this.fetchCases();
    });
  },

  onCardTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/case/detail?id=${id}`
    });
  },

  // 沿用底部的路由跳转
  onHomeTap() { wx.redirectTo({ url: '/pages/home/home' }) },
  onTestTap() { wx.navigateTo({ url: '/pages/assessment/index' }) },
  onServiceTap() { wx.redirectTo({ url: '/pages/service/index' }) },
  onMyTap() { wx.redirectTo({ url: '/pages/my/index' }) }
})
