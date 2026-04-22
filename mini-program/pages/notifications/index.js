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
      url: `${config.BASE_URL}/notifications/my/${userId}`,
      success: (res) => {
        if (res.statusCode === 200) {
          const list = res.data.map(item => ({
            ...item,
            createdAt: this.formatTime(new Date(item.createdAt))
          }))
          this.setData({ list })
        }
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  onItemTap(e) {
    const { id, index } = e.currentTarget.dataset
    const item = this.data.list[index]
    
    if (!item.isRead) {
      wx.request({
        url: `${config.BASE_URL}/notifications/${id}/read`,
        method: 'POST',
        success: () => {
          this.setData({
            [`list[${index}].isRead`]: true
          })
          // Update global unread count if needed
        }
      })
    }

    // Show details or do nothing
    wx.showModal({
      title: item.title,
      content: item.content,
      showCancel: false
    })
  },

  formatTime(date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    return `${month}-${day} ${hour}:${minute}`
  }
})
