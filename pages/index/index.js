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
