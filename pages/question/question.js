//answer.js
var util = require("../../utils/util.js");

var app = getApp();
Page({
  data: {
    answerList: [],
    answer_length: 0,
  },
  //事件处理函数
  bindItemTap: function () {
    wx.navigateTo({
      url: "../answer/answer",
    });
  },
  onLoad: function () {
    console.log("onLoad");
    var that = this;
    //调用应用实例的方法获取全局数据
    this.getData();
  },
  upper: function () {
    wx.showNavigationBarLoading();
    this.refresh();
    console.log("upper");
    setTimeout(function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 2000);
  },
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function () {
      wx.hideNavigationBarLoading();
      that.nextLoad();
    }, 1000);
    console.log("lower");
  },
  refresh0: function () {
    var index_api = "";
    util.getData(index_api).then(function (data) {
      //this.setData({
      //
      //});
      console.log(data);
    });
  },

  //使用本地 fake 数据实现刷新效果
  getData: function () {
    var answerList = util.getAnswer();
    console.log("loaddata");
    var answer_data = answerList.data;
    this.setData({
      answerList: answer_data,
      answer_length: answer_data.length,
    });
  },
  refresh: function () {
    wx.showToast({
      title: "刷新中",
      icon: "loading",
      duration: 3000,
    });
    var answerList = util.getAnswer();
    console.log("loaddata");
    var answer_data = answerList.data;
    this.setData({
      answerList: answer_data,
      answer_length: answer_data.length,
    });
    setTimeout(function () {
      wx.showToast({
        title: "刷新成功",
        icon: "success",
        duration: 2000,
      });
    }, 3000);
  },

  //使用本地 fake 数据实现继续加载效果
  nextLoad: function () {
    wx.showToast({
      title: "加载中",
      icon: "loading",
      duration: 4000,
    });
    var next = util.answerNext();
    console.log("continueload");
    var next_data = next.data;
    this.setData({
      answerList: this.data.answerList.concat(next_data),
      answer_length: this.data.answer_length + next_data.length,
    });
    setTimeout(function () {
      wx.showToast({
        title: "加载成功",
        icon: "success",
        duration: 2000,
      });
    }, 3000);
  },
});
