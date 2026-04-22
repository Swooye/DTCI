const app = getApp();
const config = require('../../config');

Page({
  data: {
    isLoggedIn: false,
    userInfo: {
      nickName: '点击登录',
      avatar: '/assets/images/logo.png'
    },
    stats: {
      reports: 0,
      likes: 0,
      stars: 0
    },
    menus: [
      { id: 'feedback', iconClass: 'icon-feedback', name: '意见反馈' },
      { id: 'about', iconClass: 'icon-about', name: '关于我们' },
      { id: 'protocol', iconClass: 'icon-protocol', name: '服务协议' },
      { id: 'privacy', iconClass: 'icon-privacy', name: '隐私保护' }
    ],
    unreadCount: 0
  },

  onShow() {
    this.refreshLoginState();
    this.refreshStats();
    this.refreshUnreadCount();
  },

  refreshStats() {
    const likedCases = wx.getStorageSync('likedCases') || [];
    const starredCases = wx.getStorageSync('starredCases') || [];
    this.setData({
      'stats.likes': likedCases.length,
      'stats.stars': starredCases.length
    });
  },

  refreshLoginState() {
    const isLogin = app.globalData.isLogin || wx.getStorageSync('isLogin');
    const storedUserInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');

    if (isLogin && storedUserInfo) {
      this.setData({
        isLoggedIn: true,
        userInfo: {
          nickName: storedUserInfo.nickName || storedUserInfo.nickname || '微信用户',
          avatar: storedUserInfo.avatar || '/assets/images/logo.png'
        }
      });
    } else {
      this.setData({
        isLoggedIn: false,
        userInfo: {
          nickName: '点击登录',
          avatar: '/assets/images/logo.png'
        }
      });
    }
  },

  onSettingsTap() {
    wx.navigateTo({ url: '/pages/my/settings' });
  },

  onNotificationsTap() {
    wx.navigateTo({ url: '/pages/notifications/index' });
  },

  refreshUnreadCount() {
    const isLogin = app.globalData.isLogin || wx.getStorageSync('isLogin');
    if (!isLogin) {
      this.setData({ unreadCount: 0 });
      return;
    }
    
    const storedUserInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
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

  onLoginTap() {
    if (!this.data.isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
    } else {
      wx.navigateTo({ url: '/pages/my/profile' });
    }
  },

  onReportsTap() {
    // 跳转到我的报告列表（如有）
  },

  onLikedCasesTap() {
    wx.navigateTo({ url: '/pages/case/favorites?mode=liked' });
  },

  onStarredCasesTap() {
    wx.navigateTo({ url: '/pages/case/favorites?mode=starred' });
  },

  onMenuClick(e) {
    const id = e.currentTarget.dataset.id;
    const menuMap = {
      'feedback': '/pages/feedback/feedback',
      'about': '/pages/about/about',
      'protocol': '/pages/agreement/agreement',
      'privacy': '/pages/privacy/privacy'
    };
    if (menuMap[id]) {
      wx.navigateTo({ url: menuMap[id] });
    }
  },

  onHomeTap() { wx.reLaunch({ url: '/pages/home/home' }) },
  onCaseTap() { wx.reLaunch({ url: '/pages/case/index' }) },
  onTestTap() { wx.reLaunch({ url: '/pages/assessment/index' }) },
  onServiceTap() { wx.reLaunch({ url: '/pages/service/index' }) }
})
