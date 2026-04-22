const config = require('../../config');

Page({
  data: {
    questionnaireId: '',
    name: '',
    currentIndex: 0,
    totalCount: 0,
    questions: [],
    currentQuestion: null,
    options: [],
    selectedId: '',
    answers: {}, // 存储用户的回答 { questionId: optionId }
    loading: true,
    benefits: [
      '你是什么性格', '约2000字解读报告', '职业优势',
      '性格优势劣势', '事业类型与卡点', '天命人格',
      '性格气质类型', '婚恋关系模式', '婚恋关系卡点',
      '工作中的状态', '亲子关系状态', '生命成长建议'
    ]
  },

  onLoad(options) {
    const id = options.id;
    if (id) {
      this.setData({ questionnaireId: id });
      this.fetchQuestionnaire(id);
    } else {
      wx.showModal({
        title: '错误',
        content: '未找到问卷信息',
        showCancel: false,
        success: () => wx.navigateBack()
      });
    }
  },

  fetchQuestionnaire(id) {
    wx.showLoading({ title: '加载题目中...' });
    wx.request({
      url: `${config.BASE_URL}/questionnaires/${id}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          const questionnaire = res.data;
          let questions = [];
          let settings = {};
          try {
            questions = typeof questionnaire.questions === 'string' 
              ? JSON.parse(questionnaire.questions) 
              : questionnaire.questions;
              
            settings = typeof questionnaire.settings === 'string'
              ? JSON.parse(questionnaire.settings)
              : questionnaire.settings || {};
              
            if (settings.randomization) {
              for (let i = questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [questions[i], questions[j]] = [questions[j], questions[i]];
              }
            }
          } catch (e) {
            console.error('Parse payload error:', e);
          }

          if (questions.length > 0) {
            this.setData({
              name: questionnaire.name,
              questions: questions,
              totalCount: questions.length,
              loading: false
            });
            this.updateCurrentQuestion();
          } else {
            this.handleLoadError('该问卷暂无题目');
          }
        } else {
          this.handleLoadError('获取问卷失败');
        }
      },
      fail: (err) => {
        console.error('Fetch questionnaire error:', err);
        this.handleLoadError('网络请求失败');
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  handleLoadError(msg) {
    wx.showModal({
      title: '提醒',
      content: msg,
      showCancel: false,
      success: () => wx.navigateBack()
    });
  },

  updateCurrentQuestion() {
    const { questions, currentIndex, answers } = this.data;
    const currentQuestion = questions[currentIndex];
    
    this.setData({
      currentQuestion: currentQuestion,
      options: currentQuestion.options || [],
      // 如果之前回答过，回显选中项
      selectedId: answers[currentQuestion.id] || ''
    });
  },

  onSelectOption(e) {
    const optionId = e.currentTarget.dataset.id;
    const { currentQuestion, answers } = this.data;
    
    // 记录回答
    const newAnswers = { ...answers, [currentQuestion.id]: optionId };
    
    this.setData({ 
      selectedId: optionId,
      answers: newAnswers
    });

    // 选中后自动跳下一题（提升体验，如果是多选题则不应自动跳）
    setTimeout(() => {
      this.onNext();
    }, 300);
  },

  onPrev() {
    if (this.data.currentIndex > 0) {
      this.setData({
        currentIndex: this.data.currentIndex - 1
      }, () => {
        this.updateCurrentQuestion();
      });
    }
  },

  onNext() {
    const { currentIndex, totalCount, selectedId } = this.data;
    
    if (!selectedId) {
      return wx.showToast({ title: '请选择一个选项', icon: 'none' });
    }
    
    if (currentIndex < totalCount - 1) {
      this.setData({
        currentIndex: currentIndex + 1
      }, () => {
        this.updateCurrentQuestion();
      });
    } else {
      // 最后一题提交
      this.submitAnswers();
    }
  },

  submitAnswers() {
    // 暂时跳转到信息收集页
    wx.redirectTo({ 
      url: `/pages/assessment/info?id=${this.data.questionnaireId}` 
    });
  }
})
