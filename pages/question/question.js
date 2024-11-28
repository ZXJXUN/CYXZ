//answer.js
const app = getApp();
const links = [
  {
    text: "首页",
    url: "/pages/index/index",
    openType: "switchTab",
  },
  {
    text: "个人",
    url: "/pages/home/home",
    openType: "switchTab",
  },
];
Page({
  data: {
    links,
    token: "29b04146-b2de-4733-b0f5-fba06f7b45fe",
    username: "ab",
    answerList: [],
    question_id: 1,
    question: {
      title: "",
      images: [], //问题图片
      time: "", //问题发布时间
      content: "",
      collect: 0, //1为收藏，0为未收藏
      collect_icon: "../../images/收藏2.png",
    },
    current_page: 1,
    size: 4,
    answer_num: 0,
    page_num: 0, //总页数
    load_max_page: 1, //已经加载到第几页
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
      url: "../newAnswer/newAnswer", //验证成功至新问题界面
    });

    wx.setStorageSync("question_id", this.data.question.id);
    wx.setStorageSync("question_title", this.data.question.title);
    // wx.navigateTo({
    //   url: "../newAnswer/newAnswer", //验证成功至新问题界面
    // });
    //以下是校验token部分，检验成功跳转至writeanswer界面
    if (app.globalData.isLoggedIn) {
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
        title: "提问题请先登录哦~",
        icon: "none",
      });
      console.log(app.globalData.name, app.globalData.token);
      console.log("未登录");
      setTimeout(() => {
        console.log("Navigating to login page...");
        wx.navigateTo({
          url: "../login/login",
        });
      }, 500);
    }
  },
  to_ask_answer: function () {
    wx.navigateTo({
      url: "../newAnswer/newAnswer",
    });
  },
  onLoad: function () {
    console.log("onLoad");
    var globalData = getApp().globalData;
    console.log(globalData);
    this.getData();
  },
  getData: function () {
    console.log(this.data.question_id);
    console.log(this.data.username);
    console.log(this.data.token);
    console.log(this.data.size);
    console.log(this.data.current_page);
    var that = this;
    var data0 = {
      title: "默认标题",
      images: [
        "https://oss-symbol.oss-cn-beijing.aliyuncs.com/2024/11/28/8ec59bda-8ef3-47d9-b554-4da0e3f10c51.gif",
        "../../images/源智答小程序.png",
        "../../images/源智答小程序.png",
      ], //问题图片
      time: "2024-01-01 00:00:00", //问题发布时间
      content: "默认问题内容",
      collect: 0, //1为收藏，0为未收藏
      collect_icon: "../../images/收藏2.png",
    };
    wx.request({
      url: "https://47.120.26.83:8000/api/answerly/v1/question/?id=this.data.question_id",
      method: "GET",
      header: {
        "content-type": "application/json",
        token: "29b04146-b2de-4733-b0f5-fba06f7b45fe",
        username: "ab",
      },
      success: function (res) {
        console.log("question get success");
        console.log(res.data);
        console.log(res);
        that.setData({
          question: data0,
        });
      },
      fail: function (error) {
        console.log(error);
        console.log("question get fail");
        wx.showToast({
          title: "网络连接失败",
          icon: "none",
          duration: 2000,
        });
        that.setData({
          question: data0,
        });
      },
    });
    wx.request({
      url: "https://nurl.top:8000/api/answerly/v1/answer/page",
      method: "GET",
      data: {
        id: this.data.question_id,
        size: this.data.size,
        current: this.data.current_page,
      },
      header: {
        "content-type": "application/json",
        token: this.data.token,
        username: this.data.username,
      },
      success: function (res) {
        console.log("success");
        console.log("res.data");
        console.log(res.data);
        console.log(res);
        var temp = res.data.data.records;
        console.log(temp);
        var tempimages = temp.map((item) => {
          //将逗号分割的图片字符串，转化为图片数组
          return item.images.split(",");
        });
        var tempanswerList = temp.map((item) => {
          if (item.avatar == null) {
            item.avatar = "../../images/默认头像.png";
          }
          return {
            id: item.id,
            name: item.username,
            avater: item.avatar,
            content: item.content,
            like: item.likeCount,
            useful: item.useful,
            is_show: false,
            show_icon: "../../images/收起.png",
            collect: 0,
          };
        });
        console.log(tempanswerList);
        tempanswerList.forEach((item, index) => {
          const isoString = temp[index].createTime;
          const date = new Date(isoString);
          const formattedDate = date.toLocaleString();

          console.log(formattedDate);
          item.time = formattedDate;
          //拼接两个字符串
          item.images =
            "https://oss-symbol.oss-cn-beijing.aliyuncs.com/" +
            tempimages[index];
          item.comment = 0;
          item.imageContainerRight = -800;
          console.log(that.data.username);
          if (that.data.username == item.name) {
            item.is_delete = false;
            item.is_modify = false;
          } else {
            item.is_delete = true;
            item.is_modify = true;
          }
        });
        console.log(tempanswerList);
        console.log(res.data.data.pages);

        that.setData({
          answerList: tempanswerList,
          answer_num: res.data.data.total,
          page_num: res.data.data.pages,
        });
      },
      fail: function (error) {
        console.log(error);
        wx.showToast({
          title: "网络连接失败",
          icon: "none",
          duration: 2000,
        });
      },
    });
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
  // refresh: function () {
  //   wx.showToast({
  //     title: "刷新中",
  //     icon: "loading",
  //     duration: 3000,
  //   });
  //   var that = this;
  //   wx.request({
  //     url: "https://yuanzhida",
  //     method: "GET",
  //     success: function (res) {
  //       // 获取问题信息
  //       console.log("success");
  //       console.log(res.data);
  //       that.setData({
  //         answerList: res.data.answerList,
  //         answer_length: res.data.answerList.length,
  //         question: res.data.question,
  //         follow: res.data.follow,
  //       });
  //       setTimeout(function () {
  //         wx.showToast({
  //           title: "刷新成功",
  //           icon: "success",
  //           duration: 2000,
  //         });
  //       }, 3000);
  //     },
  //     fail: function (error) {
  //       console.log(error);
  //       wx.showToast({
  //         title: "刷新失败，请检查网络连接",
  //         icon: "none",
  //         duration: 2000,
  //       });
  //       var answerList = util.getAnswer();
  //       var answer_data = answerList.data;
  //       that.setData({
  //         answerList: answer_data,
  //         answer_length: answer_data.length,
  //       });
  //     },
  //   });
  // }，
  show(e) {
    console.log("show");
    const index = e.currentTarget.dataset.index;
    const nowanswerList = this.data.answerList;
    console.log(index);
    nowanswerList[index].is_show = !nowanswerList[index].is_show;
    console.log(nowanswerList[index]);
    if (nowanswerList[index].is_show == true) {
      nowanswerList[index].show_icon = "../../images/展开.png";
    } else {
      nowanswerList[index].show_icon = "../../images/收起.png";
    }

    if (nowanswerList[index].imageContainerRight === -360) {
      nowanswerList[index].imageContainerRight = -800;
    } else {
      nowanswerList[index].imageContainerRight = -360;
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
  preview_answer_Image(e) {
    console.log("preview_answer_Image");
    let index = e.currentTarget.dataset.index;
    let i = e.currentTarget.dataset.i;
    console.log(index);
    console.log(i);
    console.log(this.data.answerList[index].images[i]);
    wx.previewImage({
      current: this.data.answerList[index].images[i], // 当前显示图片的http链接
      urls: this.data.answerList[index].images, // 需要预览的图片http链接列表
    });
  },
  copy(e) {
    console.log("copy");
    var index = e.currentTarget.dataset.index;
    var content = this.data.answerList[index].content;
    wx.setClipboardData({
      data: content,
      success: function (res) {
        wx.showToast({
          title: "复制成功",
          icon: "success",
          duration: 1000,
        });
      },
    });
  },
  onPrev() {
    console.log("onPrev");
    var new_page = this.data.current_page - 1;
    if (new_page >= 0) {
      this.setData({
        current_page: new_page,
      });
    }
  },
  onNext() {
    console.log("onNext");
    var new_page = this.data.current_page + 1;
    this.setData({
      current_page: new_page,
    });
    if (new_page > this.data.load_max_page) {
      var that = this;
      wx.request({
        url: "https://nurl.top:8000/api/answerly/v1/answer/page",
        method: "GET",
        data: {
          id: this.data.question_id,
          size: this.data.size,
          current: this.data.current_page,
        },
        header: {
          "content-type": "application/json",
          token: this.data.token,
          username: this.data.username,
        },
        success: function (res) {
          console.log("success");
          console.log(res.data);
          console.log(res);
          var temp = res.data.data.records;
          console.log(temp);
          var tempimages = temp.map((item) => {
            //将逗号分割的图片字符串，转化为图片数组
            return item.images.split(",");
          });
          console.log("tempimages");
          console.log(tempimages);
          tempimages = tempimages.map((item) => {
            //加上../../images/前缀
            return item.map((item) => {
              return "https://oss-symbol.oss-cn-beijing.aliyuncs.com/" + item;
            });
          });
          console.log("tempimages加上前缀");
          console.log(tempimages);
          var tempanswerList = temp.map((item) => {
            if (item.avatar == null) {
              item.avatar = "../../images/默认头像.png";
            }
            return {
              id: item.id,
              name: item.username,
              avater: item.avatar,
              content: item.content,
              time: item.createTime,
              like: item.likeCount,
              useful: item.useful,
              is_show: false,
              show_icon: "../../images/收起.png",
              collect: 0,
            };
          });
          console.log(tempanswerList);
          tempanswerList.forEach((item, index) => {
            const isoString = temp[index].createTime;
            const date = new Date(isoString);
            const formattedDate = date.toLocaleString();
            item.time = formattedDate;

            item.images = tempimages[index];
            item.comment = 0;
            item.imageContainerRight = -800;
            console.log(that.data.username);
            if (that.data.username == item.name) {
              item.is_delete = false;
              item.is_modify = false;
            } else {
              item.is_delete = true;
              item.is_modify = true;
            }
          });
          console.log(tempanswerList);
          console.log(res.data.data.pages);

          that.setData({
            answerList: that.data.answerList.concat(tempanswerList),

            page_num: res.data.data.pages,
            load_max_page: that.data.load_max_page + 1,
          });
        },
        fail: function (error) {
          console.log(error);
          wx.showToast({
            title: "网络连接失败",
            icon: "none",
            duration: 2000,
          });
        },
      });
    }
  },
  delete(e) {
    console.log("delete");
    let index = e.currentTarget.dataset.index;
    var that = this;
    wx.showModal({
      title: "提示",
      content: "确定删除吗？",
      success: (res) => {
        console.log(that.data.answerList[index].id);
        console.log(that.data.username);
        console.log(that.data.token);
        if (res.confirm) {
          wx.request({
            url: "https://47.120.26.83:8000/api/answerly/v1/answer",
            header: {
              username: that.data.username,
              token: that.data.token,
              "content-type": "application/json",
            },
            method: "DELETE",
            data: {
              id: that.data.answerList[index].id,
            },
            success: (res) => {
              console.log(res.data);
              that.data.answerList.splice(index, 1);
              if (that.data.answer_num % that.data.size == 1) {
                that.data.page_num--;
                that.setData({
                  page_num: that.data.page_num,
                });
                if (index + 1 == that.data.answer_num) {
                  that.data.load_max_page--;
                  that.setData({
                    load_max_page: that.data.load_max_page,
                  });
                }
              }
              that.data.answer_num--;
              that.setData({
                answer_num: that.data.answer_num,
                answerList: that.data.answerList,
              });
            },
            fail: (error) => {
              console.log(error);
            },
          });
        }
      },
    });
  },
});
