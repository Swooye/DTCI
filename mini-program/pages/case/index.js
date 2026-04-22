const app = getApp()
const config = require('../../config')
const util = require('../../utils/util')

Page({
  data: {
    tags: ['推荐', '事业', '亲子', '婚恋', '自我成长'],
    currentTag: 0,
    caseList: [],
    loading: false,
    unreadCount: 0
  },

  onLoad() {
    this.fetchCases();
  },

  onShow() {
    // 每次进入页面刷新
    this.fetchCases();
    this.refreshUnreadCount();
  },

  refreshUnreadCount() {
    const isLogin = wx.getStorageSync('isLogin');
    if (!isLogin) {
      this.setData({ unreadCount: 0 });
      return;
    }
    
    const storedUserInfo = wx.getStorageSync('userInfo') || {};
    const userId = storedUserInfo.id || 1;
    
    wx.request({
      url: `${config.BASE_URL}/notifications/unread-count/${userId}`,
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({ unreadCount: res.data });
        }
      }
    });
  },

  onPullDownRefresh() {
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

            const likedCases = wx.getStorageSync('likedCases') || [];
            const starredCases = wx.getStorageSync('starredCases') || [];

            const formattedList = res.data.map(item => {
              let images = [];
              try { images = JSON.parse(item.images || '[]') } catch (e) {}
              
              // 统一处理图片路径
              images = images.map(img => formatUrl(img));

              // 处理头像：如果为空或者为旧版占位图，则使用 Logo
              let avatar = item.author?.avatarUrl;
              const isPlaceholder = !avatar || 
                                    avatar.includes('default-avatar.png') || 
                                    avatar.includes('founder.jpg');
              avatar = isPlaceholder ? '/assets/images/logo.png' : formatUrl(avatar);

              const totalLikes = (item.virtualLikes || 0) + (item.realLikes || 0);
              const totalStars = (item.virtualStars || 0) + (item.realStars || 0);

              return {
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
        wx.stopPullDownRefresh();
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

    // 原子性同步到后端
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
    console.log(`[Interaction-UI] Case ${id} star tap. index: ${index}, isNowStarred: ${isNowStarred}`);
    this.setData({ 
      [key]: isNowStarred, 
      [keyCount]: isNowStarred ? item.stars + 1 : Math.max(0, item.stars - 1),
      [keyText]: util.formatCount(isNowStarred ? item.stars + 1 : Math.max(0, item.stars - 1))
    });

    // 原子性同步到后端
    this.interact(id, 'star', isNowStarred ? 'add' : 'remove');
  },

  interact(id, type, action) {
    console.log(`[Interact] ${type} ${action} for case ${id}`);
    wx.request({
      url: `${config.BASE_URL}/cases/${id}/interact`,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: { type, action },
      success: (res) => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          console.log(`[Interaction-API] Success for ${type} ${action} on ${id}`, res.data);
          // Optional: Could update UI again with exact server value
          // But current setData already provides immediate feedback
        } else {
          console.error(`[Interaction-API] Failed for ${type} ${action} on ${id}:`, res.data);
          wx.showToast({ title: '同步失败', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error(`[Interact] Network error:`, err);
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },

  // 沿用底部的路由跳转
  onHomeTap() { wx.reLaunch({ url: '/pages/home/home' }) },
  onTestTap() { wx.reLaunch({ url: '/pages/assessment/index' }) },
  onServiceTap() { wx.reLaunch({ url: '/pages/service/index' }) },
  onMyTap() { wx.reLaunch({ url: '/pages/my/index' }) }
})
