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
      title: "如何学好数分",
      content: "",
      view_num: 0,
      answer_num: 0,
      images: [],
    },
    show_content:
      "这是展示的具体回答这是展示的具体回答这是展示的具体回答这是展示的具体回答这是展示的具体回答这是展示的具体回答这是展示的具体回答这是展示的具体回答这是展示的具体回答这是展示的具体回答",
    isStore: false,
    store_icon: "../../images/收藏2.png",
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
    wx.setStorageSync("question_id", this.data.question.id);
    wx.setStorageSync("question_title", this.data.question.title);
    // wx.navigateTo({
    //   url: "../newAnswer/newAnswer", //验证成功至新问题界面
    // });
    //以下是校验token部分，检验成功跳转至writeanswer界面
    wx.request({
      url: "http://47.120.26.83:8000/api/answerly/v1/user/check-login",
      method: "POST",
      data: {
        name: app.globalData.name,
        token: app.globalData.token,
      },

      success: (res) => {
        if (
          res.data.code === "0" &&
          res.data.message === null &&
          res.data.success === true
        ) {
          console.log("检验成功");
          wx.showToast({
            title: "已登录",
            icon: "success",
          });
          setTimeout(() => {
            console.log("Navigating to new page...");
            wx.navigateTo({
              url: "../newAnswer/newAnswer", //验证成功至新问题界面
            });
          }, 500);
        } else {
          wx.showToast({
            title: "请先登录哦~",
            icon: "none",
          });
          console.log("未登录", res.data);
          setTimeout(() => {
            console.log("Navigating to login page...");
            wx.navigateTo({
              url: "../login/login",
            });
          }, 500);
        }
      },
      fail: (error) => {
        wx.showToast({
          title: "网络错误",
          icon: "none",
        });
        console.error("检验时网络发生错误", error);
        setTimeout(() => {
          console.log("Navigating to list page...");
          wx.navigateTo({
            url: "../question/question",
          });
        }, 500);
      },
    });
  },
  to_ask_answer: function () {
    wx.navigateTo({
      url: "../newAnswer/newAnswer",
    });
  },
  onLoad: function () {
    console.log("onLoad");
    this.setData({
      isStore: false,
      store_icon: "../../images/收藏2.png",
    });
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
              "内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容问题具体内容",
            view_num: 0,
            answer_num: 0,
            tags: ["标签1", "标签2", "标签3"],
            images: [
              "../../images/源智答小程序.png",
              "../../images/源智答小程序.png",
              "../../images/源智答小程序.png",
              "../../images/源智答小程序.png",
              "../../images/源智答小程序.png",
              "../../images/源智答小程序.png",
              "../../images/源智答小程序.png",
            ],
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
  show(e) {
    console.log("show");
    const index = e.currentTarget.dataset.index;
    const nowanswerList = this.data.answerList;
    nowanswerList[index].isShow = !nowanswerList[index].isShow;
    if (nowanswerList[index].isShow == true) {
      nowanswerList[index].show_icon = "../../images/展开.png";
    } else {
      nowanswerList[index].show_icon = "../../images/收起.png";
    }

    this.setData({
      answerList: nowanswerList,
    });
  },
  store() {
    this.setData({
      isStore: !this.data.isStore,
    });
    if (this.data.isStore == true) {
      this.setData({
        store_icon: "../../images/收藏1.png",
      });
      wx.showToast({
        title: "收藏成功",
        icon: "success",
        duration: 1000,
      });
    } else {
      this.setData({
        store_icon: "../../images/收藏2.png",
      });
      wx.showToast({
        title: "取消收藏",
        icon: "none",
        duration: 1000,
      });
    }
  },
  preview_que_Image(e) {
    console.log("preview_que_Image");
    let index = e.currentTarget.dataset.index;

    console.log(index);
    console.log(this.data.question.images[index]);
    wx.previewImage({
      current: this.data.question.images[index], // 当前显示图片的http链接
      urls: this.data.question.images, // 需要预览的图片http链接列表
    });
  },
});
