const app = getApp()
const config = require('../../config')

Page({
  data: {
    feedbackTypes: [
      { label: '功能建议', value: 'suggestion' },
      { label: 'Bug反馈', value: 'bug' },
      { label: '体验问题', value: 'experience' },
      { label: '内容问题', value: 'content' },
      { label: '其他', value: 'other' }
    ],
    selectedType: '',
    content: '',
    images: [],
    contact: ''
  },

  onLoad() {
    // 初始加载
  },

  onGoToHistory() {
    wx.navigateTo({ url: '/pages/feedback/list' })
  },

  onTypeSelect(e) {
    const value = e.currentTarget.dataset.value
    this.setData({
      selectedType: value
    })
  },

  onContentInput(e) {
    this.setData({
      content: e.detail.value
    })
  },

  onContactInput(e) {
    this.setData({
      contact: e.detail.value
    })
  },

  onUploadImage() {
    wx.chooseImage({
      count: 3 - this.data.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: [...this.data.images, ...res.tempFilePaths]
        })
      }
    })
  },

  onDeleteImage(e) {
    const index = e.currentTarget.dataset.index
    const images = this.data.images.filter((item, i) => i !== index)
    this.setData({ images })
  },

  async onSubmit() {
    if (!this.data.selectedType) {
      wx.showToast({
        title: '请选择反馈类型',
        icon: 'none'
      })
      return
    }

    if (!this.data.content.trim()) {
      wx.showToast({
        title: '请填写问题描述',
        icon: 'none'
      })
      return
    }

    wx.showLoading({ title: '提交中...' })

    try {
      // 1. 上传图片到服务器
      const imageUrls = []
      for (const filePath of this.data.images) {
        // 如果已经是服务器路径（虽然概率低），则跳过
        if (filePath.startsWith('/uploads')) {
          imageUrls.push(filePath)
          continue
        }
        
        const uploadRes = await this.uploadFilePromise(filePath)
        if (uploadRes && uploadRes.url) {
          imageUrls.push(uploadRes.url)
        }
      }

      // 2. 提交反馈数据
      const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}
      const userId = userInfo.id || 1

      wx.request({
        url: `${config.BASE_URL}/feedbacks`,
        method: 'POST',
        data: {
          userId,
          type: this.data.selectedType,
          content: this.data.content,
          images: imageUrls,
          contact: this.data.contact
        },
        success: (res) => {
          wx.hideLoading()
          if (res.statusCode === 201) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(() => {
              wx.navigateBack()
            }, 2000)
          } else {
            wx.showToast({
              title: '提交失败，请重试',
              icon: 'none'
            })
          }
        },
        fail: () => {
          wx.hideLoading()
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
        }
      })
    } catch (err) {
      wx.hideLoading()
      console.error('Upload Error:', err)
      wx.showToast({
        title: '图片上传失败',
        icon: 'none'
      })
    }
  },

  // 上传文件 Promise 封装
  uploadFilePromise(filePath) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${config.BASE_URL}/uploads`,
        filePath: filePath,
        name: 'file',
        success: (res) => {
          if (res.statusCode === 201 || res.statusCode === 200) {
            resolve(JSON.parse(res.data))
          } else {
            reject(new Error('Upload failed with status ' + res.statusCode))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  onHistoryTap(e) {
    const id = e.currentTarget.dataset.id
    wx.showToast({
      title: '查看反馈详情',
      icon: 'none'
    })
  }
})
