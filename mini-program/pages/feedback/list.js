const app = getApp()
const config = require('../../config')

Page({
  data: {
    list: []
  },

  onLoad() {
    this.loadList()
  },

  loadList() {
    wx.showLoading({ title: '加载中...' })
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}
    const userId = userInfo.id || 1

    wx.request({
      url: `${config.BASE_URL}/feedbacks/my/${userId}`,
      success: (res) => {
        if (res.statusCode === 200) {
          const list = res.data.map(item => ({
            ...item,
            createdAt: this.formatTime(new Date(item.createdAt)),
            replyTime: item.replyTime ? this.formatTime(new Date(item.replyTime)) : ''
          }))
          this.setData({ list })
        }
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  formatTime(date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}`
  }
})
