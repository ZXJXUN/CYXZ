Page({
  data: {
    userInfo: null,
    showCodeInput: false,
    showKeyInput: false,
    email: '',
    code: '',
    key: ''
  },

  onInputEmail: function(e) {
    this.setData({
      email: e.detail.value // 确保更新邮箱值
    });
  },

  sendVerificationCode: function() {
    const emailPattern = /^[0-9]+@buaa\.edu\.cn$/;//confirm bh email
    if (this.data.email && emailPattern.test(this.data.email)) {
      this.setData({ showCodeInput: true });
      // API
      wx.request({
        url: '', // url
        method: 'POST',
        data: {
            email: this.data.email,
            code: this.data.code
        },
        success: (res) => {
            if (res.data.success) {
                this.setData({ showCodeInput: true });
                wx.showToast({
                    title: '验证码已发送',
                    icon: 'success'
                });
            } else {
                wx.showToast({
                    title: '发送失败，请重试',
                    icon: 'none'
                });
            }
        },
        fail: () => {
            wx.showToast({
                title: '网络错误，请重试',
                icon: 'none'
            });
        }
    });
      
    } else {
      wx.showToast({
        title: '请输入正确北航邮箱地址',
        icon: 'none'
      });
    }
  },

  onInputCode: function(e) {
    this.setData({
      code: e.detail.value
    });
  },

  confirmCode: function() {
    //update Code to server and recieve T or F
    if (this.data.code) {//lack of &&Confirm
      this.setData({ showKeyInput: true });
      // 此处可以添加验证验证码的逻辑
      wx.showToast({
        title: '验证码验证成功',
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      });
    }
  },



  onInputKey: function(e) {
    this.setData({
      key: e.detail.value
    });
  },

  confirmKey: function() {
    if (this.data.key) {
        console.log('Key is valid, proceeding to registration...');
        wx.showToast({
            title: '注册成功！',
            icon: 'success'
        });
        
        setTimeout(() => {
            console.log('Navigating to home page...');
            wx.navigateTo({
                url: '../home/home'//sth wrong
            });
        }, 500);
    } else {
        wx.showToast({
            title: '请输入密码',
            icon: 'none'
        });
    }
  }
});
