Page({
  // 处理点击科目跳转
  onNavigate: function (event) {
    const selectedSubject = event.currentTarget.dataset.subject; // 获取点击的科目名称

    // 根据选中的科目跳转
    if (selectedSubject === '数学分析' || selectedSubject === '高等代数' || selectedSubject === '程序设计' || selectedSubject === '基础物理' || selectedSubject === '数据结构' || selectedSubject === '离散数学') {
      wx.navigateTo({
        url: '/pages/list/list', // 这里是跳转的目标页面
      });
    }
  }
});
