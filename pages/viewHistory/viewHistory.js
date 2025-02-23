// pages/viewHistory/viewHistory.js
Page({
  data: {
    historyList: [],
    current: 1,
    size: 10,
    hasMore: true,
    loading: false,
  },

  onLoad() {
    this.loadHistory();
  },

  loadHistory() {
    if (!this.data.hasMore || this.data.loading) {
      return; // 如果没有更多数据或正在加载中，则不执行加载
    }

    this.setData({
      loading: true
    });

    wx.request({
      url: 'https://yuanzhida.top:8000/api/answerly/v1/question/recent/page', // 替换为你的浏览历史 API 地址
      method: 'GET',
      data: {
        current: this.data.current,
        size: this.data.size,
      },
      header: {
        token: wx.getStorageSync("token"),
        username: wx.getStorageSync("name"),
      },
      success: (res) => {
        if (res.data.code === '0') {
          const newHistory = res.data.data.records;
          const hasMore = res.data.data.current * res.data.data.size < res.data.data.total;
          this.setData({
            historyList: this.data.historyList.concat(newHistory),
            current: res.data.data.current + 1,
            hasMore: hasMore,
            loading: false,
          });
        } else {
          // 错误处理
          wx.showToast({
            title: '请求失败',
            icon: 'none',
          });
          this.setData({
            loading: false,
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
        });
        this.setData({
          loading: false,
        });
      },
    });
  },

  onReachBottom() {
    this.loadHistory();
  },

  navigateToDetail(e) {
    const questionId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/question/question?id=${questionId}`, // 跳转到问题详情页
    });
  },
});