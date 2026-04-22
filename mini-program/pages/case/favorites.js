const config = require('../../config')
const util = require('../../utils/util')

Page({
  data: {
    caseList: [],
    loading: false,
    pageTitle: '点赞案例', // overridden by options
    mode: 'liked' // 'liked' | 'starred'
  },

  onLoad(options) {
    const mode = options.mode || 'liked';
    this.setData({
      mode,
      pageTitle: mode === 'liked' ? '点赞案例' : '收藏案例'
    });
    wx.setNavigationBarTitle({ title: mode === 'liked' ? '点赞案例' : '收藏案例' });
  },

  onShow() {
    this.loadCases();
  },

  loadCases() {
    const mode = this.data.mode;
    const key = mode === 'liked' ? 'likedCases' : 'starredCases';
    const ids = wx.getStorageSync(key) || [];

    if (ids.length === 0) {
      this.setData({ caseList: [] });
      return;
    }

    this.setData({ loading: true });
    const formatUrl = (url) => {
      if (!url) return '';
      return url.startsWith('/') ? `${config.BASE_URL}${url}` : url;
    };

    // Fetch each case by ID (sequential, simple approach)
    const requests = ids.map(id => new Promise((resolve) => {
      wx.request({
        url: `${config.BASE_URL}/cases/${id}`,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            const item = res.data;
            let images = [];
            try { images = JSON.parse(item.images || '[]') } catch (e) {}
            images = images.map(img => formatUrl(img));
            const likedCases = wx.getStorageSync('likedCases') || [];
            const starredCases = wx.getStorageSync('starredCases') || [];
            // 处理头像：如果为空或者为旧版占位图，则使用 Logo
            let avatar = item.author?.avatarUrl;
            const isPlaceholder = !avatar || 
                                  avatar.includes('default-avatar.png') || 
                                  avatar.includes('founder.jpg');
            avatar = isPlaceholder ? '/assets/images/logo.png' : formatUrl(avatar);

            const totalLikes = (item.virtualLikes || 0) + (item.realLikes || 0);
            const totalStars = (item.virtualStars || 0) + (item.realStars || 0);

            resolve({
              id: item.id,
              author: item.author?.nickname || '专家',
              avatar: avatar,
              date: item.createdAt.substring(0, 10).replace(/-/g, '/'),
              title: item.title,
              content: item.content ? item.content.replace(/<[^>]+>/g, '') : '',
              tag: item.tag,
              tagColor: item.tagColor || '#FF6B35',
              images: images,
              likes: totalLikes,
              stars: totalStars,
              likesText: util.formatCount(totalLikes),
              starsText: util.formatCount(totalStars),
              isLiked: likedCases.map(String).includes(String(item.id)),
              isStarred: starredCases.map(String).includes(String(item.id))
            });
          } else {
            resolve(null);
          }
        },
        fail: () => resolve(null)
      });
    }));

    Promise.all(requests).then(results => {
      this.setData({
        caseList: results.filter(Boolean),
        loading: false
      });
    });
  },

  onCardTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/case/detail?id=${id}` });
  },

  onLikeTap(e) {
    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    const item = this.data.caseList[index];
    const likedCases = wx.getStorageSync('likedCases') || [];
    const isNowLiked = !item.isLiked;
    
    // 更新本地缓存
    let newLikedList;
    if (isNowLiked) {
      newLikedList = [...likedCases, id];
    } else {
      newLikedList = likedCases.filter(v => v !== id);
    }
    wx.setStorageSync('likedCases', newLikedList);

    const key = `caseList[${index}].isLiked`;
    const keyCount = `caseList[${index}].likes`;
    const keyText = `caseList[${index}].likesText`;
    this.setData({ 
      [key]: isNowLiked, 
      [keyCount]: isNowLiked ? item.likes + 1 : Math.max(0, item.likes - 1),
      [keyText]: util.formatCount(isNowLiked ? item.likes + 1 : Math.max(0, item.likes - 1))
    });

    // 原子性同步
    this.interact(id, 'like', isNowLiked ? 'add' : 'remove');
  },

  onStarTap(e) {
    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    const item = this.data.caseList[index];
    const starredCases = wx.getStorageSync('starredCases') || [];
    const isNowStarred = !item.isStarred;

    // 更新本地缓存
    let newStarredList;
    if (isNowStarred) {
      newStarredList = [...starredCases, id];
    } else {
      newStarredList = starredCases.filter(v => v !== id);
    }
    wx.setStorageSync('starredCases', newStarredList);

    const key = `caseList[${index}].isStarred`;
    const keyCount = `caseList[${index}].stars`;
    const keyText = `caseList[${index}].starsText`;
    console.log(`[Interaction-UI] Favorites Case ${id} star tap. index: ${index}, isNowStarred: ${isNowStarred}`);
    this.setData({ 
      [key]: isNowStarred, 
      [keyCount]: isNowStarred ? item.stars + 1 : Math.max(0, item.stars - 1),
      [keyText]: util.formatCount(isNowStarred ? item.stars + 1 : Math.max(0, item.stars - 1))
    });

    // 原子性同步
    this.interact(id, 'star', isNowStarred ? 'add' : 'remove');
  },

  interact(id, type, action) {
    console.log(`[Interact] Favorites ${type} ${action} for case ${id}`);
    wx.request({
      url: `${config.BASE_URL}/cases/${id}/interact`,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: { type, action },
      success: (res) => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          console.log(`[Interaction-API] Favorites Success for ${type} ${action} on ${id}`, res.data);
        } else {
          console.error(`[Interaction-API] Favorites Failed for ${type} ${action} on ${id}:`, res.data);
          wx.showToast({ title: '同步失败', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error(`[Interact] Network error:`, err);
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },

  onBackTap() {
    wx.navigateBack();
  }
})
