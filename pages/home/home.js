var app = getApp();

Page({
    data: {
        name: '',
    },
    onShow: function () {
        // 在页面显示时更新name的值为app.js里的name
        this.setData({
            name: app.globalData.name
        });
    },
    // 事件处理函数
    goToLogin() {
        if (!app.globalData.isLoggedIn) {
            wx.navigateTo({
                url: '../login/login'
            });
        } else {
            app.globalData.isLoggedIn = false;
            this.setData({
                isLoggedIn: false
            });
            wx.reLaunch({
                url: '../index/index'
            });
        }
    }
})