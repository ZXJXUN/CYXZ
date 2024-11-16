import Notify from '@vant/weapp/notify/notify'
Page({
  deletePic:function(event) {
    const {picList}=this.data
    picList.splice(event.detail.index,1)
    this.setData({picList})
  },
  addPic:function(event){
    const {file:pics}=event.detail
    const {picList}=this.data
    for (let i = 0; i < pics.length; i++) {
      
      picList.push({url:pics[i].url})
      
    }
    this.setData({picList})
  },
  showSubjectPicker:function() {
    this.setData({isShowSubjectPicker:!this.data.isShowSubjectPicker})
  },
  subjectChoose:function(event){
    this.showSubjectPicker()
    this.setData({choosedSubject:event.detail.index})
    console.log(this.data.choosedSubject);
  },
  submit:async function(){
    await Promise.all(this.data.picList.map((pic)=>{
      return new Promise((resolve,reject)=>{
        wx.uploadFile({
          filePath: pic.url,
          name: 'file',
          url: "http://47.120.26.83:8000/oss/upload",
          header:{
            'username':'ab',
            'token':'6927fe4d-a141-47e6-9e11-faf68d2ab601'
          },
          success:(res)=>{
            console.log(res.data)
            resolve(res)
          },
          fail:(err)=>{
            console.log(err);
            reject(err)
          }
        })
      })
    })).then(()=>{
      wx.request({
        url: 'http://47.120.26.83:8000/api/answerly/v1/question',
        header:{
          'username':'ab',
          'token':'6927fe4d-a141-47e6-9e11-faf68d2ab601',
          'Content-Type':'application/json'
        },
        method:'POST',
        data:{
          "content": this.data.content,
          "title": this.data.title,
          "user_id": 0,
          "category": this.data.choosedSubject,
          "pictures": this.data.picList
        },
        success:(res)=>{
          console.log(res.data)
          Notify({ type: 'success', message: '提交成功',selector:'#van-notify' ,context:this});
          this.setData({
            isShowSubjectPicker:false,
            picList: [],
            choosedSubject:0,
            content:'',
            title:''
          })
        },
        fail:(err)=>{
          console.log(err);
          Notify({ type: 'warning', message: '提交失败',selector:'#van-notify',context:this});
        }
      })
    })
  },
  data: {
    isShowSubjectPicker:false,
    picList: [],
    subjectList: ['高等代数', '基础物理', '离散数学', '数据结构', '程序设计'],
    choosedSubject:0,
    content:'',
    title:''
  },
});