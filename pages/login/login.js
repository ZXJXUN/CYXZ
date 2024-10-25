Page({
  data: {
    userInfo: null,
  },

  // 获取用户信息
  onGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      // 用户允许授权
      this.setData({
        userInfo: e.detail.userInfo
      });
      // 调用微信登录接口
      this.login();
    } else {
      // 用户拒绝授权
      wx.showToast({
        title: '您拒绝了授权',
        icon: 'none'
      });
    }
  },

  // 微信登录函数
  login: function () {
    wx.login({
      success: res => {
        if (res.code) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: 'https://example.com/login', // 替换为你的后端登录接口
            method: 'POST',
            data: {
              code: res.code,
            },
            success: res => {
              // 处理后端返回的数据
              if (res.data.success) {
                wx.setStorageSync('sessionKey', res.data.sessionKey); // 存储 sessionKey
                // 其他处理，例如导航到主页面
                wx.navigateTo({
                  url: '/pages/home/home',
                });
              } else {
                wx.showToast({
                  title: '登录失败',
                  icon: 'none'
                });
              }
            },
            fail: () => {
              wx.showToast({
                title: '请求失败',
                icon: 'none'
              });
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      }
    });
  },

  // 北航邮箱登录
  loginWithEmail: function () {
    wx.showModal({
      title: '邮箱登录',
      content: '请输入您的北航邮箱和密码', // 或者你可以使用一个输入框来获取信息
      confirmText: '登录',
      success: (res) => {
        if (res.confirm) {
          // 这里假设用户输入的是电子邮件和密码
          // 你可以使用 wx.getUserInput 或自定义模态框获取用户输入
          const email = 'user@example.com'; // 这里应替换为实际获取的用户输入
          const password = 'password'; // 同上

          wx.request({
            url: 'https://example.com/emailLogin', // 替换为你的后端邮箱登录接口
            method: 'POST',
            data: {
              email: email,
              password: password,
            },
            success: res => {
              // 处理后端返回的数据
              if (res.data.success) {
                wx.setStorageSync('sessionKey', res.data.sessionKey); // 存储 sessionKey
                // 其他处理，例如导航到主页面
                wx.navigateTo({
                  url: '/pages/home/home',
                });
              } else {
                wx.showToast({
                  title: '登录失败',
                  icon: 'none'
                });
              }
            },
            fail: () => {
              wx.showToast({
                title: '请求失败',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },

  // 处理北航邮箱登录按钮点击事件
  onEmailLogin: function () {
    this.loginWithEmail();
  }
});
