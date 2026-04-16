const app = getApp()

Page({
  data: {

  },

  onLoad() {

  },

  onEmailTap() {
    wx.setClipboardData({
      data: 'contact@dtci.com',
      success: () => {
        wx.showToast({
          title: '邮箱已复制',
          icon: 'success'
        })
      }
    })
  },

  onAddressTap() {
    wx.openLocation({
      latitude: 39.9042,
      longitude: 116.4074,
      name: 'DTCI公司',
      address: '北京市朝阳区XXX大厦',
      scale: 18
    })
  },

  onAgreementTap() {
    wx.navigateTo({
      url: '/pages/agreement/agreement'
    })
  },

  onPrivacyTap() {
    wx.navigateTo({
      url: '/pages/privacy/privacy'
    })
  }
})
