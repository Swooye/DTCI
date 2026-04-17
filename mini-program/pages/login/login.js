const app = getApp();
const config = require('../../config');

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

  // 手机号授权回调
  onGetPhoneNumber(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      if (e.detail.errMsg.indexOf('cancel') !== -1) {
        wx.showToast({ title: '已取消授权', icon: 'none' });
      } else {
        wx.showToast({ title: '授权失败: ' + e.detail.errMsg, icon: 'none' });
      }
      return;
    }

    const phoneCode = e.detail.code;
    console.log('手机号授权Code:', phoneCode);

    // 开始登录流程
    wx.showLoading({ title: '登录中...', mask: true });

    wx.login({
      success: (loginRes) => {
        if (loginRes.code) {
          // 调用后端登录接口 (带上 phoneCode)
          wx.request({
            url: `${config.BASE_URL}/auth/login`,
            method: 'POST',
            data: {
              code: loginRes.code,
              phoneCode: phoneCode
            },
            success: (res) => {
              if (res.statusCode === 201 || res.statusCode === 200) {
                this.saveLoginData(res.data);
              } else {
                wx.hideLoading();
                wx.showToast({ title: '登录失败: ' + (res.data.message || res.statusCode), icon: 'none' });
              }
            },
            fail: (err) => {
              wx.hideLoading();
              wx.showToast({ title: '连接服务器失败', icon: 'none' });
            }
          });
        }
      }
    });
  },

  // 微信登录（仅做兜底/校验，主力由 onGetPhoneNumber 完成）
  onWechatLogin() {
    if (!this.data.isAgreed) {
      return wx.showToast({ title: '请先阅读并同意用户协议', icon: 'none' });
    }
    // 注意：如果协议已勾选，wxml 会切换到 <button open-type="getPhoneNumber">，此处不会被触发
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
