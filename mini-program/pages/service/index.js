const config = require('../../config')

Page({
  data: {
    currentCategory: 'personal', // personal | corporate
    services: {
      personal: [],
      corporate: []
    },
    BASE_URL: config.BASE_URL,
    loading: false,
    unreadCount: 0
  },

  onLoad() {
    this.fetchServices();
  },

  onShow() {
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
    this.fetchServices();
  },

  fetchServices() {
    this.setData({ loading: true });
    wx.request({
      url: `${config.BASE_URL}/services?status=true`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          const personal = res.data.filter(s => s.category === 'personal');
          const corporate = res.data.filter(s => s.category === 'corporate');
          this.setData({
            'services.personal': personal,
            'services.corporate': corporate
          });
        }
      },
      complete: () => {
        this.setData({ loading: false });
        wx.stopPullDownRefresh();
      }
    });
  },

  onSwitchCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ currentCategory: cat });
  },

  onServiceDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/service/detail?id=${id}`
    });
  },

  onHomeTap() { wx.reLaunch({ url: '/pages/home/home' }) },
  onCaseTap() { wx.reLaunch({ url: '/pages/case/index' }) },
  onTestTap() { wx.reLaunch({ url: '/pages/assessment/index' }) },
  onMyTap() { wx.reLaunch({ url: '/pages/my/index' }) }
})
