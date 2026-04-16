const app = getApp();

Page({
  data: {
    avatarUrl: '/assets/images/default-avatar.png',
    nickName: '',
    genderIndex: -1,
    genderOptions: ['男', '女', '保密'],
    city: '',
    phoneCode: '',
    phoneDisplay: '',
    hasPhone: false
  },

  onLoad() {
    this.loadUserInfo();
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
    
    let genderIndex = -1;
    if (userInfo.gender) {
      const idx = this.data.genderOptions.indexOf(userInfo.gender);
      if (idx !== -1) genderIndex = idx;
    }

    this.setData({
      avatarUrl: userInfo.avatar || '/assets/images/default-avatar.png',
      nickName: userInfo.nickName || '',
      genderIndex: genderIndex,
      city: userInfo.city || '',
      phoneCode: userInfo.phoneCode || '',
      phoneDisplay: userInfo.phone || '',
      hasPhone: !!userInfo.phone
    });
  },

  // 选择头像
  onChooseAvatar(e) {
    console.log('选择头像:', e.detail);
    const { avatarUrl } = e.detail;
    if (avatarUrl) {
      this.setData({ avatarUrl });
    }
  },

  // 昵称输入
  onNicknameInput(e) {
    this.setData({ nickName: e.detail.value });
  },

  // 昵称失焦（微信自动填充）
  onNicknameBlur(e) {
    if (e.detail.value) {
      this.setData({ nickName: e.detail.value });
    }
  },

  // 性别选择
  onGenderChange(e) {
    this.setData({
      genderIndex: e.detail.value
    });
  },

  // 城市输入
  onCityInput(e) {
    this.setData({ city: e.detail.value });
  },

  // 获取手机号回调
  onGetPhoneNumber(e) {
    console.log('手机号授权回调:', e.detail);
    
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      const code = e.detail.code;
      if (code) {
        // 显示部分手机号（实际需要后端解密返回）
        this.setData({
          phoneCode: code,
          phoneDisplay: '已绑定',
          hasPhone: true
        });
        wx.showToast({
          title: '手机号获取成功',
          icon: 'success'
        });
      }
    } else {
      console.log('获取手机号失败:', e.detail.errMsg);
      if (e.detail.errMsg.indexOf('cancel') !== -1) {
        wx.showToast({
          title: '已取消',
          icon: 'none'
        });
      }
    }
  },

  // 保存
  onSave() {
    const { nickName, genderIndex, genderOptions, city, phoneCode, phoneDisplay } = this.data;
    
    // 昵称必填
    if (!nickName) {
      return wx.showToast({ title: '请输入昵称', icon: 'none' });
    }

    wx.showLoading({ title: '保存中...' });

    // 构建用户信息
    const userInfo = {
      nickName: nickName,
      avatar: this.data.avatarUrl,
      gender: genderIndex >= 0 ? genderOptions[genderIndex] : '',
      city: city,
      phoneCode: phoneCode,
      phone: phoneDisplay
    };

    // 保存到全局和存储
    app.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);

    wx.hideLoading();
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });
  }
})
