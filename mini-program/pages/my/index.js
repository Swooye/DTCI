const app = getApp();

Page({
  data: {
    isLoggedIn: false,
    userInfo: {
      nickName: '点击登录',
      avatar: '/assets/images/default-avatar.png'
    },
    stats: [
      { label: '我的报告', count: 0, icon: '📁' },
      { label: '点赞案例', count: 0 },
      { label: '收藏案例', count: 0 }
    ],
    menus: [
      { id: 'feedback', icon: '✉', name: '意见反馈' },
      { id: 'about', icon: '🔖', name: '关于我们' },
      { id: 'protocol', icon: '📄', name: '服务协议' },
      { id: 'privacy', icon: '🛡', name: '隐私保护' }
    ]
  },

  onShow() {
    this.refreshLoginState();
  },

  refreshLoginState() {
    // 从全局变量或本地存储获取登录状态和用户信息
    const isLogin = app.globalData.isLogin || wx.getStorageSync('isLogin');
    const storedUserInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    
    console.log('refreshLoginState - isLogin:', isLogin);
    console.log('refreshLoginState - userInfo:', storedUserInfo);
    
    if (isLogin && storedUserInfo) {
      this.setData({
        isLoggedIn: true,
        userInfo: {
          nickName: storedUserInfo.nickName || storedUserInfo.nickname || '微信用户',
          avatar: storedUserInfo.avatar || '/assets/images/default-avatar.png'
        }
      });
    } else {
      this.setData({
        isLoggedIn: false,
        userInfo: {
          nickName: '点击登录',
          avatar: '/assets/images/default-avatar.png'
        }
      });
    }
  },

  onSettingsTap() {
    wx.navigateTo({ url: '/pages/my/settings' });
  },

  onProfileTap() {
    if (this.data.isLoggedIn) {
      wx.navigateTo({ url: '/pages/my/profile' });
    } else {
      wx.navigateTo({ url: '/pages/login/login' });
    }
  },

  onLoginTap() {
    if (!this.data.isLoggedIn) {
      wx.navigateTo({ url: '/pages/login/login' });
    } else {
      this.onProfileTap();
    }
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
  onCaseTap() { wx.navigateTo({ url: '/pages/case/index' }) },
  onTestTap() { wx.navigateTo({ url: '/pages/assessment/index' }) },
  onServiceTap() { wx.navigateTo({ url: '/pages/service/index' }) }
})
