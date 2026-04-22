const app = getApp()
const config = require('../../config')
const contentUtil = require('../../utils/content')
const util = require('../../utils/util')


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
      wx.showToast({ title: '参数错误', icon: 'none' });
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
          const processedContent = contentUtil.processRichText(item.content);

          const likedCases = wx.getStorageSync('likedCases') || [];
          const starredCases = wx.getStorageSync('starredCases') || [];

          // 处理头像：如果为空或者为旧版占位图，则使用 Logo
          let avatar = item.author?.avatarUrl || item.authorAvatar || item.avatar || '/assets/images/logo.png';
          const isPlaceholder = !avatar || 
                                avatar.includes('default-avatar.png') || 
                                avatar.includes('founder.jpg');
          avatar = isPlaceholder ? '/assets/images/logo.png' : contentUtil.formatUrl(avatar);

          const totalLikes = (item.virtualLikes || 0) + (item.realLikes || 0);
          const totalStars = (item.virtualStars || 0) + (item.realStars || 0);

          this.setData({
            caseItem: {
              id: item.id,
              author: item.author?.nickname || '专家',
              avatar: avatar,
              date: item.createdAt.substring(0, 10).replace(/-/g, '/'),
              title: item.title,
              content: processedContent,
              tag: item.tag,
              tagColor: item.tagColor || '#FF6B35',
              likes: totalLikes,
              stars: totalStars,
              likesText: util.formatCount(totalLikes),
              starsText: util.formatCount(totalStars),
              shares: item.shares || 0,
              isLiked: likedCases.map(String).includes(String(item.id)),
              isStarred: starredCases.map(String).includes(String(item.id))
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

  onLikeTap() {
    if (!this.data.caseItem) return;
    const item = this.data.caseItem;
    const likedCases = wx.getStorageSync('likedCases') || [];
    const isNowLiked = !item.isLiked;
    
    // 更新本地缓存
    let newLikedList;
    if (isNowLiked) {
      newLikedList = [...likedCases, item.id];
    } else {
      newLikedList = likedCases.filter(v => v !== item.id);
    }
    wx.setStorageSync('likedCases', newLikedList);

    this.setData({
      'caseItem.isLiked': isNowLiked,
      'caseItem.likes': isNowLiked ? item.likes + 1 : Math.max(0, item.likes - 1),
      'caseItem.likesText': util.formatCount(isNowLiked ? item.likes + 1 : Math.max(0, item.likes - 1))
    });

    // 原子性同步
    this.interact(item.id, 'like', isNowLiked ? 'add' : 'remove');
  },

  onStarTap() {
    if (!this.data.caseItem) return;
    const item = this.data.caseItem;
    const starredCases = wx.getStorageSync('starredCases') || [];
    const isNowStarred = !item.isStarred;

    // 更新本地缓存
    let newStarredList;
    if (isNowStarred) {
      newStarredList = [...starredCases, item.id];
    } else {
      newStarredList = starredCases.filter(v => v !== item.id);
    }
    wx.setStorageSync('starredCases', newStarredList);

    console.log(`[Interaction-UI] Detail Case ${item.id} star tap. isNowStarred: ${isNowStarred}`);
    this.setData({
      'caseItem.isStarred': isNowStarred,
      'caseItem.stars': isNowStarred ? item.stars + 1 : Math.max(0, item.stars - 1),
      'caseItem.starsText': util.formatCount(isNowStarred ? item.stars + 1 : Math.max(0, item.stars - 1))
    });

    // 原子性同步
    this.interact(item.id, 'star', isNowStarred ? 'add' : 'remove');
  },

  interact(id, type, action) {
    console.log(`[Interact] Detail ${type} ${action} for case ${id}`);
    wx.request({
      url: `${config.BASE_URL}/cases/${id}/interact`,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: { type, action },
      success: (res) => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          console.log(`[Interaction-API] Detail Success for ${type} ${action} on ${id}`, res.data);
        } else {
          console.error(`[Interaction-API] Detail Failed for ${type} ${action} on ${id}:`, res.data);
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
