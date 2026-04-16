Page({
  data: {
    formData: {
      gender: 'male',
      age: '',
      education: '',
      profession: '',
      marriage: ''
    },
    isFormValid: false,
    benefitList: [
      '你是什么性格', '约2000字解读报告', '职业优势',
      '性格优势劣势', '事业类型与卡点', '天命人格',
      '性格气质类型', '婚恋关系模式', '婚恋关系卡点',
      '工作中的状态', '亲子关系状态', '生命成长建议'
    ],
    eduOptions: ['初中及以下', '高中/中专', '大专', '本科', '硕士', '博士及以上'],
    marriageOptions: ['单身', '恋爱中', '已婚', '离异', '丧偶']
  },

  onGenderChange(e) {
    this.setData({ 'formData.gender': e.detail.value }, this.checkValidity);
  },

  onAgeChange(e) {
    this.setData({ 'formData.age': e.detail.value }, this.checkValidity);
  },

  onEduChange(e) {
    this.setData({ 'formData.education': this.data.eduOptions[e.detail.value] }, this.checkValidity);
  },

  onProfessionInput(e) {
    this.setData({ 'formData.profession': e.detail.value }, this.checkValidity);
  },

  onMarriageChange(e) {
    this.setData({ 'formData.marriage': this.data.marriageOptions[e.detail.value] }, this.checkValidity);
  },

  checkValidity() {
    const { age, education, profession, marriage } = this.data.formData;
    const isValid = !!(age && education && profession && marriage);
    this.setData({ isFormValid: isValid });
  },

  onPrev() {
    wx.navigateBack();
  },

  onSubmit() {
    if (!this.data.isFormValid) {
      return wx.showToast({ title: '请先填写以上信息', icon: 'none' });
    }
    
    wx.showLoading({ title: '提交中' });
    setTimeout(() => {
      wx.hideLoading();
      wx.redirectTo({ url: '/pages/assessment/result' });
    }, 1200);
  }
})
