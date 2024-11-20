Page({
  data: {
    userInfo: null,
    showCodeInput: false,
    showNameInput: false,
    showKeyInput: false,
    email: '',
    code: '',
    name: '',
    key: ''
  },

  onInputEmail: function(e) {
    this.setData({
      email: e.detail.value // 确保更新邮箱值
    });
  },

  sendVerificationCode: function() {
    const emailPattern = /^[a-zA-Z0-9]+@buaa.edu.cn$/; 
    const that = this;
    if (this.data.email && emailPattern.test(this.data.email)) {
      const dataToSend = {
        mail: this.data.email
      };
      console.log(this.data);
      wx.request({
        url: 'http://47.120.26.83:8000/api/answerly/v1/user/send-code', 
        method: 'POST',
        data: dataToSend,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded' 
        },

        success(res) {
          if (res.statusCode === 200) {
            that.setData({ showCodeInput: true });
            wx.showToast({
              title: '发送成功',
              icon: 'success'
            });
            console.log('验证码发送请求已成功发送到服务器');
          } else {
            wx.showToast({
              title: '请重试',
              icon: 'none'
            });
            console.log('验证码发送请求失败，状态码：', res.statusCode);
          }
        },
        fail(err) {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          });
          console.log('验证码发送请求失败：', err);
        }
      })
    }else{
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
        url: 'http://47.120.26.83:8000/api/answerly/v1/user',
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
                url: '../logIn/logIn'
              });
          }, 500);
            
          } else {
            wx.showToast({
              title: '验证码错误或用户名重复',
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


