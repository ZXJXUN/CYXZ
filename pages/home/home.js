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
    goToMyQuestion: function () {
      // 使用wx.navigateTo实现页面跳转
      wx.navigateTo({
          url: '../MyQuestion/MyQuestion',
      });
    }, 
    
    goToBrowsed: function(){
      wx.navigateTo({
        url: '../viewHistory/viewHistory',
      })
    },
    
    goToMyAnswer: function(){
      wx.navigateTo({
        url: '../myComments/myComments',
      })
    },
    goToLogin() {
          wx.navigateTo({
              url: '../login/login'
          });
      },
      logout() {
        app.globalData.isLoggedIn = false;
        app.globalData.name = '';
        this.setData({
            name: '',
            isLoggedIn: false
        });
        wx.setStorageSync('isLoggedIn', false);
        wx.setStorageSync('name', '');
        wx.reLaunch({
            url: '../home/home',
        });
    }
})