Page({
  data: {
    choose:[
      {
        'name':'科目',
        'item':['数学分析','高等代数','程序设计'],
        number:0,
        drop:true
      },
      {
        'name':'排序',
        'item':['浏览量','点赞量',],
        number:0,
        drop:true
      },
      {
        'name':'顺序',
        'item':['递增','递减',],
        number:0,
        drop:true
      }
    ]
  },
  // 处理点击选项跳转
  onNavigate: function (event) {
    const chooseIndex = event.currentTarget.dataset.chooseItem; // 获取大类索引
    const chooseItemIndex = event.currentTarget.dataset.chooseItemIndex; // 获取具体选项索引
    const selectedItem = this.data.choose[chooseIndex].item[chooseItemIndex]; // 获取点击的具体选项

    // 如果点击的是 "数学分析"，则跳转到相应页面
    if (selectedItem === '数学分析'||selectedItem === '高等代数'||selectedItem === '程序设计') {
      wx.navigateTo({
        url: '/pages/list/list', // 替换为实际的页面路径
      });
    }
  },
  showDrop:function(event){
    const index = event.currentTarget.dataset.chooseIndex;
    let choose = this.data.choose;
    choose[index].drop = !choose[index].drop;
    this.setData({
      choose: choose
    });
  },
  choose:function(event){
    let choose=this.data.choose;
    choose[event.currentTarget.dataset.chooseItem].number=event.currentTarget.dataset.chooseItemIndex;
    choose[event.currentTarget.dataset.chooseItem].drop=false
    this.setData({
      choose:choose
    })
  }
})
