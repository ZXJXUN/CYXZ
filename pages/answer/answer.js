// pages/question/question.js
var util = require("../../utils/util.js");

var app = getApp();
Page({
  data: {
    motto: "知乎--微信小程序版",
    userInfo: {},
    question_imf: "这是一条问题",
  },
  //事件处理函数
  toQuestion: function () {
    wx.navigateTo({
      url: "../question/question",
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log("onLoad");
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
      });
    });
    //从后台获取数据
    // var that = this;
    // wx.request({
    //   url: "http:",
    //   data: { quetion_id: "1" },
    //   method: "GET",
    //   success: function (res) {
    //     console.log(res.data);
    //     that.setData({
    //       question_imf: res.data,
    //     });
    //   },
    //   fail: function () {
    //     wx.showToast({ title: "加载失败" });
    //   },
    // });
  },
  tapName: function (event) {
    console.log(event);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
