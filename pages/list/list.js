var app = getApp();
Page({
  data: {
    // 默认feed数据，用于在未获取到后端数据时占位
    feed: [
      {
        feed_source_img: '../../images/default_avatar.png', // 默认头像
        feed_source_name: '默认用户',
        feed_source_txt: '未知内容',
        question: '示例问题：如何优化前端性能？',
        answer_ctnt: '这里是示例答案内容，实际答案将显示在这里。',
        good_num: 0,
        comment_num: 0
      },
      {
        feed_source_img: '../../images/default_avatar.png', // 默认头像
        feed_source_name: '默认用户',
        feed_source_txt: '未知内容',
        question: '示例问题：如何优化前端性能？',
        answer_ctnt: '这里是示例答案内容，实际答案将显示在这里。',
        good_num: 0,
        comment_num: 0
      },
      {
        feed_source_img: '../../images/default_avatar.png', // 默认头像
        feed_source_name: '默认用户',
        feed_source_txt: '未知内容',
        question: '示例问题：如何优化前端性能？',
        answer_ctnt: '这里是示例答案内容，实际答案将显示在这里。',
        good_num: 0,
        comment_num: 0
      },
      {
        feed_source_img: '../../images/default_avatar.png', // 默认头像
        feed_source_name: '默认用户',
        feed_source_txt: '未知内容',
        question: '示例问题：如何优化前端性能？',
        answer_ctnt: '这里是示例答案内容，实际答案将显示在这里。',
        good_num: 0,
        comment_num: 0
      },
      {
        feed_source_img: '../../images/default_avatar.png', // 默认头像
        feed_source_name: '默认用户',
        feed_source_txt: '未知内容',
        question: '示例问题：如何优化前端性能？',
        answer_ctnt: '这里是示例答案内容，实际答案将显示在这里。',
        good_num: 0,
        comment_num: 0
      },
      {
        feed_source_img: '../../images/default_avatar.png', // 默认头像
        feed_source_name: '默认用户',
        feed_source_txt: '未知内容',
        question: '示例问题：如何优化前端性能？',
        answer_ctnt: '这里是示例答案内容，实际答案将显示在这里。',
        good_num: 0,
        comment_num: 0
      }
    ],
    feed_length: 1, // 默认数据的条目数量
    // 当前页码，用于分页请求
    currentPage: 0,
    // 分类ID，可根据实际需求修改
    category: 0,
    // 是否已解决的标识，0表示未解决
    solved_flag: 0,
    // 筛选选择器
    choose: {
      number: -1,
      list: [
        {
          name: '排序',
          item: ['浏览量', '点赞量', '发布时间', '最新回答时间'],
          number: 0
        },
        {
          name: '顺序',
          item: ['递增', '递减'],
          number: 0
        }
      ]
    }
  },  

  onLoad: function () {
    console.log('页面加载中');
    this.getFeedData(0); // 初次加载第一页的数据
  },

  // 获取问答数据
  getFeedData: function (page) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: '', // API地址
      method: 'GET',
      data: {
        category: that.data.category,
        page: page,
        solved_flag: that.data.solved_flag // 可选参数，根据需求设置
      },
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        wx.hideLoading();
        if (res.statusCode === 200 && res.data ) {
          let newFeed = page === 0 ? res.data : that.data.feed.concat(res.data); // 如果是第一页，替换数据；否则追加数据
          that.setData({
            feed: newFeed,
            feed_length: newFeed.length,
            currentPage: page
          });
        } else {
          console.error("获取数据失败：", res);
          wx.showToast({
            title: '加载失败，请检查网络',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail(err) {
        wx.hideLoading();
        console.error("请求失败：", err);
        wx.showToast({
          title: '加载失败，请检查网络',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 下拉刷新
  refresh: function () {
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 3000
    });
    this.getFeedData(0); // 刷新时重新加载第一页数据
    setTimeout(() => {
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 2000
      });
    }, 3000);
  },

  // 加载更多数据
  nextLoad: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 4000
    });
    let nextPage = this.data.currentPage + 1; // 计算下一页页码
    this.getFeedData(nextPage); // 获取下一页数据
    setTimeout(() => {
      wx.showToast({
        title: '加载成功',
        icon: 'success',
        duration: 2000
      });
    }, 3000);
  },

  // 发布问题的跳转
  publishQuestion: function() {
    wx.navigateTo({
      url: '../newQuestion/newQuestion'
    });
  },

  // 跳转到问题详情页
  bindItemTap: function() {
    wx.navigateTo({
      url: '../question/question'
    });
  },

  bindQueTap: function() {
    wx.navigateTo({
      url: '../question/question'
    });
  },

  // 显示下拉选项
  showDrop: function(event) {
    const index = event.currentTarget.dataset.chooseIndex;
    let choose = this.data.choose;
    choose.number = choose.number === index ? -1 : index;
    this.setData({
      choose: choose
    });
  },

  // 选择排序或顺序选项
  choose: function(event) {
    let choose = this.data.choose;
    choose.list[event.currentTarget.dataset.chooseItem].number = event.currentTarget.dataset.chooseItemIndex;
    choose.number = -1;
    this.setData({
      choose: choose
    });
  }
});
