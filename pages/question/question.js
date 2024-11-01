//answer.js
var util = require("../../utils/util.js");

var app = getApp();
Page({
  data: {
    answerList: [],
    answer_length: 0,
    follow: false,
    question: {
      id: 1,
      title: "",
      content: "",
      view_num: 0,
      answer_num: 0,
      tags: ["标签1", "标签2", "标签3"],
    },
  },
  //事件处理函数
  publishAnswer: function () {
    wx.navigateTo({
      url: "../newAnswer/newAnswer",
    });
  },
  bindItemTap: function (e) {
    // 跳转到回答页面,传入回答id
    wx.navigateTo({
      url: "../answer/answer",
    });
  },
  to_write_answer: function () {
    wx.navigateTo({
      url: "../newAnswer/newAnswer",
    });
  },
  to_ask_answer: function () {
    wx.navigateTo({
      url: "../newAnswer/newAnswer",
    });
  },
  onLoad: function () {
    console.log("onLoad");
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
      console.log(data);
    });
  },
  getData: function () {
    var that = this;
    wx.request({
      url: "https://yuanzhida",
      method: "GET",
      success: function (res) {
        // 获取问题信息
        console.log("success");
        console.log(res.data);
        that.setData({
          answerList: res.data.answerList,
          answer_length: res.data.answerList.length,
          question: res.data.question,
          follow: res.data.follow,
        });
      },
      fail: function (error) {
        console.log(error);
        wx.showToast({
          title: "网络连接失败",
          icon: "none",
          duration: 2000,
        });
        var answerList = util.getAnswer();
        var answer_data = answerList.data;
        that.setData({
          question: {
            id: 1,
            title: "问题标题",
            content:
              "问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容",
            view_num: 0,
            answer_num: 0,
            tags: ["标签1", "标签2", "标签3"],
          },
          answerList: answer_data,
          answer_length: answer_data.length,
        });
      },
    });
  },
  refresh: function () {
    wx.showToast({
      title: "刷新中",
      icon: "loading",
      duration: 3000,
    });
    var that = this;
    wx.request({
      url: "https://yuanzhida",
      method: "GET",
      success: function (res) {
        // 获取问题信息
        console.log("success");
        console.log(res.data);
        that.setData({
          answerList: res.data.answerList,
          answer_length: res.data.answerList.length,
          question: res.data.question,
          follow: res.data.follow,
        });
        setTimeout(function () {
          wx.showToast({
            title: "刷新成功",
            icon: "success",
            duration: 2000,
          });
        }, 3000);
      },
      fail: function (error) {
        console.log(error);
        wx.showToast({
          title: "刷新失败，请检查网络连接",
          icon: "none",
          duration: 2000,
        });
        var answerList = util.getAnswer();
        var answer_data = answerList.data;
        that.setData({
          answerList: answer_data,
          answer_length: answer_data.length,
        });
      },
    });
  },

  //使用本地 fake 数据实现继续加载效果
  nextLoad: function () {
    var that = this;
    wx.showToast({
      title: "加载中",
      icon: "loading",
      duration: 2000,
    });
    wx.request({
      url: "https://yuanzhida",
      method: "GET",
      success: function (res) {
        // 获取问题信息
        setTimeout(function () {
          wx.showToast({
            title: "加载成功",
            icon: "success",
            duration: 2000,
          });
        }, 3000);
        console.log("success");
        that.setData({
          answerList: this.data.answerList.concat(res.data.answerList),
          answer_length:
            this.data.answerList.length + res.data.answerList.length,
        });
      },
      fail: function (error) {
        console.log(error);
        wx.showToast({
          title: "加载失败",
          icon: "none",
          duration: 2000,
        });
        var next = util.answerNext();
        console.log("continueload");
        var next_data = next.data;
        that.setData({
          answerList: that.data.answerList.concat(next_data),
          answer_length: that.data.answer_length + next_data.length,
        });
      },
    });
  },
  followQuestion: function () {
    this.setData({
      follow: !this.data.follow,
    });
    wx.request({
      url: "",
      data: { follow: this.data.follow },
      method: "Post",
      header: {
        "Content-Type": "application/json",
      },
      success: function (res) {
        console.log(res.data);
      },
      fail: function (res) {
        console.log("fail");
      },
    });
  },
});
