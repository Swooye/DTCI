App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log('login code:', res.code)
      }
    })

    // 初始化登录态：如果缓存中没有，默认视为已授权登录 (根据用户要求)
    const isLogin = wx.getStorageSync('isLogin')
    if (isLogin === '') {
      wx.setStorageSync('isLogin', true)
      this.globalData.isLogin = true
    } else {
      this.globalData.isLogin = isLogin
    }
  },
  globalData: {
    apiBaseUrl: 'http://localhost:3100',
    userInfo: null,
    isLogin: true
  }
})
