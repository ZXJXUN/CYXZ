// app.js
// 没看懂，先注释掉
// const initGlobalRequireBlocker = () => {
//   if (typeof global === 'undefined') {
//     global = {};
//   }
//   if (!global.globalRequireBlocker) {
//     global.globalRequireBlocker = {
//       loadedModules: {},
//       require: function (moduleName) {
//         return this.loadedModules[moduleName];
//       }
//     };
//   }
// };

// initGlobalRequireBlocker();
App({
  onLaunch() {
    //检查是否过期
    this.checkExpiration()
  },
  //不会变的全局数值
  globalData: {
    backend: "https://yuanzhida.top:8000",
    ossPrefix: "https://yuanzhida-oss.oss-cn-beijing.aliyuncs.com/"
  },
  //全局函数，得到请求头
  getRequestHeader: function () {
    return {
      token: wx.getStorageSync("token"),
      username: wx.getStorageSync("name"),
    };
  },
  //检查是否过期
  checkExpiration: function () {
    var expirationTime = wx.getStorageSync('expirationTime');
    if (!expirationTime || (Date.now() > expirationTime)) {
      this.removeLoginInfo();
    }
  },
  //清除初始状态
  removeLoginInfo: function () {
    wx.setStorageSync('isLoggedIn', false);
    wx.setStorageSync('name', "")
    wx.setStorageSync('token', "")
  }
})