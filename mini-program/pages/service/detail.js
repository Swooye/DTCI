Page({
  data: {
    detail: null
  },

  onLoad(options) {
    const id = options.id || 1;
    this.fetchDetail(id);
  },

  fetchDetail(id) {
    // 模拟根据 ID 获取详情
    this.setData({
      detail: {
        id: id,
        title: "帮您更深度地看清事业婚恋、亲子关系的卡点 | 自我疗愈",
        content: "我是小王子，前泽宇团队成员，19年有幸接触到平台，跟着团队1年时间实现了年入百万，接着买房车，让整个人生至少加速了10年我是小王子啊\n\n我是小王子，前泽宇团队成员，19年有幸接触到平台，跟着团队1年时间实现了年入百万，接着买房车，让整个人生至少加速了10年我是小王子啊我是小王子，前泽宇团队成员，19年有幸接触到平台，跟着团队1年时间实现了年入百万，接着买房车，让整个人生至少加速了10年我是小王子啊\n\n我是小王子，前泽宇团队成员，19年有幸接触到平台，跟着团队1年时间实现了年入百万，接着买房车，让整个人生至少加速了10年我是小王子啊我是小王子，前泽宇团队成员，19年有幸接触到平台，跟着团队1年时间实现了年入百万，接着买房车，让整个人生至少加速了10年我是小王子啊",
        heroImage: "/assets/images/founder.jpg"
      }
    });
  },

  onShare() {
    wx.showActionSheet({
      itemList: ['分享到朋友圈', '发送给好友'],
      success(res) {
        wx.showToast({ title: '分享功能开发中', icon: 'none' });
      }
    });
  },

  onContact() {
    wx.showActionSheet({
      itemList: ['拨打电话: 400-123-4567', '打开在线客服'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.makePhoneCall({ phoneNumber: '4001234567' });
        } else {
          wx.showToast({ title: '正在连接客服...', icon: 'none' });
        }
      }
    });
  }
})
