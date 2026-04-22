const config = require('../../config')
const contentUtil = require('../../utils/content')

Page({
  data: {
    title: '隐私政策',
    content: '',
    loading: true
  },

  onLoad() {
    this.fetchPrivacy()
  },

  fetchPrivacy() {
    this.setData({ loading: true })
    wx.request({
      url: `${config.BASE_URL}/settings/privacy_policy`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          const data = res.data;
          const processedContent = contentUtil.processRichText(data.content || '');
          this.setData({
            title: data.title || '隐私政策',
            content: processedContent,
            loading: false
          })
          // 动态设置导航栏标题
          wx.setNavigationBarTitle({
            title: data.title || '隐私政策'
          })
        } else {
          this.setData({ loading: false })
          wx.showToast({
            title: '获取政策失败',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        console.error('Fetch privacy failed:', err)
        this.setData({ loading: false })
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
      }
    })
  }
})
