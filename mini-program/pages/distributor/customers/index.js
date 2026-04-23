const app = getApp();

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    activeTab: 0,
    customers: [],
    stats: {
      regCount: 0,
      testCount: 0,
      payCount: 0,
      percent: '0%'
    }
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync();
    const menuButton = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = (胶囊底部高度 - 状态栏高度) + (胶囊顶部高度 - 状态栏高度)
    const navBarHeight = (menuButton.top - sysInfo.statusBarHeight) * 2 + menuButton.height;
    
    this.setData({
      statusBarHeight: sysInfo.statusBarHeight,
      navHeight: sysInfo.statusBarHeight + navBarHeight,
      navBarHeight: navBarHeight
    });
  },

  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({ activeTab: index });
    // In real app, fetch filtered list from backend
  },

  onBackTap() {
    wx.navigateBack();
  }
});
