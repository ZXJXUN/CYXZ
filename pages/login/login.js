Page({
  data: {
    userInfo: null,
    showCodeInput: false,
    email: '',
    code: ''
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
  },
  onInputPhone: function(e) {
    this.setData({
      email
      : e.detail.value
    });
  },

  sendVerificationCode: function() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@buaa\.edu\.cn$/;//confirm bh email
    if (this.data.email && emailPattern.test(this.data.email)) {
      this.setData({ showCodeInput: true });
      // API
      wx.request({
        url: '', // url
        method: 'POST',
        data: {
            email: this.data.email,
            code: verificationCode
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
    if (this.data.code) {
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
  }
});
