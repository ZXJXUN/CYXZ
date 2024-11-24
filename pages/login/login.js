const app = getApp();
Page({
  data: {
    account: '',
    password: '',
    showPassword: false
  },

  // 监听账号输入框的输入事件
  onInputAccount: function (e) {
    const account = e.detail.value;
    this.setData({
      account: account
    });
  },

  // 监听密码输入框的输入事件
  onInputPassword: function (e) {
    this.setData({
      password: e.detail.value
    });
  },

  // 切换密码显示状态（显示/隐藏）
  toggleShowPassword: function () {
    this.setData({
      showPassword:!this.data.showPassword
    });
  },

  // 处理登录按钮点击事件
  onLogin: function () {
    
    if (this.data.password && this.data.account) {
      wx.request({
        url: 'https://47.120.26.83:8000/api/answerly/v1/user/login',
        method: 'POST',
        data: {
          username: this.data.account,
          password: this.data.password,
        },
        
        success: (res) => {
          
          if (res.data.success === true) {
            console.log('登录成功');
            console.log(res.data);
            app.globalData.isLoggedIn = true;
            wx.showToast({
              title: '登录成功',
              icon: 'success'
            });
            setTimeout(() => {
              wx.navigateBack({
                url: '../index/index',
              });
          }, 500);
          
          const token = res.data.data.token;
          const name = this.data.account;

          app.globalData.token = token;  
          app.globalData.name = name;
          console.log(app.globalData.token);
          } else if(res.data.code === 'A000203') {
            app.globalData.isLoggedIn = true;
            wx.showToast({
              title: '登录成功',
              icon: 'success'
            });
            setTimeout(() => {
              wx.navigateBack({
                url: '../index/index',
              });
          }, 500);
          }
          else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'});
              const app = getApp();
            console.log('上传失败，错误信息：', res.data);
            console.log(app.globalData.token);
          }
        },
        fail: (error) => {
          wx.showToast({
            title: res.data.message,
            icon: 'none'});
          console.error('上传发生错误：', error);
        }
      });
        console.log('Key is valid, proceeding to registration...');
        
      
    } else {
      wx.showToast({
        title: res.data.message,
        icon: 'none'
      });
    }
  },

  // 处理注册按钮点击事件，跳转到注册页面
  onRegister: function () {
    wx.navigateTo({
      url: '../register/register'
    });
  }
})