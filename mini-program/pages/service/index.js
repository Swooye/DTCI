Page({
  data: {
    currentCategory: 'personal', // personal | corporate
    services: {
      personal: [
        {
          id: 1,
          title: "DTCI 1V1深度解读",
          description: "帮您更深度地看见事业、婚恋、亲子关系的卡点和改善之道"
        },
        {
          id: 2,
          title: "DTCI进化1V1陪伴",
          description: "深度陪伴、支持您更好地自我成长、自我疗愈与亲密关系改善"
        },
        {
          id: 3,
          title: "DTCI正念训练营",
          description: "在团体中，共同科学训练、刻意练习，践行“你好、我好”生活之道"
        },
        {
          id: 4,
          title: "DTCI 认证解读师培训",
          description: "支持有潜力、有能力的人成为DTCI解读师，影响更多人活好自己"
        },
        {
          id: 5,
          title: "DTCI 1V1深度解读",
          description: "帮您更深度地看见事业、婚恋、亲子关系的卡点和改善之道"
        }
      ],
      corporate: [
        {
          id: 101,
          title: "企业人才测评",
          description: "帮助企业更好地识别人才、遴选人才，大大提高人才招聘的效率"
        },
        {
          id: 102,
          title: "高管匹配度评估",
          description: "评估高管与岗位职能、当前企业发展阶段的匹配度，避免人才引进的盲目"
        },
        {
          id: 103,
          title: "幸福领导力培训",
          description: "助力管理者发展出L型幸福领导力，激发其带领出高效能、高幸福感的团队"
        },
        {
          id: 104,
          title: "企业文化咨询",
          description: "基于企业生命周期与企业DTCI诊断，帮助企业建立更具效能的企业文化"
        }
      ]
    }
  },

  onSwitchCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ currentCategory: cat });
  },

  onServiceDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/service/detail?id=${id}`
    });
  },

  onHomeTap() { wx.redirectTo({ url: '/pages/home/home' }) },
  onCaseTap() { wx.redirectTo({ url: '/pages/case/index' }) },
  onTestTap() { wx.navigateTo({ url: '/pages/assessment/index' }) },
  onMyTap() { wx.redirectTo({ url: '/pages/my/index' }) }
})
