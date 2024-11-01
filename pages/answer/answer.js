// pages/question/question.js
var util = require("../../utils/util.js");

var app = getApp();
Page({
  data: {
    question_title: "",
    answer_imf: {
      question_id: "",
      answer_id: "",
      answer_content: "",
      answer_image_path: "",
      answer_name: "",
      like_num: "",
      comment_num: "",
      time: "",
      author_tags: "",
    },
  },
  //事件处理函数
  toQuestion: function () {
    wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log("onLoad");
    var that = this;

    wx.request({
      url: "http://localhost:8080/answer/getAnswerById",
      data: {
        answer_id: that.data.answer_imf.answer_id,
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          answer_imf: res.data.answer_imf,
          question_title: res.data.question_title,
        });
      },
      fail: function (res) {
        console.log("fail");
        wx.showToast({
          title: "网络错误",
          icon: "none",
          duration: 2000,
        });
        that.setData({
          question_title: "问题标题",
          answer_imf: {
            question_id: "1",
            answer_id: "2",
            answer_content: "这是第二条解答",
            answer_image_path: "../../images/icon1.jpeg",
            answer_name: "义工2",
            like_num: "2",
            comment_num: "2",
            time: "2024-10-25",
            author_tags: "作者标签",
          },
        });
      },
    });
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
