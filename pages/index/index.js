Page({
  data:{
    subjects:[]
  },
  onReady:function () {
    wx.request({
      url: 'https://nurl.top:8000/api/answerly/v1/category',
      header: {
        'token': "884bb5d6-b524-4f31-83c4-bf9243c89bf0",
        'username': "aaa"
      },
      success:(res)=>{
        console.log(res.data.data);
        this.setData({subjects:res.data.data})
      }
    })
  },
  // 处理点击科目跳转
  onNavigate: function (event) {
    console.log(123);
    const selectedSubject = event.currentTarget.dataset.subject; // 获取点击的科目名称
    console.log(selectedSubject);
      wx.navigateTo({
        url: `/pages/list/list?id=${selectedSubject}`, // 这里是跳转的目标页面
      });

    // 根据选中的科目跳转
    // if (selectedSubject === '数学分析' || selectedSubject === '高等代数' || selectedSubject === '程序设计' || selectedSubject === '基础物理' || selectedSubject === '数据结构' || selectedSubject === '离散数学') {
    //   wx.navigateTo({
    //     url: '/pages/list/list', // 这里是跳转的目标页面
    //   });
    // }
  }
});
