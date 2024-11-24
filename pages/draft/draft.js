var app = getApp();
Page({
  previewPicture:function (event) {
    let pictures=event.currentTarget.dataset.pictures
    let picture=event.currentTarget.dataset.picture
    wx.previewImage({
      urls: pictures,
      current:picture
    })
  },
  publish:function (event) {
    wx.showModal({
      title: '提示',
      content: '是否发布',
      complete: (res) => {
        if (res.cancel) {
          
        }
    
        if (res.confirm) {
          let index=event.currentTarget.dataset.index
          let list=this.data.drafts
          wx.navigateTo({
            url:"../newQuestion/newQuestion?draft="+JSON.stringify(list[index])
          })
        }
      }
    })
  },
  delete: function (event) {
    wx.showModal({
      title: '提示',
      content: '是否删除',
      complete: (res) => {
        if (res.cancel) {
        }
        if (res.confirm) {
          let list = this.data.drafts
          let index = event.currentTarget.dataset.index
          list.splice(index, 1)
          this.setData({
            drafts: list
          })
        }
      }
    })
  },
  data: {
    // 默认feed数据，用于在未获取到后端数据时占位
    drafts: [{
        draft_title: 'title1', // 默认头像
        draft_content: 'content',
        draft_pictures: [
          "https://oss-symbol.oss-cn-beijing.aliyuncs.com/2024/11/23/a56df95c-de3c-4c63-8470-ab0a0f567fa3.png",
          "https://oss-symbol.oss-cn-beijing.aliyuncs.com/2024/11/23/a56df95c-de3c-4c63-8470-ab0a0f567fa3.png",
          "https://oss-symbol.oss-cn-beijing.aliyuncs.com/2024/11/23/a56df95c-de3c-4c63-8470-ab0a0f567fa3.png",
          "https://oss-symbol.oss-cn-beijing.aliyuncs.com/2024/11/23/a56df95c-de3c-4c63-8470-ab0a0f567fa3.png",
          "https://oss-symbol.oss-cn-beijing.aliyuncs.com/2024/11/23/a56df95c-de3c-4c63-8470-ab0a0f567fa3.png",
          "https://oss-symbol.oss-cn-beijing.aliyuncs.com/2024/11/23/a56df95c-de3c-4c63-8470-ab0a0f567fa3.png",
          "https://oss-symbol.oss-cn-beijing.aliyuncs.com/2024/11/23/a56df95c-de3c-4c63-8470-ab0a0f567fa3.png",
          "https://oss-symbol.oss-cn-beijing.aliyuncs.com/2024/11/23/a56df95c-de3c-4c63-8470-ab0a0f567fa3.png",
          "https://oss-symbol.oss-cn-beijing.aliyuncs.com/2024/11/23/a56df95c-de3c-4c63-8470-ab0a0f567fa3.png"

        ],
        draft_time: "time",
        draft_category: 0
      },
      {
        draft_title: 'title2', // 默认头像
        draft_content: 'content',
        draft_pictures: [
          "https://oss-symbol.oss-cn-beijing.aliyuncs.com/2024/11/23/a56df95c-de3c-4c63-8470-ab0a0f567fa3.png"
        ],
        draft_time: "time",
        draft_category: 0
      },
      {
        draft_title: 'title3', // 默认头像
        draft_content: 'content',
        draft_pictures: [],
        draft_time: "time",
        draft_category: 0
      }
    ],
    feed_length: 1, // 默认数据的条目数量
    // 当前页码，用于分页请求
    currentPage: 0,
    // 分类ID，可根据实际需求修改
    category: 0,
    // 是否已解决的标识，0表示未解决
    solved_flag: 0
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
        if (res.statusCode === 200 && res.data) {
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
  publishQuestion: function () {
    wx.request({
      url: 'http://47.120.26.83:8000/api/answerly/v1/user/check-login',
      method: 'POST',
      data: {
        name: app.globalData.name,
        token: app.globalData.token,
      },

      success: (res) => {
        if (res.data.code === '0' && res.data.message === null && res.data.success === true) {
          console.log('检验成功');
          wx.showToast({
            title: '已登录',
            icon: 'success'
          });
          setTimeout(() => {
            console.log('Navigating to new page...');
            wx.navigateTo({
              url: '../newQuestion/newQuestion', //验证成功至新问题界面
            });
          }, 500);

        } else {
          wx.showToast({
            title: '请先登录哦~',
            icon: 'none'
          });
          console.log('未登录', res.data);
          setTimeout(() => {
            console.log('Navigating to login page...');
            wx.navigateTo({
              url: '../login/login',
            });
          }, 500);
        }
      },
      fail: (error) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
        console.error('检验时网络发生错误', error);
        setTimeout(() => {
          console.log('Navigating to list page...');
          wx.navigateTo({
            url: '../list/list',
          });
        }, 500);
      }
    });
  },

  // 跳转到问题详情页
  bindItemTap: function () {
    wx.navigateTo({
      url: '../question/question'
    });
  },

  bindQueTap: function () {
    wx.navigateTo({
      url: '../question/question'
    });
  }
});