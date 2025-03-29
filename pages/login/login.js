const app = getApp();
Page({
  data: {
    account: '',
    password: '',
    showPassword: false,
    captchaTempFile:'',
    cookie:''
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
  toggleShowPassword: function () {
    this.setData({
      showPassword:!this.data.showPassword
    });
  },

  // 处理登录按钮点击事件
  onLogin: function () {
    
    if (this.data.password && this.data.account) {
      wx.request({
        url: app.globalData.backend+'/api/answerly/v1/user/login',
        method: 'POST',
        header:{cookie:this.data.cookie},
        data: {
          username: this.data.account,
          password: this.data.password,
          code:this.data.captcha
        },
        
        success: (res) => {
        
          if (res.data.success === true) {
            app.globalData.isLoggedIn = true;
            wx.showToast({
              title: '登录成功',
              icon: 'success'
            });
            setTimeout(() => {
              wx.navigateBack();
          }, 500);
          
          const token = res.data.data.token;
          const name = this.data.account;
          app.globalData.token=token
          app.globalData.name=name
          // wx.setStorageSync('token', token);//11.27_token
          // wx.setStorageSync('name', name);
          // wx.setStorageSync('isLoggedIn', true);
          app.globalData.token = token;  
          app.globalData.name = name;
          console.log(app.globalData.token);
          // 设置token有效期为30天，将30天换算成秒数
          var expiresInSeconds = 30 * 24 * 60 * 60;

          // 计算过期时间，以当前时间加上有效期的秒数得到过期时间戳
          var expirationTime = Date.now() + expiresInSeconds * 1000;
          wx.setStorageSync('expirationTime', expirationTime);

          } else if(res.data.code === 'A000203') {
            app.globalData.isLoggedIn = true;
            wx.setStorageSync('name', this.data.account);
            wx.setStorageSync('token', res.data.data.token);
            wx.showToast({
              title: '登录成功',
              icon: 'success'
            });
            setTimeout(() => {
              wx.navigateBack(
              );
          }, 300);
          }
          else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'});
              const app = getApp();
              this.refreshCaptcha()
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
  },

  onContact: function () {
    wx.navigateTo({
      url: '../rulesNus/rulesNus',
    })
  },
  refreshCaptcha:function () {
    wx.downloadFile({
      url: app.globalData.backend+'/api/answerly/v1/user/captcha',
      success:(res)=>{
       this.setData({captchaTempFile:res.tempFilePath,cookie:res.header["Set-Cookie"]})
      },
      fail:(err)=>{
        wx.showToast({ title: '获取验证码失败', icon: 'error' });
        console.log(err);
      }
    })
  },
  onLoad:function () {
    this.refreshCaptcha()
  }
})
