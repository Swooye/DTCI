Page({
  data: {
    resultType: '',
    profileName: '科学家型王者',
    description: '具有极强的逻辑分析能力和深广的视野。善于洞察事物本质，能在复杂系统中找到最优解。',
    radarData: [
      { label: '决断(D)', percent: 85 },
      { label: '思考(T)', percent: 90 },
      { label: '控制(C)', percent: 75 },
      { label: '直觉(I)', percent: 80 }
    ],
    countdown: '23:59:59',
    showPayment: false
  },

  onLoad(options) {
    if (options.type) {
      this.setData({ resultType: options.type });
      this.generateMockResult(options.type);
    }
    this.startCountdown();
  },

  generateMockResult(type) {
    const map = {
      'ENTJ': { name: '科学家型王者', desc: '天生的领导者，充满魅力与自信。能在复杂系统中找到最优解。', dims: [85, 90, 75, 80] },
      'INFP': { name: '治愈系精灵', desc: '诗意、善良、利他主义者。具有极强的共情力和艺术天赋。', dims: [40, 85, 60, 95] }
    };
    
    const mock = map[type] || map['ENTJ'];
    
    this.setData({
      profileName: mock.name,
      description: mock.desc,
      radarData: [
         { label: '执行(E)', percent: mock.dims[0] },
         { label: '社交(S)', percent: mock.dims[1] },
         { label: '思考(T)', percent: mock.dims[2] },
         { label: '决断(J)', percent: mock.dims[3] }
      ]
    });
  },

  startCountdown() {
    let seconds = 599; // 9:59
    this.timer = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        clearInterval(this.timer);
        this.setData({ countdown: '00:00' });
        return;
      }
      const m = String(Math.floor(seconds / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      this.setData({ countdown: `${m}:${s}` });
    }, 1000);
  },

  onUnload() {
    if (this.timer) clearInterval(this.timer);
  },

  onViewFullReport() {
    wx.showToast({ title: '报告解锁功能开发中', icon: 'none' });
  }
})
