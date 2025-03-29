const app = getApp();
Page({
  data: {
    account: '',
    password: '',
    // 图片没有准备好
    // showPassword: false,
    captchaTempFile: '',
    cookie: ''
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
  // 监听验证码输入框的输入事件
  onInputCaptcha: function (e) {
    this.setData({
      captcha: e.detail.value
    });
  },

  // 切换密码显示状态（显示/隐藏）
  // 图片没有准备好
  // toggleShowPassword: function () {
  //   this.setData({
  //     showPassword:!this.data.showPassword
  //   });
  // },

  // 处理登录按钮点击事件
  onLogin: function () {
    //信息没有填完整
    if (this.data.password && this.data.account && this.data.captcha) {
      wx.request({
        url: app.globalData.backend + '/api/answerly/v1/user/login',
        method: 'POST',
        header: {
          cookie: this.data.cookie
        },
        data: {
          username: this.data.account,
          password: this.data.password,
          code: this.data.captcha
        },

        success: (res) => {
          //成功登录
          if (res.data.code == 0 && res.data.success === true) {
            wx.showToast({
              title: '登录成功',
              icon: 'success'
            });
            setTimeout(() => {
              wx.navigateBack();
            }, 500);
            wx.setStorageSync('token', res.data.data.cookie);
            wx.setStorageSync('name', this.data.account);
            wx.setStorageSync('isLoggedIn', true);
            // 设置token有效期为30天，将30天换算成秒数
            var expiresInSeconds = 30 * 24 * 60 * 60;

            // 计算过期时间，以当前时间加上有效期的秒数得到过期时间戳
            // 毫秒为单位
            var expirationTime = Date.now() + expiresInSeconds * 1000;
            wx.setStorageSync('expirationTime', expirationTime);
            //看不懂，先注释掉
            // } else if (res.data.code === 'A000203') {
            //   app.globalData.isLoggedIn = true;
            //   wx.setStorageSync('name', this.data.account);
            //   wx.setStorageSync('token', res.data.data.token);
            //   wx.showToast({
            //     title: '登录成功',
            //     icon: 'success'
            //   });
            //   setTimeout(() => {
            //     wx.navigateBack();
            //   }, 300);
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            });
            this.refreshCaptcha()
          }
        },
        fail: (err) => {
          wx.showToast({
            title: err,
            icon: 'none'
          });
          console.error(err);
        }
      });
    } else {
      wx.showToast({
        title: "输入不完整",
        icon: 'none'
      });
    }
  },

  // 处理注册按钮点击事件，跳转到注册页面
  onRegister: function () {
    wx.navigateTo({
      url: '../register/register'
    });
  },

  onContact: function () {
    wx.navigateTo({
      url: '../rulesNus/rulesNus',
    })
  },
  refreshCaptcha: function () {
    wx.downloadFile({
      url: app.globalData.backend + '/api/answerly/v1/user/captcha',
      success: (res) => {
        this.setData({
          captchaTempFile: res.tempFilePath,
          cookie: res.header["Set-Cookie"]
        })
      },
      fail: (err) => {
        wx.showToast({
          title: '获取验证码失败',
          icon: 'error'
        });
        console.log(err);
      }
    })
  },
  onLoad: function () {
    this.refreshCaptcha()
  }
})