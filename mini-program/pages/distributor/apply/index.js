const app = getApp();
const config = require('../../../config');

Page({
  data: {
    formData: {
      realName: '',
      phone: '',
      birthday: '',
      address: '',
      alipayAccount: ''
    }
  },

  onLoad() {
    // Initialization
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },

  onDateChange(e) {
    this.setData({
      'formData.birthday': e.detail.value
    });
  },

  onSubmit() {
    const { realName, phone, alipayAccount } = this.data.formData;
    if (!realName) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    if (!phone) {
      wx.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }
    if (!alipayAccount) {
      wx.showToast({ title: '请输入结算账号', icon: 'none' });
      return;
    }

    const storedUserInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    const userId = storedUserInfo ? storedUserInfo.id : 1;

    wx.showLoading({ title: '提交中...' });
    wx.request({
      url: `${config.BASE_URL}/distributors/apply`,
      method: 'POST',
      data: {
        userId,
        ...this.data.formData
      },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 201 || res.statusCode === 200) {
          wx.showModal({
            title: '提示',
            content: '渠道申请成功！',
            showCancel: false,
            confirmColor: '#333333',
            success: () => {
              wx.navigateBack();
            }
          });
        } else {
          wx.showToast({
            title: res.data.message || '申请失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  }
});
