const config = require('../../config')

Page({
  data: {
    questionnaires: [],
    selectedId: null,
    participants: {
      male: '3.5w',
      female: '8999'
    },
    benefits: [
      '你是什么性格', '约2千字解读报告', '职业优势',
      '性格优势劣势', '事业类型与卡点', '天命人格',
      '性格气质类型', '婚恋关系模式', '婚恋关系卡点',
      '工作中的状态', '亲子关系状态', '生命成长建议'
    ],
    notes: [
      '本测试长期有效，每经历一些事一些人，我们的社会基因DTCI就会发生变化，建议每季度测评一次；',
      '测评报告可通过小程序或公众号【DTCI人格测评】获取，付费测试68元，结果仅供参考。',
      '如需更准确、更深度解读，可联系客服小秘书，由专业的解读师为您解读。'
    ],
    loading: false,
    BASE_URL: config.BASE_URL
  },

  onLoad() {
    this.fetchQuestionnaires();
  },

  fetchQuestionnaires() {
    this.setData({ loading: true });
    console.log('Fetching questionnaires from:', `${config.BASE_URL}/questionnaires?status=published`);
    
    wx.request({
      url: `${config.BASE_URL}/questionnaires?status=published`,
      method: 'GET',
      success: (res) => {
        console.log('API Response Status:', res.statusCode);
        console.log('API Response Data:', res.data);
        
        if (res.statusCode === 200) {
          if (!Array.isArray(res.data)) {
            console.error('API did not return an array:', res.data);
            return;
          }
          
          const list = res.data.map(item => {
            // Parse JSON strings
            let settings = {};
            let wechatConfig = {};
            try {
              settings = item.settings ? (typeof item.settings === 'string' ? JSON.parse(item.settings) : item.settings) : {};
              wechatConfig = item.wechatConfig ? (typeof item.wechatConfig === 'string' ? JSON.parse(item.wechatConfig) : item.wechatConfig) : {};
            } catch (e) {
              console.error('Parse JSON error for item', item.id, e);
            }
            return {
              ...item,
              settings,
              wechatConfig
            };
          });
          
          console.log('Processed questionnaire list:', list);
          
          this.setData({
            questionnaires: list,
            selectedId: list.length > 0 ? list[0].id : null
          });
        } else {
          wx.showModal({
            title: '获取列表失败',
            content: `后端返回状态码: ${res.statusCode}，请检查后端服务是否正常。`,
            showCancel: false
          });
        }
      },
      fail: (err) => {
        console.error('Request failed:', err);
        wx.showModal({
          title: '网络请求错误',
          content: `无法连接到后端服务器 (${config.BASE_URL})。请确认后端已启动，且开发者工具已开启“不校验合法域名”。\n${err.errMsg}`,
          showCancel: false
        });
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  },

  onSelectQuestionnaire(e) {
    const id = e.currentTarget.dataset.id;
    if (id !== this.data.selectedId) {
      this.setData({ selectedId: id });
      if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
    }
  },

  onStart() {
    if (!this.data.selectedId) {
      return wx.showToast({ title: '暂无可用问卷', icon: 'none' });
    }
    wx.navigateTo({
      url: `/pages/assessment/question?id=${this.data.selectedId}`
    });
  },

  onShare() {
    const current = this.data.questionnaires.find(q => q.id === this.data.selectedId);
    return {
      title: current?.wechatConfig?.title || '快来测测你的 DTCI 135型天命人格吧！',
      path: '/pages/assessment/index',
      imageUrl: current?.wechatConfig?.icon ? (current.wechatConfig.icon.startsWith('http') ? current.wechatConfig.icon : `${config.BASE_URL}${current.wechatConfig.icon}`) : ''
    };
  },

  onMyReportTap() {
    wx.switchTab({ url: '/pages/my/index' });
  }
})
