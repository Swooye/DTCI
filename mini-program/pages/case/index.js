const app = getApp()

Page({
  data: {
    tags: ['推荐', '事业', '婚恋', '亲子', '自我成长'],
    currentTag: 0,
    caseList: [
      {
        id: 1,
        author: "小米粥",
        avatar: "/assets/images/founder.jpg",
        date: "2025/05/01",
        title: "报名【奢侈品全案操盘】，定位青少年藤校教育规划和心力教练全年陪跑 超过两行截断...",
        content: "我是小王子，前泽宇团队成员，19年有幸接触到平台，跟着团队1年时间实现了年入百万，接着买房车，让整个人生至少加速了10年我是小王子前...",
        tag: "🔥奢侈品全案",
        tagColor: "#FF6B35",
        images: [],
        likes: 0,
        stars: 0,
        isLiked: false
      },
      {
        id: 2,
        author: "小米粥",
        avatar: "/assets/images/founder.jpg",
        date: "2024/10/19",
        title: "报名【奢侈品全案操盘】定位青少年藤校教育",
        content: "我是小王子，前泽宇团队成员，19年有幸接触到平台，跟着团队1年时间实现了年入百万，接着买房车，让整个人生至少加速了10年我是小王子...\n\n我是小王子，前泽宇团队成员，19年...",
        tag: "🔥战略股东",
        tagColor: "#FF6B35",
        images: ["/assets/images/founder.jpg", "/assets/images/founder.jpg"],
        likes: 5,
        stars: 13,
        isLiked: true
      },
      {
        id: 3,
        author: "小米粥",
        avatar: "/assets/images/founder.jpg",
        date: "2024/03/12",
        title: "报名【奢侈品全案操盘】，定位青少年藤校教育规划和心力教练全年陪跑",
        content: "我是小王子，前泽宇团队成员，19年有幸接触到平台，跟着团队1年时间实现了年入百万，接着买房车，让整个人生至少加速了10年我是小王子啊...",
        tag: "🔥奢侈品全案",
        tagColor: "#FF6B35",
        images: ["/assets/images/founder.jpg", "/assets/images/founder.jpg", "/assets/images/founder.jpg", "extra1", "extra2"],
        likes: 209,
        stars: 999,
        isLiked: true
      }
    ]
  },

  onLoad() {},

  onTagTap(e) {
    const idx = e.currentTarget.dataset.idx;
    this.setData({ currentTag: idx });
  },

  onCardTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/case/detail?id=${id}`
    });
  },

  // 沿用底部的路由跳转
  onHomeTap() { wx.redirectTo({ url: '/pages/home/home' }) },
  onTestTap() { wx.navigateTo({ url: '/pages/assessment/index' }) },
  onServiceTap() { wx.redirectTo({ url: '/pages/service/index' }) },
  onMyTap() { wx.redirectTo({ url: '/pages/my/index' }) }
})
