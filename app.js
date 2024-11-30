// app.js
const initGlobalRequireBlocker = () => {
  if (typeof global === 'undefined') {
    global = {};
  }
  if (!global.globalRequireBlocker) {
    global.globalRequireBlocker = {
      loadedModules: {},
      require: function(moduleName) {
        return this.loadedModules[moduleName];
      }
    };
  }
};

initGlobalRequireBlocker();
App({
  
  onLaunch() {
    // 展示本地存储能力
    wx.setStorageSync('isLoggedIn', false);
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  globalData: {
    userInfo: null,
    token: null,
    name: '请先登录',
    isLoggedIn: false
  },

  check: function() {
    var expirationTime = wx.getStorageSync('expirationTime');
    if (Date.now() > expirationTime) {
      // token过期，重新登录
      this.reLogin();
    }
  },

  reLogin: function(){
    // 清空本地缓存的所有数据
    wx.clearStorageSync();
    wx.setStorageSync('isLoggedIn', false);
  }
})
