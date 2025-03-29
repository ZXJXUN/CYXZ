var app = getApp();
var isLoggedIn = wx.getStorageSync("isLoggedIn");
// 添加全局变量，用于控制列表是否需要刷新
var needRefresh = false; // 改用var而不是let，确保在页面实例中可访问

Page({
  data: {
    // 默认feed数据，用于在未获取到后端数据时占位
    feed: [{
      title: "样例问题标题",
      content: "样例问题内容",
      good_num: 0,
      comment_num: 0,
    }, ],
    // 当前页码，用于分页请求
    currentPage: 1,
    // 分类ID，可根据实际需求修改
    category: 0,
    // 是否已解决的标识，0表示未解决
    solved_flag: 2,
    //搜索
    keyword: "",
    // 标记是否已初始化
    isInitialized: false
  },

  onLoad: function (options) {
    // 确保科目ID是数字
    const selectedSubject = Number(options.id || 0);
    this.setData({
      category: selectedSubject,
      isInitialized: true
    });

    // 检查是否需要强制刷新
    if (options.refresh === 'true' || options.t) {
      needRefresh = true;
      // 立即刷新
      this.refreshListWithDelay(500);
    } else {
      this.getFeedData(1); // 初次加载第一页的数据
    }

    // 将needRefresh变量直接挂载到页面实例上，方便外部访问
    this.needRefresh = needRefresh;
  },

  // 添加onShow方法，当页面显示时根据needRefresh决定是否刷新
  onShow: function () {
    console.log("列表页面显示, needRefresh=", needRefresh, "this.needRefresh=", this.needRefresh);

    // 检查全局变量或实例变量
    if (needRefresh || this.needRefresh) {
      console.log("需要刷新列表数据");

      // 使用更长的延迟确保后端数据已更新
      this.refreshListWithDelay(800);
    }
  },

  // 统一的延迟刷新函数
  refreshListWithDelay: function (delay) {
    // 清除之前的定时器
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // 设置新的定时器
    this.refreshTimer = setTimeout(() => {
      this.getFeedData(1); // 重新加载第一页数据
      needRefresh = false; // 重置全局标志
      this.needRefresh = false; // 重置实例标志
    }, delay);
  },

  // 设置需要刷新的标志
  setNeedRefresh: function () {
    console.log("设置需要刷新标志");
    needRefresh = true;
    this.needRefresh = true; // 同时设置实例变量
  },

  // 获取问答数据
  getFeedData: function (page) {
    let that = this;
    // console.log("开始获取问题列表数据:");
    // console.log("- category:", that.data.category);
    // console.log("- solved_flag:", that.data.solved_flag);
    // console.log("- currentPage:", page); // 使用参数page而不是data中的currentPage
    // console.log("- keyword:", that.data.keyword);

    // 显示加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true
    });

    // 构建请求数据
    const requestData = {
      categoryId: that.data.category,
      solvedFlag: that.data.solved_flag,
      size: 10,
      current: page,
      keyword: that.data.keyword,
      _t: Date.now() // 添加时间戳防止缓存
    };

    // console.log("请求参数:", requestData);

    wx.request({
      url: app.globalData.backend + "/api/answerly/v1/question/page", // 基础URL，不带参数
      header: app.getRequestHeader(),
      data: requestData,
      success(res) {
        // 隐藏加载提示
        wx.hideLoading();

        if (res.statusCode === 200 && res.data.code == 0 && res.data.data && res.data.data.records) {
          // console.log("列表数据获取成功, 状态码:", res.statusCode);
          // console.log("数据条数:", res.data.data.records.length);

          // 处理数据
          let records = res.data.data.records.map(item => {
            // 保留HTML标签
            if (item.title) {
              item.title = item.title.replace(/<mark>/g, '<b>').replace(/<\/mark>/g, '</b>');
            }
            if (item.content) {
              item.content = item.content.replace(/<mark>/g, '<b>').replace(/<\/mark>/g, '</b>');
            }
            return item;
          });

          // 如果是第一页，替换数据；否则追加数据
          let newFeed = page === 1 ? records : that.data.feed.concat(records);

          that.setData({
            feed: newFeed,
            currentPage: page,
          });

          // 显示列表项数量
          // console.log("渲染列表项数量:", newFeed.length);

          // 如果是因为发布新问题而刷新的，显示成功提示
          if (needRefresh || that.needRefresh) {
            wx.showToast({
              title: '刷新成功',
              icon: 'success',
              duration: 1500
            });
          }
        } else if (
          res.statusCode === 200 &&
          res.data.data &&
          res.data.data.records &&
          res.data.data.records.length == 0
        ) {
          // console.log("获取到空列表");

          // 如果是第一页且结果为空
          if (page === 1) {
            that.setData({
              feed: [] // 设置为空数组
            });

            wx.showToast({
              title: "暂无问题",
              icon: "none",
              duration: 2000,
            });
          } else {
            // 如果是加载更多但没有更多数据
            wx.showToast({
              title: "没有更多数据了",
              icon: "none",
              duration: 2000,
            });
          }
        } else {
          console.error("获取数据失败，响应:", res);

          wx.showToast({
            title: res.data.message || "加载失败，请检查网络",
            icon: "none",
            duration: 2000,
          });
        }
      },
      fail(err) {
        wx.hideLoading();
        console.error("请求失败:", err);

        wx.showToast({
          title: "加载失败，请检查网络",
          icon: "none",
          duration: 2000,
        });
      },
      complete() {
        // 完成时也隐藏加载提示，确保不会出现加载提示无法关闭的情况
        wx.hideLoading();
      }
    });
  },

  // 下拉刷新 - 重新加载第一页数据
  upper: function () {
    // console.log("触发下拉刷新");

    // 重置关键字搜索和页码
    this.setData({
      keyword: "",
      currentPage: 1
    });

    // 设置需要刷新
    this.setNeedRefresh();

    // 延迟刷新
    this.refreshListWithDelay(300);
  },

  // 上拉加载更多 - 加载下一页数据
  lower: function () {
    console.log("触发上拉加载更多");

    // 显示加载提示
    wx.showLoading({
      title: "加载更多...",
      mask: true
    });

    // 计算要加载的页码
    const nextPage = this.data.currentPage + 1;
    // console.log(`加载第${nextPage}页数据`);

    // 直接加载下一页
    this.getFeedData(nextPage);
  },

  // 发布问题的跳转
  publishQuestion: function () {
    if (wx.getStorageSync('isLoggedIn')) {
      // console.log("检验成功");
      //我觉得没登陆才需要toast
      // wx.showToast({
      //   title: "已登录",
      //   icon: "success",
      // });
      // setTimeout(() => {
        // console.log("Navigating to new page...");
        wx.navigateTo({
          url: `../newQuestion/newQuestion?categoryId=${this.data.category}`, // 传递当前科目ID
        });
      // }, 500);
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

  // 跳转到问题详情页
  bindQueTap: function (event) {
    const selectedQuestion = event.currentTarget.dataset.question; // 获取点击的科目名称
    wx.navigateTo({
      url: `../question/question?id=${selectedQuestion}`,
    });
  },

  onSearchInput: function (e) {
    this.setData({
      keyword: e.detail.value,
    });
  },

  // 点击搜索按钮或回车触发搜索
  searchQuestions: function () {
    // 搜索时重新从第一页获取数据
    this.getFeedData(1);
  },
});