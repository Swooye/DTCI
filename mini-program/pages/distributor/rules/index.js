Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sysInfo.statusBarHeight,
      navHeight: sysInfo.statusBarHeight + 44
    });
  },

  onBackTap() {
    wx.navigateBack();
  }
});
