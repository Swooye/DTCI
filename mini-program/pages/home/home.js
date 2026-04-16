const app = getApp()

Page({
  data: {
    compareList: [
      { label: '更精准', dtci: '精确锁定问题，直击关系与生命卡点', other: '模模糊糊，似是而非' },
      { label: '更落地', dtci: '系统的刻意练习方法，明确的自我成长地图', other: '听了很多道理，但依然无从下手' },
      { label: '更整体', dtci: '打通事业、婚恋、亲子内在逻辑，建立生命整体观', other: '头痛医头，脚痛医脚，缺乏生命整体观' },
      { label: '更实证', dtci: '原创DTCI体系，融合西方心理学与东方修行智慧', other: '知识搬运，缺乏体悟和实证' },
      { label: '更全面', dtci: '深度的解读、全面的咨询与长周期的陪伴', other: '简单的一次测评或贴标签' }
    ]
  },

  onLoad() {
    this.checkLogin()
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
    wx.navigateTo({ url: '/pages/case/index' })
  },

  onTestTap() {
    wx.navigateTo({ url: '/pages/assessment/index' })
  },

  onServiceTap() {
    wx.navigateTo({ url: '/pages/service/index' })
  },

  onMyTap() {
    wx.navigateTo({ url: '/pages/my/index' })
  }
})
