const app = getApp();

Page({
  data: {
    statusBarHeight: 20,
    navHeight: 64,
    navBarHeight: 44,
    posterUrl: '',
    scores: {
      A1: [8, 6, 11, 9.5, 11, 8, 6, 6],
      A2: [9.5, 6, 10.5, 7, 10.5, 6, 7, 10.5],
      B1: [9.5, 11, 8.5, 10.5, 10.5, 8, 11, 10]
    },
    userInfo: null,
    isGenerating: false
  },

  onLoad() {
    this.initNavHeight();
    this.initData();
  },

  onReady() {
    setTimeout(() => {
      this.generatePoster();
    }, 800);
  },

  initNavHeight() {
    const sysInfo = wx.getSystemInfoSync();
    const menuButton = wx.getMenuButtonBoundingClientRect();
    const navBarHeight = (menuButton.top - sysInfo.statusBarHeight) * 2 + menuButton.height;
    this.setData({
      statusBarHeight: sysInfo.statusBarHeight,
      navHeight: sysInfo.statusBarHeight + navBarHeight,
      navBarHeight: navBarHeight
    });
  },

  initData() {
    const stored = app.globalData.userInfo || wx.getStorageSync('userInfo');
    this.setData({
      userInfo: {
        nickName: stored?.nickName || stored?.nickname || '分销员',
        avatar: stored?.avatarUrl || stored?.avatar || '/assets/images/logo.png',
        id: stored?.id || stored?.openid || '888'
      }
    });
  },

  onBackTap() { wx.navigateBack(); },

  loadImg(canvas, src) {
    return new Promise((resolve, reject) => {
      const img = canvas.createImage();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  },

  async generatePoster() {
    this.setData({ isGenerating: true });
    const query = wx.createSelectorQuery();
    query.select('#posterCanvas')
      .fields({ node: true, size: true })
      .exec(async (res) => {
        if (!res[0]) return;
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;

        canvas.width = 750 * dpr;
        canvas.height = 1334 * dpr;
        ctx.scale(dpr, dpr);

        try {
          // 动态生成包含分销商 ID 的分享链接码 (暂时使用占位二维码服务)
          const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent('https://dtci.com/share/' + (this.data.userInfo?.id || '888'));
          const qrImg = await this.loadImg(canvas, qrUrl);

          ctx.fillStyle = '#BFDCFA';
          ctx.fillRect(0, 0, 750, 1334);
          this.drawTopSection(ctx, qrImg);
          this.drawMainCard(ctx);
          this.drawFooter(ctx);

          wx.canvasToTempFilePath({
            canvas,
            success: (res) => {
              this.setData({ posterUrl: res.tempFilePath, isGenerating: false });
            },
            fail: (err) => {
              console.error('Canvas导出失败:', err);
              this.setData({ isGenerating: false });
            }
          });
        } catch (e) {
          console.error('海报生成抛错:', e);
          this.setData({ isGenerating: false });
        }
      });
  },

  drawTopSection(ctx, qrImg) {
    const left = 40, top = 50;
    this.drawRoundRect(ctx, left, top, 180, 180, 20, '#FFFFFF');
    ctx.drawImage(qrImg, left + 10, top + 10, 160, 160);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('事业、婚恋、亲子关系卡点是什么？', 240, 95);
    ctx.fillStyle = '#1D4ED8'; 
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('天命人格又是什么？', 240, 145);
    ctx.fillStyle = '#FF5A36';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText('5分钟！', 240, 205);
    ctx.fillStyle = '#334155';
    ctx.font = '30px sans-serif';
    ctx.fillText('看清自己的人生操作系统！', 370, 205);
  },

  drawMainCard(ctx) {
    const cardX = 40, cardY = 260, cardW = 670, cardH = 920;
    this.drawRoundRect(ctx, cardX, cardY, cardW, cardH, 20, '#FFFFFF');
    const margin = 20, secW = (cardW - margin * 4) / 3, secY = cardY + 100, secH = 500;
    this.drawSubSection(ctx, cardX + margin, secY, secW, secH, 'A1', '商业模式', this.data.scores.A1, '#60A5FA');
    this.drawSubSection(ctx, cardX + margin*2 + secW, secY, secW, secH, 'A2', '经营状况', this.data.scores.A2, '#60A5FA');
    this.drawSubSection(ctx, cardX + margin*3 + secW*2, secY, secW, secH, 'B1', '创业状态', this.data.scores.B1, '#FBBF24');
    this.drawBottomFeature(ctx, cardX + margin, cardY + 630, cardW - margin*2, 250);
  },

  drawSubSection(ctx, x, y, w, h, id, title, data, color) {
    ctx.strokeStyle = '#E2E8F0';
    ctx.strokeRect(x, y - 50, w, 50);
    ctx.fillStyle = '#1D4ED8';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(id, x + 10, y - 15);
    ctx.fillStyle = '#1E293B';
    ctx.font = '22px sans-serif';
    ctx.fillText(title, x + 60, y - 15);
    ctx.strokeRect(x, y, w, h);
    const barW = w / (data.length * 2);
    for(let i=0; i<data.length; i++) {
      const bh = (data[i] / 12) * (h - 100);
      const bx = x + i * (barW * 2) + barW/2, by = y + h - bh;
      const grad = ctx.createLinearGradient(0, by, 0, y + h);
      grad.addColorStop(0, color); grad.addColorStop(1, '#FFFFFF');
      ctx.fillStyle = grad;
      this.drawRoundRect(ctx, bx, by, barW, bh, 2, grad);
      if(data[i] > 10) {
        ctx.fillStyle = '#EF4444';
        ctx.font = '16px serif';
        ctx.fillText('★', bx, by - 5);
      }
    }
  },

  drawBottomFeature(ctx, x, y, w, h) {
    ctx.strokeStyle = '#E2E8F0'; ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = '#1D4ED8'; ctx.font = 'bold 32px sans-serif';
    ctx.fillText('C1', x + 10, y + 40);
    ctx.fillStyle = '#1E293B'; ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center'; ctx.fillText('核心优势', x + w/2, y + 40);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(x + 20, y + 60, w/2 - 40, h - 80);
    ctx.fillRect(x + w/2 + 20, y + 60, w/2 - 40, h - 80);
  },

  drawFooter(ctx) {
    ctx.textAlign = 'right';
    ctx.fillStyle = '#64748B';
    ctx.font = '16px sans-serif';
    ctx.fillText('Zeyu Consulting System,CN', 710, 1260);
    ctx.fillText('Zeyu System.1.0.2021', 710, 1290);
  },

  drawRoundRect(ctx, x, y, width, height, radius, fillStyle) {
    ctx.beginPath(); ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    if (fillStyle) { ctx.fillStyle = fillStyle; ctx.fill(); }
  },

  savePosterToAlbum() {
    if (this.data.isGenerating) {
      wx.showLoading({ title: '正在生成中...' });
      setTimeout(() => wx.hideLoading(), 2000);
      return;
    }
    if (!this.data.posterUrl) {
      wx.showToast({ title: '海报还在准备中', icon: 'none' });
      return;
    }

    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.writePhotosAlbum'] === false) {
          wx.showModal({
            title: '提示',
            content: '需要开启相册权限才能保存海报',
            success: (modalRes) => {
              if (modalRes.confirm) wx.openSetting();
            }
          });
        } else {
          this.doSaveImage();
        }
      }
    });
  },

  doSaveImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterUrl,
      success: () => {
        wx.showToast({ title: '海报已保存', icon: 'success' });
      },
      fail: (err) => {
        if (err.errMsg.indexOf('cancel') === -1) {
          wx.showToast({ title: '保存失败', icon: 'none' });
        }
      }
    });
  },

  copyInviteLink() {
    const inviteUrl = 'https://dtci.com/share/' + (this.data.userInfo?.id || '888');
    wx.setClipboardData({
      data: inviteUrl,
      success: () => {
        // 微信自带提示，但我们可以二次确认或统计
        console.log('复制成功:', inviteUrl);
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '发现一个超级准的天命人格测评，快来！',
      path: '/pages/index/index?from=' + (this.data.userInfo?.id || ''),
      imageUrl: this.data.posterUrl
    };
  }
});
