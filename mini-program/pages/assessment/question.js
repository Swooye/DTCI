Page({
  data: {
    gender: 'male',
    currentIndex: 0,
    totalCount: 87, // 模拟总题数
    currentQuestion: {
      id: 23,
      title: "以下哪个描述更符合你具备的特质，更合适描述你的词语："
    },
    options: [
      { id: 'A', text: '想象的' },
      { id: 'B', text: '真实的' }
    ],
    selectedId: '',
    benefits: [
      '你是什么性格', '约2000字解读报告', '职业优势',
      '性格优势劣势', '事业类型与卡点', '天命人格',
      '性格气质类型', '婚恋关系模式', '婚恋关系卡点',
      '工作中的状态', '亲子关系状态', '生命成长建议'
    ]
  },

  onLoad(options) {
    if (options.gender) {
      this.setData({ gender: options.gender });
    }
  },

  onSelectOption(e) {
    this.setData({ selectedId: e.currentTarget.dataset.id });
  },

  onPrev() {
    if (this.data.currentIndex > 0) {
      this.setData({
        currentIndex: this.data.currentIndex - 1,
        selectedId: '' // 模拟逻辑：返回清空选中
      });
    }
  },

  onNext() {
    if (!this.data.selectedId) {
      return wx.showToast({ title: '请选择一个选项', icon: 'none' });
    }
    
    // 模拟最后一题跳转
    if (this.data.currentIndex >= 1) { // 这里模拟测试流程短一点
       wx.redirectTo({ url: '/pages/assessment/info' });
    } else {
      this.setData({
        currentIndex: this.data.currentIndex + 1,
        selectedId: ''
      });
    }
  }
})
