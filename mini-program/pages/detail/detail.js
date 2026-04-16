const app = getApp()

Page({
  data: {
    service: {
      id: 1,
      name: '基因类型测评',
      price: 199,
      originalPrice: 399,
      sales: 1234,
      views: 5678,
      tags: ['专业测评', '科学依据', '个性化报告'],
      images: [
        '/assets/images/service-detail1.jpg',
        '/assets/images/service-detail2.jpg',
        '/assets/images/service-detail3.jpg'
      ],
      description: '<p>基因类型测评是一项基于现代遗传学原理的健康评估服务。通过采集您的基因样本，我们能够分析您的基因特征，为您提供个性化的健康建议。</p><p>测评内容包括：</p><p>1. 基因特征分析</p><p>2. 健康风险评估</p><p>3. 个性化建议</p>',
      notices: [
        '测评前24小时请保持正常饮食，避免剧烈运动',
        '采样前30分钟请勿饮水、进食',
        '请按照指导正确采集样本',
        '结果将在5-7个工作日内出具'
      ]
    },
    isCollected: false,
    showBookModal: false,
    appointmentTime: '',
    appointmentCode: ''
  },

  onLoad(options) {
    const id = options.id
    this.loadServiceDetail(id)
  },

  loadServiceDetail(id) {
    // 模拟加载服务详情
    console.log('加载服务详情:', id)
  },

  onCollectTap() {
    const isCollected = !this.data.isCollected
    this.setData({ isCollected })
    wx.showToast({
      title: isCollected ? '收藏成功' : '取消收藏',
      icon: 'success'
    })
  },

  onShareTap() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  onConsultTap() {
    wx.showToast({
      title: '客服功能开发中',
      icon: 'none'
    })
  },

  onBookTap() {
    wx.showModal({
      title: '确认预约',
      content: '确定要预约此服务吗？',
      success: (res) => {
        if (res.confirm) {
          this.bookService()
        }
      }
    })
  },

  bookService() {
    const now = new Date()
    const appointmentTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const appointmentCode = `APT${Date.now()}`

    this.setData({
      showBookModal: true,
      appointmentTime,
      appointmentCode
    })
  },

  closeModal() {
    this.setData({
      showBookModal: false
    })
  },

  viewAppointment() {
    wx.showToast({
      title: '查看预约功能开发中',
      icon: 'none'
    })
  }
})
