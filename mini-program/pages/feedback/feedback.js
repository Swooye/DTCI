const app = getApp()

Page({
  data: {
    feedbackTypes: [
      { label: '功能建议', value: 'suggestion' },
      { label: 'Bug反馈', value: 'bug' },
      { label: '体验问题', value: 'experience' },
      { label: '内容问题', value: 'content' },
      { label: '其他', value: 'other' }
    ],
    selectedType: '',
    content: '',
    images: [],
    contact: '',
    historyList: [
      {
        id: 1,
        type: '功能建议',
        content: '希望增加预约提醒功能',
        time: '2024-05-15 14:30',
        status: 'resolved',
        statusText: '已处理'
      },
      {
        id: 2,
        type: 'Bug反馈',
        content: '首页加载速度较慢',
        time: '2024-05-10 09:15',
        status: 'pending',
        statusText: '处理中'
      }
    ]
  },

  onLoad() {
    this.loadHistory()
  },

  loadHistory() {
    // 模拟加载反馈历史
    console.log('加载反馈历史')
  },

  onTypeSelect(e) {
    const value = e.currentTarget.dataset.value
    this.setData({
      selectedType: value
    })
  },

  onContentInput(e) {
    this.setData({
      content: e.detail.value
    })
  },

  onContactInput(e) {
    this.setData({
      contact: e.detail.value
    })
  },

  onUploadImage() {
    wx.chooseImage({
      count: 3 - this.data.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: [...this.data.images, ...res.tempFilePaths]
        })
      }
    })
  },

  onDeleteImage(e) {
    const index = e.currentTarget.dataset.index
    const images = this.data.images.filter((item, i) => i !== index)
    this.setData({ images })
  },

  onSubmit() {
    if (!this.data.selectedType) {
      wx.showToast({
        title: '请选择反馈类型',
        icon: 'none'
      })
      return
    }

    if (!this.data.content.trim()) {
      wx.showToast({
        title: '请填写问题描述',
        icon: 'none'
      })
      return
    }

    wx.showLoading({ title: '提交中...' })
    
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '提交成功',
        icon: 'success'
      })
      
      this.setData({
        selectedType: '',
        content: '',
        images: [],
        contact: ''
      })
      
      this.loadHistory()
    }, 1500)
  },

  onHistoryTap(e) {
    const id = e.currentTarget.dataset.id
    wx.showToast({
      title: '查看反馈详情',
      icon: 'none'
    })
  }
})
