const app = getApp()

Page({
  data: {
    caseItem: null
  },

  onLoad(options) {
    const id = options.id || 1;
    this.mockFetchDetail(id);
  },

  mockFetchDetail(id) {
    // 模拟拉取详情
    const fullText = "我是小王子，前泽宇团队成员，19年有幸接触到平台，跟着团队1年时间实现了年入百万，接着买房车，让整个人生至少加速了10年我是小王子，前泽宇团队成员，19年有幸接触到平台，跟着团队1年时间实现了年入百万，接着买房车，让整个人生至少加速了10年我是小王子，前泽宇团队成员，19年有幸接触到平台，跟着团队1年时间实现了年入百万，接着买房车，让整个人生至少加速了10年。\n\n我是小王子，前泽宇团队成员，19年有幸接触到平台，跟着团队1年时间实现了年入百万，接着买房车，让整个人生至少加速了10年。\n\n我是小王子，前泽宇团队成员，19年有幸接触到平台，跟着团队1年时间实现了年入百万，接着买房车，让整个人生至少加速了10年9年有幸接触到平台，让整个人生至少加速了10年。";

    this.setData({
      caseItem: {
        id: id,
        author: "Mike Brewer",
        avatar: "/assets/images/founder.jpg",
        date: "2025/05/01",
        title: "报名【奢侈品全案操盘】，定位青少年藤校教育规划和心力教练全年陪跑",
        content: fullText,
        tag: "🔥战略股东",
        tagColor: "#FF6B35",
        likes: 5,
        stars: 13,
        shares: 25,
        isLiked: true
      }
    });
  },

  onBackTap() {
    wx.navigateBack();
  }
})
