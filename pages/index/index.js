const app = getApp();
Page({
  data: {
    subjects: [],
  },
  onReady: function () {
    wx.request({
      url: app.globalData.backend+"/api/answerly/v1/category",
      header: app.getRequestHeader(),
      success: (res) => {
        this.setData({
          subjects: res.data.data,
        });
      },
      failure: (err) => {
        console.log(err);
        wx.showToast({
          title: '请求失败',
          icon:'error'
        })
      },
    });
  },
  // 处理点击科目跳转
  onNavigate: function (event) {
    const selectedSubject = event.currentTarget.dataset.subject; // 获取点击的科目名称
      wx.navigateTo({
        url: `/pages/list/list?id=${selectedSubject}`, // 这里是跳转的目标页面
      });
  },
});
