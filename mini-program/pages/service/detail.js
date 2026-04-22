const config = require('../../config')
const contentUtil = require('../../utils/content')

Page({
  data: {
    detail: null,
    BASE_URL: config.BASE_URL
  },

  onLoad(options) {
    const id = options.id;
    if (id) {
      this.fetchDetail(id);
    }
  },

  fetchDetail(id) {
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: `${config.BASE_URL}/services/${id}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          let detail = res.data;
          
          // 使用统一工具处理富文本内容 (默认模式)
          if (detail.content) {
            detail.content = contentUtil.processRichText(detail.content);
          }

          this.setData({ detail });
        }
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  onShare() {
    wx.showActionSheet({
      itemList: ['分享到朋友圈', '发送给好友'],
      success(res) {
        wx.showToast({ title: '分享功能开发中', icon: 'none' });
      }
    });
  },

  onContact() {
    wx.showActionSheet({
      itemList: ['拨打电话: 400-123-4567', '打开在线客服'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.makePhoneCall({ phoneNumber: '4001234567' });
        } else {
          wx.showToast({ title: '正在连接客服...', icon: 'none' });
        }
      }
    });
  }
})
