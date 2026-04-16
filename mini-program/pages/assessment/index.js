Page({
  data: {
    selectedGender: 'male', // 默认选中男生版
    participants: {
      male: '3.5w',
      female: '8999'
    },
    benefits: [
      '你是什么性格', '约2000字解读报告', '职业优势',
      '性格优势劣势', '事业类型与卡点', '天命人格',
      '性格气质类型', '婚恋关系模式', '婚恋关系卡点',
      '工作中的状态', '亲子关系状态', '生命成长建议'
    ],
    notes: [
      '本测试长期有效，每经历一些事一些人，我们的社会基因DTCI就会发生变化，建议每季度测评一次；',
      '测评报告可通过小程序或公众号【DTCI人格测评】获取，付费测试68元，结果仅供参考。',
      '如需更准确、更深度解读，可联系客服小秘书，由专业的解读师为您解读。'
    ]
  },

  onSelectGender(e) {
    this.setData({ selectedGender: e.currentTarget.dataset.gender });
  },

  onStart() {
    wx.navigateTo({
      url: `/pages/assessment/question?gender=${this.data.selectedGender}`
    });
  },

  onShare() {
     wx.showShareMenu({ withShareTicket: true });
  },

  onMyReportTap() {
    wx.switchTab({ url: '/pages/my/index' });
  }
})
