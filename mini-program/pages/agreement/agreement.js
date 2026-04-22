const config = require('../../config')
const contentUtil = require('../../utils/content')

Page({
  data: {
    title: '服务协议',
    content: '',
    loading: true
  },

  onLoad() {
    this.fetchAgreement()
  },

  fetchAgreement() {
    this.setData({ loading: true })
    wx.request({
      url: `${config.BASE_URL}/settings/service_agreement`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          const data = res.data;
          // 处理富文本
          const processedContent = contentUtil.processRichText(data.content || '');
          this.setData({
            title: data.title || '服务协议',
            content: processedContent,
            loading: false
          })
          // 动态设置导航栏标题
          wx.setNavigationBarTitle({
            title: data.title || '服务协议'
          })
        } else {
          this.setData({ loading: false })
          wx.showToast({
            title: '获取协议失败',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        console.error('Fetch agreement failed:', err)
        this.setData({ loading: false })
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
      }
    })
  }
})
