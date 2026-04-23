const app = getApp();
const config = require('../../../config');

Page({
  data: {
    userInfo: {
      nickName: '分销员',
      avatar: '/assets/images/logo.png'
    },
    distributor: {
      level: '铜',
      totalCommission: '0.00',
      settledCommission: '0.00',
      pendingCommission: '0.00'
    },
    commissions: [],
    page: 1,
    limit: 10,
    hasMore: true,
    statusBarHeight: 20,
    navHeight: 64,
    showFilter: false
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync();
    const menuButton = wx.getMenuButtonBoundingClientRect();
    const navBarHeight = (menuButton.top - sysInfo.statusBarHeight) * 2 + menuButton.height;
    
    this.setData({
      statusBarHeight: sysInfo.statusBarHeight,
      navHeight: sysInfo.statusBarHeight + navBarHeight,
      navBarHeight: navBarHeight
    });
  },

  onShow() {
    this.initUserInfo();
    this.fetchDistributorData();
    this.refreshCommissions();
  },

  toggleFilter() {
    this.setData({ showFilter: !this.data.showFilter });
  },

  goToCustomers() {
    wx.navigateTo({ url: '/pages/distributor/customers/index' });
  },

  initUserInfo() {
    const storedUserInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    if (storedUserInfo) {
      this.setData({
        'userInfo.nickName': storedUserInfo.nickName || storedUserInfo.nickname || '包子的饭碗',
        'userInfo.avatar': storedUserInfo.avatar || '/assets/images/logo.png',
        'userInfo.levelName': '铜'
      });
    }
  },

  fetchDistributorData() {
    const storedUserInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    const userId = storedUserInfo ? storedUserInfo.id : 1;

    wx.request({
      url: `${config.BASE_URL}/distributors/user/${userId}`,
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          // 统一等级与风格映射
          const rawLevel = res.data.level || '铜';
          const styleMap = { '铜': 'bronze', '银': 'silver', '金': 'gold', 'Bronze': 'bronze', 'Silver': 'silver', 'Gold': 'gold' };
          const nameMap = { 'Bronze': '铜', 'Silver': '银', 'Gold': '金', 'bronze': '铜', 'silver': '银', 'gold': '金', '铜': '铜', '银': '银', '金': '金' };
          
          const levelKey = styleMap[rawLevel] || 'bronze';
          const displayName = nameMap[rawLevel] || rawLevel;

          this.setData({
            distributor: res.data,
            levelClass: 'level-' + levelKey,
            'userInfo.levelName': displayName,
            // 额外记录当前主色调
            activeColor: levelKey === 'bronze' ? '#2B2D7C' : (levelKey === 'silver' ? '#1A3D68' : '#5C441E')
          });
        }
      }
    });
  },

  refreshCommissions() {
    this.setData({ page: 1, commissions: [], hasMore: true }, () => {
      this.loadCommissions();
    });
  },

  loadCommissions() {
    if (!this.data.hasMore) return;
    wx.showLoading({ title: '加载中' });

    const storedUserInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    const userId = storedUserInfo ? storedUserInfo.id : 1;
    const { page, limit } = this.data;

    wx.request({
      url: `${config.BASE_URL}/distributors/user/${userId}/commissions?page=${page}&limit=${limit}`,
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200 && res.data) {
          const list = res.data.commissions || [];
          
          // Format date for UI
          list.forEach(item => {
            const d = new Date(item.createdAt);
            item.createdAtStr = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
          });

          this.setData({
            commissions: [...this.data.commissions, ...list],
            hasMore: page < (res.data.totalPages || 0),
            page: page + 1
          });
        }
      },
      fail: () => {
        wx.hideLoading();
      }
    });
  },

  onReachBottom() {
    this.loadCommissions();
  },

  onPullDownRefresh() {
    this.initUserInfo();
    this.fetchDistributorData();
    this.refreshCommissions();
    wx.stopPullDownRefresh();
  },

  onCustomersTap() {
    wx.showToast({ title: '我的客户功能开发中', icon: 'none' });
  },

  onRulesTap() {
    wx.navigateTo({ url: '/pages/distributor/rules/index' });
  },

  onInviteTap() {
    wx.navigateTo({ url: '/pages/distributor/poster/index' });
  },

  onFilterTap() {
    this.setData({ showFilter: true });
  },

  onBackTap() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
    } else {
      wx.reLaunch({ url: '/pages/my/index' });
    }
  }
});
