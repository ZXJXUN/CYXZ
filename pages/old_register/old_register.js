Page({
  data: {
    userInfo: null,
    showCodeInput: false,
    showNameInput: false,
    showKeyInput: false,
    email: '',
    code: '',
    name: '',
    key: '',
    lastSendTime: null, // 上一次发送验证码的时间
    isCodeButtonDisabled: false, // 控制按钮禁用状态
    countDownText: '发送验证码', // 显示的按钮文本
    countdown: 30, // 倒计时初始值
    countdownInterval: null // 保存倒计时定时器
  },

  onInputEmail: function(e) {
    this.setData({
      email: e.detail.value // 确保更新邮箱值
    });
  },

  sendVerificationCode: function() {
    const emailPattern = /^.*@buaa.edu.cn$/;
    const that = this;
    const currentTime = Date.now();
    const lastSendTime = that.data.lastSendTime || 0;
    const timeDiff = 30000 - (currentTime - lastSendTime);
  
    if (timeDiff > 0) {
      wx.showToast({
        title: `请${Math.ceil(timeDiff / 1000)}秒后再试`,
        icon: 'none'
      });
      return; // Prevent sending request
    }
  
    if (this.data.email && emailPattern.test(this.data.email)) {
      const dataToSend = {
        mail: this.data.email
      };
      
      // Disable button and start countdown
      that.setData({
        isCodeButtonDisabled: true,
        countdown: 30,
        countDownText: '30秒后重试'
      });
  
      // Start countdown
      const countdownInterval = setInterval(() => {
        let countdown = that.data.countdown;
        countdown--;
        that.setData({
          countdown: countdown,
          countDownText: `${countdown}秒后重试`
        });
  
        if (countdown <= 0) {
          clearInterval(countdownInterval); // Clear countdown
          that.setData({
            isCodeButtonDisabled: false, // Enable button
            countDownText: '发送验证码' // Reset button text
          });
        }
      }, 1000);
  
      that.setData({
        countdownInterval: countdownInterval,
        lastSendTime: Date.now() // Update last send time
      });
  
      wx.request({
        url: 'https://nurl.top:8000/api/answerly/v1/user/send-code',
        method: 'POST',
        data: dataToSend,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (res.statusCode === 200) {
            that.setData({
              showCodeInput: true,
              lastSendTime: Date.now() // Update last send time
            });
            wx.showToast({
              title: '发送成功',
              icon: 'success'
            });
            console.log('验证码发送请求已成功发送到服务器');
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            });
            console.log('验证码发送请求失败，状态码：', res.statusCode);
          }
        },
        fail(err) {
          wx.showToast({
            title: '发送失败，请重试',
            icon: 'none'
          });
          console.log('验证码发送请求失败：', err);
        }
      });
    } else {
      wx.showToast({
        title: '请输入正确的北航邮箱',
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
    if (this.data.code) {//lack of &&Confirm
      this.setData({ showNameInput: true });
      // 此处可以添加验证验证码的逻辑
    } else {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      });
    }
  },

  onInputName: function(e) {
    this.setData({
      name: e.detail.value
    });
  },

  confirmName: function() {
    if (this.data.name) {//lack of &&Confirm
      this.setData({ showKeyInput: true });
      wx.showToast({
        title: '请记住你的用户名哦~',
        icon: 'none'});
    } else {
      wx.showToast({
        title: '请输入用户名',
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
      wx.request({
        url: 'https://nurl.top:8000/api/answerly/v1/user',
        method: 'POST',
        data: {
          username: this.data.name,
          password: this.data.key,
          mail: this.data.email,
          code: this.data.code
        },
        
        success: (res) => {
          if (res.data.code === '0' && res.data.message === null && res.data.data === null && res.data.success === true) {
            console.log('上传成功');
            wx.showToast({
              title: '注册成功！',
              icon: 'success'
          });
          
          setTimeout(() => {
              console.log('Navigating to home page...');
              wx.navigateTo({
                url: '../login/login'
              });
          }, 500);
            
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'});
            console.log('上传失败，错误信息：', res.data);
          }
        },
        fail: (error) => {
          console.error('上传题目时发生错误：', error);
        }
      });
        console.log('Key is valid, proceeding to registration...');
        
    } else {
        wx.showToast({
            title: '请输入密码',
            icon: 'none'
        });
    }
  }
});



