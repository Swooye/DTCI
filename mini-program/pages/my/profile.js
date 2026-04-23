const app = getApp();
const config = require('../../config');

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

    const avatar = userInfo.avatarUrl || userInfo.avatar || '';
    let displayAvatar = '/assets/images/default-avatar.png';
    if (avatar) {
      if (avatar.startsWith('http')) {
        displayAvatar = avatar;
      } else if (avatar.startsWith('/')) {
        displayAvatar = `${config.BASE_URL}${avatar}`;
      }
    }

    this.setData({
      avatarUrl: displayAvatar,
      nickName: userInfo.nickname || userInfo.nickName || '',
      genderIndex: genderIndex,
      city: userInfo.city || '',
      phoneCode: userInfo.phoneCode || '',
      phoneDisplay: userInfo.phone || '',
      hasPhone: !!userInfo.phone
    });
  },

  // 选择头像
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    if (!avatarUrl) return;

    // 立即上传头像到服务器
    wx.showLoading({ title: '上传中...' });
    
    // 使用 base64 方式上传，避免 wx.uploadFile 的各种环境限制
    try {
      const fs = wx.getFileSystemManager();
      const base64 = fs.readFileSync(avatarUrl, 'base64');
      
      // 提取扩展名
      let ext = '.jpg';
      const match = avatarUrl.match(/\.([^.]+)$/);
      if (match) ext = '.' + match[1];

      wx.request({
        url: `${config.BASE_URL}/uploads/base64`,
        method: 'POST',
        data: {
          image: base64,
          extension: ext
        },
        success: (res) => {
          if (res.statusCode === 201 || res.statusCode === 200) {
            const data = res.data;
            if (data.url) {
              const fullUrl = data.url.startsWith('http') ? data.url : `${config.BASE_URL}${data.url}`;
              this.setData({
                avatarUrl: fullUrl
              });
              wx.showToast({ title: '上传成功', icon: 'success' });
            }
          } else {
            console.error('上传头像响应错误:', res);
            wx.showToast({ title: '上传失败', icon: 'none' });
          }
        },
        fail: (err) => {
          console.error('上传头像请求失败:', err);
          wx.showToast({ title: '网络错误', icon: 'none' });
        },
        complete: () => {
          wx.hideLoading();
        }
      });
    } catch (err) {
      console.error('读取头像文件失败:', err);
      wx.hideLoading();
      wx.showToast({ title: '读取文件失败', icon: 'none' });
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

    const userInfo = wx.getStorageSync('userInfo') || {};
    if (!userInfo.id) {
      return wx.showToast({ title: '登录信息失效，请重新登录', icon: 'none' });
    }

    wx.showLoading({ title: '保存中...' });

    // 构建待更新信息
    const updateData = {
      nickName: nickName,
      avatar: this.data.avatarUrl,
      gender: genderIndex >= 0 ? genderOptions[genderIndex] : '',
      city: city,
      phone: phoneDisplay === '已绑定' ? undefined : phoneDisplay // 如果是已绑定则不覆盖
    };

    wx.request({
      url: `${config.BASE_URL}/users/${userInfo.id}`,
      method: 'PATCH',
      data: updateData,
      success: (res) => {
        if (res.statusCode === 200) {
          // 更新本地缓存
          const newUserInfo = { ...userInfo, ...updateData };
          app.globalData.userInfo = newUserInfo;
          wx.setStorageSync('userInfo', newUserInfo);

          wx.showToast({
            title: '保存成功',
            icon: 'success',
            success: () => {
              setTimeout(() => {
                wx.navigateBack();
              }, 1500);
            }
          });
        } else {
          wx.showToast({ title: '保存失败: ' + res.statusCode, icon: 'none' });
        }
      },
      fail: (err) => {
        wx.showToast({ title: '网络请求失败', icon: 'none' });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  }
})
