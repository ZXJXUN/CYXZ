var app = getApp();
var isLoggedIn = wx.getStorageSync("isLoggedIn");
Page({
  data: {
    // 默认feed数据，用于在未获取到后端数据时占位
    feed: [
      {
        title: "这是一个问题",
        content: "这是问题的详情的缩略",
        good_num: 0,
        comment_num: 0,
      },
    ],
    // 当前页码，用于分页请求
    currentPage: 1,
    // 分类ID，可根据实际需求修改
    category: 0,
    // 是否已解决的标识，0表示未解决
    solved_flag: 2,
  },

  onLoad: function (options) {
    console.log("页面加载中");
    const selectedSubject = options.id;
    console.log({selectedSubject});
    this.setData(
      {
        category: selectedSubject
      }
    );
    this.getFeedData(1); // 初次加载第一页的数据
  },

  // 获取问答数据
  getFeedData: function (page) {
    let that = this;
    console.log(that.data.category);
    console.log(that.data.solved_flag);
    console.log(that.data.currentPage);
    wx.request({
      url: "https://nurl.top:8000/api/answerly/v1/question/page", // 基础URL，不带参数
      method: "GET", // 请求方法
      header: {
        token: "29b04146-b2de-4733-b0f5-fba06f7b45fe", // 请求头中的token
        username: "ab", // 请求头中的username
      },
      data: {
        categoryId: that.data.category,
        solvedFlag: that.data.solved_flag,
        size: 10,
        current: page,
      },
      success(res) {
        if (res.statusCode === 200 && res.data.data.records) {
          console.log("list get success");
          console.log(res.data.data.records);
          let newFeed =
            page === 1
              ? res.data.data.records
              : that.data.feed.concat(res.data.data.records); // 如果是第一页，替换数据；否则追加数据
          that.setData({
            feed: newFeed,
            currentPage: page,
          });
        } else if (
          res.statusCode === 200 &&
          res.data.data.records.length == 0
        ) {
          console.error("数据库为空", res);
          wx.showToast({
            title: "暂无问题",
            icon: "none",
            duration: 2000,
          });
        } else {
          console.error("获取数据失败：", res);
          wx.showToast({
            title: "加载失败，请检查网络",
            icon: "none",
            duration: 2000,
          });
        }
      },
      fail(err) {
        wx.hideLoading();
        console.error("请求失败：", err);
        wx.showToast({
          title: "加载失败，请检查网络",
          icon: "none",
          duration: 2000,
        });
      },
    });
  },

  // 下拉刷新
  upper: function () {
    wx.showToast({
      title: "刷新中",
      icon: "loading",
    });
    this.getFeedData(1); // 刷新时重新加载第一页数据
    wx.hideLoading();
    wx.showToast({
      title: "刷新成功",
      icon: "success",
      duration: 2000,
    });
  },

  // 加载更多数据
  lower: function () {
    wx.showToast({
      title: "加载中",
      icon: "loading",
    });
    this.getFeedData(this.data.currentPage + 1); // 获取下一页数据
    wx.hideLoading();
    wx.showToast({
      title: "加载成功",
      icon: "success",
      duration: 2000,
    });
  },

  // 发布问题的跳转
  publishQuestion: function () {
    if (isLoggedIn) {
      console.log("检验成功");
      wx.showToast({
        title: "已登录",
        icon: "success",
      });
      setTimeout(() => {
        console.log("Navigating to new page...");
        wx.navigateTo({
          url: "../newQuestion/newQuestion", //验证成功至新问题界面
        });
      }, 500);
    } else {
      wx.showToast({
        title: "提问题请先登录哦~",
        icon: "none",
      });
      console.log(app.globalData.name, app.globalData.token);
      console.log(app.globalData.isLoggedIn);
      setTimeout(() => {
        console.log("Navigating to login page...");
        wx.navigateTo({
          url: "../login/login",
        });
      }, 500);
    }
  },

  // 跳转到问题详情页
  bindQueTap: function () {
    wx.navigateTo({
      url: "../question/question",
    });
  },
});
