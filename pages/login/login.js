// pages/login/login.js
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
        url: 'http://47.120.26.83:8000/api/answerly/v1/user/login',
        method: 'POST',
        data: {
          username: this.data.account,
          password: this.data.password,
        },
        
        success: (res) => {
          if (res.data.code === '0' && res.data.message === null && res.data.success === true) {
            console.log('登录成功');
            wx.showToast({
              title: '登录成功',
              icon: 'success'
            });
            setTimeout(() => {
              console.log('Navigating to home page...');
              wx.navigateBack();
          }, 500);
          //token设置
          // 获取服务器返回的token
          const token = res.data.data.token;

          // 获取全局应用实例
          const app = getApp();

          // 将token设置到app.js的全局变量中
          app.globalData.token = token;  
          } else {
            wx.showToast({
              title: '重复登陆或其他',
              icon: 'none'});
            console.log('上传失败，错误信息：', res.data);
          }
        },
        fail: (error) => {
          wx.showToast({
            title: '网络错误',
            icon: 'none'});
          console.error('上传题目时发生错误：', error);
        }
      });
        console.log('Key is valid, proceeding to registration...');
        
      
    } else {
      wx.showToast({
        title: '请输入正确格式的账号和密码',
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