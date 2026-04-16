Component({
  properties: {
    show: { type: Boolean, value: false },
    price: { type: String, value: '68.00' },
    itemName: { type: String, value: 'DTCI完整解读报告' }
  },
  data: {
    pin: [], // 存储输入的数字
    keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'DEL']
  },
  methods: {
    onClose() {
      this.triggerEvent('close');
      this.setData({ pin: [] });
    },
    onTapKey(e) {
      const key = e.currentTarget.dataset.key;
      if (key === '') return;
      
      let pin = this.data.pin;
      if (key === 'DEL') {
        if (pin.length > 0) {
          pin.pop();
          this.setData({ pin });
        }
        return;
      }

      if (pin.length < 6) {
        pin.push(key);
        this.setData({ pin });
        
        if (pin.length === 6) {
          // 模拟提交支付
          this.triggerSuccess();
        }
      }
    },
    triggerSuccess() {
      wx.showLoading({ title: '正在支付' });
      setTimeout(() => {
        wx.hideLoading();
        this.triggerEvent('success');
        this.setData({ pin: [] });
      }, 1500);
    }
  }
})
