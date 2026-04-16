const app = getApp();

Page({
  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '您确定要退出登录吗？',
      confirmColor: '#FF6B35',
      success (res) {
        if (res.confirm) {
          wx.showLoading({ title: '正在退出' });
          setTimeout(() => {
            // 更新全局状态与持久化缓存
            app.globalData.isLogin = false;
            wx.setStorageSync('isLogin', false);
            
            wx.hideLoading();
            wx.navigateBack({
              success: () => {
                wx.showToast({ title: '已退出登录', icon: 'none' });
              }
            });
          }, 800);
        }
      }
    });
  }
})
