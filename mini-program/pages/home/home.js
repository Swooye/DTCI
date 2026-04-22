const app = getApp()
const config = require('../../config')

Page({
  data: {
    companyIntro: '',
    founderVideo: '',
    serviceImage: '',
    loading: true,
    unreadCount: 0
  },

  onShow() {
    this.refreshUnreadCount();
  },

  onLoad() {
    this.checkLogin()
    this.fetchHomeSettings()
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

  fetchHomeSettings() {
    wx.request({
      url: `${config.BASE_URL}/settings/home_settings`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          try {
            // The backend sends back the parsed JSON object directly.
            const settings = res.data.value ? JSON.parse(res.data.value) : (typeof res.data === 'string' ? JSON.parse(res.data) : res.data)
            this.setData({
              mission: settings.mission || '',
              vision: settings.vision || '',
              values: settings.values || '',
              founderVideo: settings.founderVideo || '',
              serviceImage: settings.serviceCompareImage || '',
              loading: false
            })
          } catch (e) {
            console.error('Parse settings error:', e)
            this.setData({ loading: false })
          }
        } else {
          this.setData({ loading: false })
        }
      },
      fail: (err) => {
        console.error('Fetch settings err:', err)
        this.setData({ loading: false })
      }
    })
  },

  checkLogin() {
    const isLogin = wx.getStorageSync('isLogin')
    if (!isLogin) {
      wx.redirectTo({
        url: '/pages/login/login'
      })
    }
  },

  onPlayVideo() {
    wx.showToast({
      title: '视频播放功能开发中',
      icon: 'none'
    })
  },

  onCaseTap() {
    wx.reLaunch({ url: '/pages/case/index' })
  },

  onTestTap() {
    wx.reLaunch({ url: '/pages/assessment/index' })
  },

  onServiceTap() {
    wx.reLaunch({ url: '/pages/service/index' })
  },

  onMyTap() {
    wx.reLaunch({ url: '/pages/my/index' })
  }
})
