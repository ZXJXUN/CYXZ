Page({
  data: {
    subjects: [],
  },
  onReady: function () {
    wx.request({
      url: "https://nurl.top:8000/api/answerly/v1/category",
      method: "GET",
      header: {
        token: "29b04146-b2de-4733-b0f5-fba06f7b45fe",
        username: "ab",
      },
      success: (res) => {
        console.log("success");
        console.log(res);
        this.setData({
          subjects: res.data.data,
        });
      },
      failure: (err) => {
        console.log(err);
      },
    });
  },
  // 处理点击科目跳转
  onNavigate: function (event) {
    console.log(123);
    const selectedSubject = event.currentTarget.dataset.subject; // 获取点击的科目名称
    wx.navigateTo({
      url: "/pages/list/list", // 这里是跳转的目标页面
    });

    // 根据选中的科目跳转
    // if (selectedSubject === '数学分析' || selectedSubject === '高等代数' || selectedSubject === '程序设计' || selectedSubject === '基础物理' || selectedSubject === '数据结构' || selectedSubject === '离散数学') {
    //   wx.navigateTo({
    //     url: '/pages/list/list', // 这里是跳转的目标页面
    //   });
    // }
  },
});
