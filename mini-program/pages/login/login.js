const app = getApp();

Page({
  data: {
    isAgreed: false
  },

  // 协议勾选变更
  onAgreementChange(e) {
    const values = e.detail.value;
    this.setData({
      isAgreed: values.indexOf('agree') !== -1
    });
  },

  // 微信登录（静默登录，只获取code）
  onWechatLogin() {
    // 1. 协议校验
    if (!this.data.isAgreed) {
      return wx.showToast({ title: '请先阅读并同意用户协议', icon: 'none' });
    }

    // 2. 显示加载
    wx.showLoading({ title: '登录中...', mask: true });

    // 3. 获取登录凭证
    wx.login({
      success: (loginRes) => {
        if (loginRes.code) {
          console.log('登录code:', loginRes.code);
          
          // 4. 构建基础用户信息
          const userInfo = {
            nickName: '微信用户',
            avatar: '/assets/images/default-avatar.png',
            code: loginRes.code
          };
          
          // 5. 保存登录状态
          this.saveLoginData(userInfo);
        } else {
          wx.hideLoading();
          wx.showToast({ title: '获取登录凭证失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络异常', icon: 'none' });
      }
    });
  },

  saveLoginData(userInfo) {
    console.log('保存用户信息:', userInfo);
    
    // 保存用户信息到全局变量和本地存储
    app.globalData.isLogin = true;
    app.globalData.userInfo = userInfo;
    wx.setStorageSync('isLogin', true);
    wx.setStorageSync('userInfo', userInfo);
    
    // 跳转到首页
    wx.reLaunch({
      url: '/pages/home/home',
      success: () => {
        wx.showToast({ title: '登录成功', icon: 'success' });
      },
      fail: () => {
        wx.switchTab({
          url: '/pages/home/home'
        });
      }
    });
  },

  showAgreement() {
    wx.showModal({ 
      title: '用户协议', 
      content: '此处为用户协议详细内容...', 
      showCancel: false 
    });
  },

  showPrivacy() {
    wx.showModal({ 
      title: '隐私政策', 
      content: '此处为隐私政策详细内容...', 
      showCancel: false 
    });
  }
})
