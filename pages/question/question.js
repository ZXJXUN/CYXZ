//answer.js
const app = getApp();
// 添加全局变量，用于控制问题详情是否需要刷新
var needRefresh = false;

Page({
  data: {
    // token: "29b04146-b2de-4733-b0f5-fba06f7b45fe",
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
      likeCount: 0, // 问题点赞数
      is_liked: false, // 当前用户是否点赞
    },
    current_page: 1,
    size: 5,
    answer_num: 0,
    page_num: 0, //总页数
    load_max_page: 1, //已经加载到第几页
    is_less_answer: 0, //是否还有更多回答
    height: 0,
  },
  // 没用到
  //事件处理函数
  // publishAnswer: function () {
  //   wx.navigateTo({
  //     url: "../newAnswer/newAnswer",
  //   });
  // },
  // 没用到
  // bindItemTap: function (e) {
  //   // 跳转到回答页面,传入回答id
  //   wx.navigateTo({
  //     url: "../answer/answer",
  //   });
  // },
  to_write_answer: function () {
    // 目前只传了id和题目，有时间改成加上内容
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
      // console.log("检验成功");
      wx.showToast({
        title: "已登录",
        icon: "success",
      });
      setTimeout(() => {
        // console.log("Navigating to new page...");
        wx.navigateTo({
          url: "../newAnswer/newAnswer", //验证成功至新问题界面
        });
      }, 500);
    } else {
      wx.showToast({
        title: "提问题请先登录哦~",
        icon: "none",
      });
      // console.log(app.globalData.name, app.globalData.token);
      // console.log("未登录");
      setTimeout(() => {
        // console.log("Navigating to login page...");
        wx.navigateTo({
          url: "../login/login",
        });
      }, 500);
    }
  },
  // to_ask_answer: function () {
  //   wx.navigateTo({
  //     url: "../newAnswer/newAnswer",
  //   });
  // },
  onLoad: function (options) {
    // console.log("onLoad");
    // console.log("传参测试");
    // console.log(options);
    // console.log(options.id);
    var qu_id = options.id;
    // console.log(qu_id);
    this.setData({
      question_id: qu_id,
    });

    // 没有必要，没有token也可以请求数据
    // var globalData = getApp().globalData;
    // console.log(globalData);
    // console.log("name: ");
    // console.log(wx.getStorageSync("name"));
    // console.log("token: ");
    // console.log(wx.getStorageSync("token"));
    // var tempname = wx.getStorageSync("name");
    // var temptoken = wx.getStorageSync("token");
    // if (
    //   app.globalData.isLoggedIn &&
    //   (tempname == "" ||
    //     tempname == null ||
    //     tempname == undefined ||
    //     temptoken.length == 0 ||
    //     temptoken == null ||
    //     temptoken == undefined)
    // ) {
    //   wx.showToast({
    //     title: "获取登录信息错误,使用默认账户ab进行测试",
    //     icon: "none",
    //     duration: 3000,
    //   });
    // } else {
    // 设置username负责看是不是自己帖子即可
    this.setData({
      username: wx.getStorageSync("name"),
    });
    // }

    // 将needRefresh变量挂载到页面实例上，方便外部访问
    this.needRefresh = needRefresh;

    this.getData();

    // 添加页面点击事件监听
    // wx.createSelectorQuery()
    //   .select('.container')
    //   .boundingClientRect()
    //   .exec((res) => {
    //     if (res && res[0]) {
    //       const container = res[0];
    //       container.addEventListener('tap', this.onTapPage);
    //     }
    //   });
  },
  getData: function () {
    // console.log(this.data.question_id);
    // console.log(this.data.username);
    // console.log(this.data.token);
    // console.log(this.data.size);
    // console.log(this.data.current_page);
    var that = this;
    var data0 = {
      title: "当你看到这个时",
      images: [
      ], //问题图片
      time: "2024-01-01 00:00:00", //问题发布时间
      content: "说明请求失败",
      collect: 0, //1为收藏，0为未收藏
      collect_icon: "../../images/收藏2.png",
    };
    let url =
      app.globalData.backend + "/api/answerly/v1/question/" + this.data.question_id;
    // console.log("url");
    // console.log(url);
    wx.request({
      url: url,
      method: "GET",
      header: app.getRequestHeader(),
      success: function (res) {
        // console.log("question get success");
        // console.log(res.data);
        // console.log(res);
        var tempquestion = {};
        tempquestion.title = res.data.data.title;
        tempquestion.images = res.data.data.images
          ? res.data.data.images.split(",")
          : [];
        for (var i = 0; i < tempquestion.images.length; i++) {
          tempquestion.images[i] =
            app.globalData.ossPrefix +
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
        // console.log(formattedTime);

        tempquestion.time = formattedTime;
        tempquestion.content = res.data.data.content;
        tempquestion.likeCount = res.data.data.likeCount || 0;
        tempquestion.is_liked = res.data.data.isLiked || false;
        tempquestion.authorUserId = res.data.data.userId;
        // console.log("tempquestion");
        // console.log(tempquestion);
        that.setData({
          question: tempquestion,
        });
      },
      fail: function (error) {
        console.log(error);
        // console.log("question get fail");
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
      url: app.globalData.backend + "/api/answerly/v1/comment/page",
      method: "GET",
      data: {
        id: this.data.question_id,
        size: this.data.size,
        current: this.data.current_page,
      },
      header: app.getRequestHeader(),
      success: function (res) {
        // console.log(res);
        var temp = res.data.data.records;
        var tempimages = temp.map((item) => {
          //将逗号分割的图片字符串，转化为图片数组
          return item.images.split(",");
        });
        // console.log("tempimages");
        // console.log(tempimages);

        tempimages = tempimages.map((item) => {
          //加上../../images/前缀
          return item.map((item) => {
            //没有前缀的图片加上前缀，有前缀的图片保持不变
            if (
              item.indexOf(app.globalData.ossPrefix) ==
              -1 &&
              item != ""
            ) {
              return app.globalData.ossPrefix + item;
            } else if (item != "") {
              return item;
            }
          });
        });

        var tempanswerList = temp.map((item) => {
          if (item.avatar == null) {
            item.avatar = "../../images/defaultAvatar.png";
          }
          return {
            id: item.id,
            name: item.username,
            avater: item.avatar,
            content: item.content,
            like: item.likeCount,

            useful: item.useful,
            is_show: false,
            show_icon: "../../images/close.png",
            collect: 0,
            showActionMenu: false, // 添加菜单显示状态属性，默认不显示
          };
        });
        // console.log(tempanswerList);
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
          // console.log(formattedTime);

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
          // console.log(that.data.username);
          if (that.data.username == item.name) {
            item.is_delete = false;
            item.is_modify = false;
            item.more_class = "more1";
          } else {
            item.is_delete = true;
            item.is_modify = true;
            item.more_class = "more2";
          }

          // 初始化菜单显示状态
          item.showActionMenu = false;
        });
        // console.log(tempanswerList);
        // console.log(res.data.data.pages);

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
  // 这个不是滚动视图
  // upper: function () {
  //   wx.showNavigationBarLoading();
  // 这个不是没了吗
  // this.refresh();
  //   console.log("upper");
  //   setTimeout(function () {
  //     wx.hideNavigationBarLoading();
  //     wx.stopPullDownRefresh();
  //   }, 2000);
  // },
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
  // 展开相关的
  show: function (e) {
    const index = e.currentTarget.dataset.index;
    const nowanswerList = this.data.answerList;
    // console.log(index);
    nowanswerList[index].is_show = !nowanswerList[index].is_show;
    // console.log(nowanswerList[index]);
    if (nowanswerList[index].is_show == true) {
      nowanswerList[index].show_icon = "../../images/open.png";
    } else {
      nowanswerList[index].show_icon = "../../images/close.png";
    }

    this.setData({
      answerList: nowanswerList,
    });
  },
  likeQuestion() {
    wx.showToast({
      title: '功能未实现',
      icon:'none'
    })
    // 没写好
    return
    var that = this;
    var questionData = this.data.question;

    // TODO: 后端实现有问题，提问者ID无法获取，点赞功能暂时不可用
    // 判断是否已登录
    if (wx.getStorageSync('isLoggedIn') != true) {
      wx.showToast({
        title: "请先登录",
        icon: "none",
        duration: 1000,
      });
      return;
    }

    // 更新UI状态
    questionData.is_liked = !questionData.is_liked;
    if (questionData.is_liked) {
      questionData.likeCount += 1;
    } else {
      questionData.likeCount = Math.max(0, questionData.likeCount - 1);
    }

    this.setData({
      question: questionData
    });

    // 发送点赞请求到后端
    wx.request({
      url: app.globalData.backend + "/api/answerly/v1/question/like",
      method: "POST",

      header: app.getRequestHeader(),
      data: {
        id: this.data.question_id,
        entityUserId: this.data.question.authorUserId
      },
      success: function (res) {
        console.log("点赞操作响应:", res.data);
        if (res.data.code !== "0") {
          // 如果请求失败，回滚UI状态
          wx.showToast({
            title: "操作失败",
            icon: "none",
            duration: 1000
          });

          questionData.is_liked = !questionData.is_liked;
          if (questionData.is_liked) {
            questionData.likeCount += 1;
          } else {
            questionData.likeCount = Math.max(0, questionData.likeCount - 1);
          }

          that.setData({
            question: questionData
          });
        } else {
          // 操作成功提示
          wx.showToast({
            title: questionData.is_liked ? "点赞成功" : "取消点赞",
            icon: questionData.is_liked ? "success" : "none",
            duration: 1000
          });
        }
      },
      fail: function (err) {
        console.error("点赞请求失败:", err);
        // 请求失败，回滚UI状态
        wx.showToast({
          title: "网络错误",
          icon: "none",
          duration: 1000
        });

        questionData.is_liked = !questionData.is_liked;
        if (questionData.is_liked) {
          questionData.likeCount += 1;
        } else {
          questionData.likeCount = Math.max(0, questionData.likeCount - 1);
        }

        that.setData({
          question: questionData
        });
      }
    });
  },
  collect_answer(e) {
    // 目前没用到
    return
    console.log("collect_answer");
    //校验是否已经登录
    if (wx.getStorageSync('isLoggedIn') == true) {
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
    
    // 目前没用到
    return
    // TODO: 后端实现有问题，回答点赞功能暂时不可用，目前只是前端模拟效果
    //校验是否已经登录
    if (wx.getStorageSync('isLoggedIn') == true) {
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
          app.globalData.backend + "/api/answerly/v1/comment/like?id=" + like_id;
        wx.request({
          url: like_url,
          method: "POST",
          // data: {
          //   id: like_id,
          // },

          header: app.getRequestHeader(),
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
        // TODO: 取消点赞的API不存在，只能前端模拟效果
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
        url: app.globalData.backend + "/api/answerly/v1/comment/page",
        method: "GET",
        data: {
          id: this.data.question_id,
          size: this.data.size,
          current: this.data.current_page,
        },

        header: app.getRequestHeader(),
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
                  app.globalData.ossPrefix
                ) == -1 &&
                item != ""
              ) {
                return app.globalData.ossPrefix + item;
              } else if (item != "") {
                return item;
              }
            });
          });

          console.log("tempimages加上前缀");
          console.log(tempimages);
          var tempanswerList = temp.map((item) => {
            if (item.avatar == null) {
              item.avatar = "../../images/defaultAvatar.png";
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
              show_icon: "../../images/close.png",
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
          app.globalData.backend + "/api/answerly/v1/comment?id=" +
          that.data.answerList[index].id;
        if (res.confirm) {
          wx.request({
            url: delete_url,

            header: app.getRequestHeader(),
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
        url: app.globalData.backend + "/api/answerly/v1/comment/page",
        method: "GET",
        data: {
          id: this.data.question_id,
          size: this.data.size,
          current: this.data.current_page + 1,
        },

        header: app.getRequestHeader(),
        success: function (res) {
          var temp = res.data.data.records;
          var tempimages = temp.map((item) => {
            //将逗号分割的图片字符串，转化为图片数组
            return item.images.split(",");
          });

          tempimages = tempimages.map((item) => {
            //加上../../images/前缀
            return item.map((item) => {
              //没有前缀的图片加上前缀，有前缀的图片保持不变
              //为空的元素去除
              if (
                item.indexOf(
                  app.globalData.ossPrefix
                ) == -1 &&
                item != ""
              ) {
                return app.globalData.ossPrefix + item;
              } else if (item != "") {
                return item;
              }
            });
          });

          var tempanswerList = temp.map((item) => {
            if (item.avatar == null) {
              item.avatar = "../../images/defaultAvatar.png";
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
              show_icon: "../../images/close.png",
              collect: 0,
            };
          });
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
  // 添加新的交互方法
  toggleActionMenu(e) {
    const index = e.currentTarget.dataset.index;
    const answerList = this.data.answerList;

    // 关闭其他可能打开的菜单
    answerList.forEach((item, idx) => {
      if (idx !== index && item.showActionMenu) {
        item.showActionMenu = false;
      }
    });

    // 切换当前选中项的菜单显示状态
    answerList[index].showActionMenu = !answerList[index].showActionMenu;

    this.setData({
      answerList: answerList
    });
  },
  // 不知道在干嘛，应该用catchtap即可
  // 添加阻止事件冒泡的方法
  // stopPropagation() {
  // 阻止冒泡，防止点击菜单时触发外部的点击事件
  // return;
  // },

  // 添加点击页面任意位置关闭菜单的方法
  onTapPage(e) {
    console.log('onTapPage');
    // console.log(e);
    const answerList = this.data.answerList;
    let needUpdate = false;

    answerList.forEach(item => {
      if (item.showActionMenu) {
        item.showActionMenu = false;
        needUpdate = true;
      }
    });

    if (needUpdate) {
      this.setData({
        answerList: answerList
      });
    }
  },
  // 这个改成非冒泡即可
  // onUnload: function () {
  //   // 页面卸载时移除事件监听
  //   wx.createSelectorQuery()
  //     .select('.container')
  //     .boundingClientRect()
  //     .exec((res) => {
  //       if (res && res[0]) {
  //         const container = res[0];
  //         container.removeEventListener('tap', this.onTapPage);
  //       }
  //     });
  // },
  // 设置需要刷新的标志
  setNeedRefresh: function () {
    console.log("设置问题页面需要刷新标志");
    needRefresh = true;
    this.needRefresh = true; // 同时设置实例变量
  },

  // 添加onShow方法，检查是否需要刷新
  onShow: function () {
    console.log("问题页面显示, needRefresh=", needRefresh, "this.needRefresh=", this.needRefresh, "is_post=", wx.getStorageSync("is_post"));

    // 检查全局变量、实例变量或Storage中的发布标志
    if (needRefresh || this.needRefresh || wx.getStorageSync("is_post") === "true") {
      console.log("需要刷新问题数据");

      // 清除Storage中的发布标志
      if (wx.getStorageSync("is_post") === "true") {
        wx.setStorageSync("is_post", false);
      }

      // 延迟刷新，确保后端数据已更新
      setTimeout(() => {
        this.getData(); // 重新加载数据
        needRefresh = false; // 重置全局标志
        this.needRefresh = false; // 重置实例标志

        // 刷新成功提示
        wx.showToast({
          title: '刷新成功',
          icon: 'success',
          duration: 1500
        });
      }, 800);
    }
  },
});
