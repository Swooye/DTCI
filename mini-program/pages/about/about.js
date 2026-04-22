const app = getApp()
const config = require('../../config')
const contentUtil = require('../../utils/content')

Page({
  data: {
    aboutUs: {
      companyName: 'DTCI',
      description: '',
      contact: '',
      email: '',
      address: ''
    }
  },

  onLoad() {
    this.fetchAboutUs()
  },

  fetchAboutUs() {
    wx.request({
      url: `${config.BASE_URL}/settings/about_us`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          let aboutUs = res.data;
          // 使用 banner 模式处理富文本，强制大图全宽
          if (aboutUs.description) {
            aboutUs.description = contentUtil.processRichText(aboutUs.description, 'banner');
          }
          this.setData({ aboutUs });
        }
      },
      fail: (err) => {
        console.error('Fetch about us failed:', err)
      }
    })
  },

  onEmailTap() {
    wx.setClipboardData({
      data: this.data.aboutUs.email || 'contact@dtci.com',
      success: () => {
        wx.showToast({
          title: '邮箱已复制',
          icon: 'success'
        })
      }
    })
  },

  onAddressTap() {
    // 这里如果能解析地理位置更好，暂时先用固定经纬度或仅展示地址
    wx.showModal({
      title: '公司地址',
      content: this.data.aboutUs.address || '北京市朝阳区XXX大厦',
      confirmText: '复制地址',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: this.data.aboutUs.address
          })
        }
      }
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
