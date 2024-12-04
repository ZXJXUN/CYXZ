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

    goToDraft: function (){
      wx.navigateTo({
        url: '../draft/draft',
      })
    },
    goToAttention: function(){
      wx.showToast({
        title: '敬请期待 ^_',
      })
    },
    goToCollection: function(){
      wx.showToast({
        title: '敬请期待 ^_',
      })
    },
    goToBrowsed: function(){
      wx.showToast({
        title: '敬请期待 ^_',
      })
    },
    goToMessage: function(){
      wx.showToast({
        title: '敬请期待 ^_',
      })
    },
    goToMyAnswer: function(){
      wx.showToast({
        title: '敬请期待 ^_',
      })
    },
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