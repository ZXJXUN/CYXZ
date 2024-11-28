var app = getApp();

Page({
    data: {
        name: '',
        isLoggedIn: '',
    },
    onShow: function () {
        // 在页面显示时更新name的值为app.js里的name
        this.setData({
            name: wx.getStorageSync('name'),
            isLoggedIn: wx.getStorageSync('isLoggedIn')
        });
    },
    // 事件处理函数
    // 事件处理函数
goToLogin() {
  // 通过this.data来访问isLoggedIn属性
  if (this.data.isLoggedIn === false) {
      wx.navigateTo({
          url: '../login/login'
      });
  } else {
      app.globalData.isLoggedIn = false;
      // 通过this.setData来更新data中的isLoggedIn属性
      this.setData({
          isLoggedIn: false
      });
      wx.redirectTo({
          url: '../index/index',
      });
  }
}
})