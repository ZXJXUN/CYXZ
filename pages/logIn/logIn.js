// pages/login/login.js
Page({
  data: {
    account: '',
    password: '',
    isAccountValid: false,
    showPassword: false
  },

  // 监听账号输入框的输入事件
  onInputAccount: function (e) {
    const account = e.detail.value;
    this.setData({
      account: account
    });
    // 验证账号格式是否符合要求
    const accountPattern = /^(2137|2237|2337|2437)\d{4}$/;
    this.setData({
      isAccountValid: accountPattern.test(account)
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
    if (this.data.isAccountValid && this.data.password) {
      // 这里可以添加实际的登录验证逻辑，比如向服务器发送请求验证账号和密码
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
      setTimeout(() => {
        console.log('Navigating to home page...');
        wx.navigateBack();
    }, 500);
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