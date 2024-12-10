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
    //token: "",
    //username: "",
    answerList: [],
    question_id: 926370865360,
    question: {
      title: "",
      images: [], //问题图片
      time: "", //问题发布时间
      content: "",
      collect: 0, //1为收藏，0为未收藏
    },
    collect_icon: ["../../images/收藏2.png", "../../images/收藏1.png"],
    current_page: 1,
    size: 5,
    answer_num: 0,
    page_num: 0, //总页数
    load_max_page: 1, //已经加载到第几页
    is_less_answer: 0, //是否还有更多回答
    height: 0,
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
    wx.setStorageSync("NewAnswer_question_id", this.data.question_id);
    wx.setStorageSync("NewAnswer_question_title", this.data.question.title);
    // wx.navigateTo({
    //   url: "../newAnswer/newAnswer", //验证成功至新问题界面
    // });
    // wx.navigateTo({
    //   url: "../newAnswer/newAnswer", //验证成功至新问题界面
    // });
    //以下是校验token部分，检验成功跳转至writeanswer界面
    if (wx.getStorageSync('isLoggedIn')) {
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
  onLoad: function (options) {
    console.log("onLoad");
    console.log("传参测试");
    console.log(options);
    console.log(options.id);
    var qu_id = options.id;
    console.log(qu_id);
    this.setData({
      question_id: qu_id,
    });
    var globalData = getApp().globalData;
    console.log(globalData);
    console.log("name: ");
    console.log(wx.getStorageSync("name"));
    console.log("token: ");
    console.log(wx.getStorageSync("token"));
    var tempname = wx.getStorageSync("name");
    var temptoken = wx.getStorageSync("token");
    if (
      app.globalData.isLoggedIn &&
      (tempname == "" ||
        tempname == null ||
        tempname == undefined ||
        temptoken.length == 0 ||
        temptoken == null ||
        temptoken == undefined)
    ) {
      wx.showToast({
        title: "获取登录信息错误,使用默认账户ab进行测试",
        icon: "none",
        duration: 3000,
      });
    } else {
      this.setData({
        username: wx.getStorageSync("name"),
        token: wx.getStorageSync("token"),
      });
    }
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
    let url =
      "https://nurl.top:8000/api/answerly/v1/question/" + this.data.question_id;
    console.log("url");
    console.log(url);
    wx.request({
      url: url,
      method: "GET",
      header: {
        "content-type": "application/json",
        token: this.data.token,
        username: this.data.username,
      },
      success: function (res) {
        console.log("question get success");
        console.log(res.data);
        console.log(res);
        var tempquestion = {};
        tempquestion.title = res.data.data.title;
        tempquestion.images = res.data.data.images
          ? res.data.data.images.split(",")
          : [];
        for (var i = 0; i < tempquestion.images.length; i++) {
          tempquestion.images[i] =
            "https://oss-symbol.oss-cn-beijing.aliyuncs.com/" +
            tempquestion.images[i];
        }
        const inputTime = res.data.data.createTime;
        const date = new Date(inputTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        console.log(formattedTime);

        tempquestion.time = formattedTime;
        tempquestion.content = res.data.data.content;
        tempquestion.collect = 0;
        console.log("tempquestion");
        console.log(tempquestion);
        that.setData({
          question: tempquestion,
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
        console.log("tempimages");
        console.log(tempimages);

        tempimages = tempimages.map((item) => {
          //加上../../images/前缀
          return item.map((item) => {
            //没有前缀的图片加上前缀，有前缀的图片保持不变
            if (
              item.indexOf("https://oss-symbol.oss-cn-beijing.aliyuncs.com/") ==
                -1 &&
              item != ""
            ) {
              return "https://oss-symbol.oss-cn-beijing.aliyuncs.com/" + item;
            } else if (item != "") {
              return item;
            }
          });
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
          const inputTime = temp[index].createTime;
          const date = new Date(inputTime);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          const seconds = String(date.getSeconds()).padStart(2, "0");
          const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          console.log(formattedTime);

          item.time = formattedTime;

          //拼接两个字符串
          if (tempimages[index] == "") {
            item.images = [];
          } else {
            item.images = tempimages[index];
          }
          item.comment = 0;
          item.is_like = false;
          item.imageContainerRight = -800;
          console.log(that.data.username);
          if (that.data.username == item.name) {
            item.is_delete = false;
            item.is_modify = false;
            item.more_class = "more1";
          } else {
            item.is_delete = true;
            item.is_modify = true;
            item.more_class = "more2";
          }
        });
        console.log(tempanswerList);
        console.log(res.data.data.pages);

        that.setData({
          answerList: tempanswerList,
          answer_num: res.data.data.total,
          page_num: res.data.data.pages == 0 ? 1 : res.data.data.pages,
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
    // wx.createSelectorQuery()
    //   .in(this)
    //   .select(".container")
    //   .boundingClientRect((rect) => {
    //     const containerHeight = rect.height;
    //     console.log(containerHeight);
    //     wx.createSelectorQuery()
    //       .in(this)
    //       .select(".answer-feed")
    //       .boundingClientRect((rects) => {
    //         let totalListHeight = rects.height;
    //         const fillerHeight =
    //           977 > totalListHeight ? 977 - totalListHeight : 0;
    //         var less_answer =
    //           977 > totalListHeight && this.data.answer_num > 0 ? 1 : 0;
    //         console.log(less_answer);
    //         this.setData({
    //           is_less_answer: less_answer,
    //           height: fillerHeight,
    //         });
    //         console.log(fillerHeight);
    //         console.log(totalListHeight);
    //       })
    //       .exec();
    //   })
    //   .exec();
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
    var que = this.data.question;
    console.log(que);
    if (app.globalData.isLoggedIn) {
      que.collect = !que.collect;
      this.setData({
        question: que,
      });
      if (this.data.question.collect == true) {
        wx.showToast({
          title: "收藏成功",
          icon: "success",
          duration: 1000,
        });
      } else {
        wx.showToast({
          title: "取消收藏",
          icon: "none",
          duration: 1000,
        });
      }
    } else {
      wx.showToast({
        title: "请先登录",
        icon: "none",
        duration: 1000,
      });
    }
  },
  collect_answer(e) {
    console.log("collect_answer");
    //校验是否已经登录
    if (app.globalData.isLoggedIn) {
      var index = e.currentTarget.dataset.index;
      var answer = this.data.answerList[index];
      answer.collect = !answer.collect;
      this.setData({
        answerList: this.data.answerList,
      });
      if (answer.collect == true) {
        wx.showToast({
          title: "收藏成功",
          icon: "success",
          duration: 1000,
        });
        //收藏成功，调用收藏接口
      } else {
        wx.showToast({
          title: "取消收藏",
          icon: "none",
          duration: 1000,
        });
      }
    } else {
      wx.showToast({
        title: "请先登录",
        icon: "none",
        duration: 1000,
      });
    }
  },
  like_answer(e) {
    console.log("like_answer");
    //校验是否已经登录
    if (app.globalData.isLoggedIn) {
      var index = e.currentTarget.dataset.index;
      var answer = this.data.answerList[index];
      answer.is_like = !answer.is_like;

      if (answer.is_like == true) {
        // wx.showToast({
        //   title: "点赞成功",
        //   icon: "success",
        // });
        console.log("进行点赞操作");
        answer.like++;
        this.setData({
          answerList: this.data.answerList,
        });
        console.log(this.data.answerList[index].id);
        var like_id = this.data.answerList[index].id;
        console.log(this.data.token);
        console.log(this.data.username);
        var like_url =
          "https://nurl.top:8000/api/answerly/v1/answer/like?id=" + like_id;
        wx.request({
          url: like_url,
          method: "POST",
          // data: {
          //   id: like_id,
          // },
          header: {
            "content-type": "application/json",
            token: this.data.token,
            username: this.data.username,
          },
          success: function (res) {
            console.log(res);
            console.log("点赞成功");

            // success
          },
          fail: function (err) {
            console.log(err);
            console.log("点赞失败");
            // fail
          },
          complete: function () {
            // complete
          },
        });
        //点赞成功，调用点赞接口
      } else {
        // wx.showToast({
        //   title: "取消点赞",
        //   icon: "none",
        // });
        console.log("取消点赞");
        answer.like--;
        this.setData({
          answerList: this.data.answerList,
        });
      }
    } else {
      wx.showToast({
        title: "请先登录",
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

          console.log("继续加载tempimages");
          console.log(tempimages);

          tempimages = tempimages.map((item) => {
            //加上../../images/前缀
            return item.map((item) => {
              //没有前缀的图片加上前缀，有前缀的图片保持不变
              //为空的元素去除
              if (
                item.indexOf(
                  "https://oss-symbol.oss-cn-beijing.aliyuncs.com/"
                ) == -1 &&
                item != ""
              ) {
                return "https://oss-symbol.oss-cn-beijing.aliyuncs.com/" + item;
              } else if (item != "") {
                return item;
              }
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
            const inputTime = temp[index].createTime;
            const date = new Date(inputTime);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const seconds = String(date.getSeconds()).padStart(2, "0");
            const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            console.log(formattedTime);

            item.time = formattedTime;
            if (tempimages[index] == "") {
              item.images = [];
            } else {
              item.images = tempimages[index];
            }

            //item.images = tempimages[index];
            item.comment = 0;
            item.imageContainerRight = -800;
            console.log(that.data.username);
            if (that.data.username == item.name) {
              item.is_delete = false;
              item.is_modify = false;
              item.more_class = "more1";
            } else {
              item.is_delete = true;
              item.is_modify = true;
              item.more_class = "more2";
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
        var delete_url =
          "https://nurl.top:8000/api/answerly/v1/answer?id=" +
          that.data.answerList[index].id;
        if (res.confirm) {
          wx.request({
            url: delete_url,
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
                  //获取组件实例
                  const pagination = this.selectComponent("#pagination");
                  //调用组件方法
                  pagination.onPrev();
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
    if (this.data.current_page + 1 > this.data.load_max_page) {
      var that = this;
      wx.request({
        url: "https://nurl.top:8000/api/answerly/v1/answer/page",
        method: "GET",
        data: {
          id: this.data.question_id,
          size: this.data.size,
          current: this.data.current_page + 1,
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

          console.log("继续加载tempimages");
          console.log(tempimages);

          tempimages = tempimages.map((item) => {
            //加上../../images/前缀
            return item.map((item) => {
              //没有前缀的图片加上前缀，有前缀的图片保持不变
              //为空的元素去除
              if (
                item.indexOf(
                  "https://oss-symbol.oss-cn-beijing.aliyuncs.com/"
                ) == -1 &&
                item != ""
              ) {
                return "https://oss-symbol.oss-cn-beijing.aliyuncs.com/" + item;
              } else if (item != "") {
                return item;
              }
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
            const inputTime = temp[index].createTime;
            const date = new Date(inputTime);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const seconds = String(date.getSeconds()).padStart(2, "0");
            const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            console.log(formattedTime);

            item.time = formattedTime;
            if (tempimages[index] == "") {
              item.images = [];
            } else {
              item.images = tempimages[index];
            }

            //item.images = tempimages[index];
            item.comment = 0;
            item.imageContainerRight = -800;
            console.log(that.data.username);
            if (that.data.username == item.name) {
              item.is_delete = false;
              item.is_modify = false;
              item.more_class = "more1";
            } else {
              item.is_delete = true;
              item.is_modify = true;
              item.more_class = "more2";
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
  modify(e) {
    console.log("modify");
    let index = e.currentTarget.dataset.index;
    wx.setStorageSync("modify_id", this.data.answerList[index].id);
    wx.setStorageSync("modify_content", this.data.answerList[index].content);
    wx.setStorageSync("modify_images", this.data.answerList[index].images);
    wx.setStorageSync("modify_question_id", this.data.question_id);
    wx.setStorageSync("modify_question_title", this.data.question.title);
    wx.navigateTo({
      url: "../modifyAnswer/modifyAnswer",
    });
  },
});
