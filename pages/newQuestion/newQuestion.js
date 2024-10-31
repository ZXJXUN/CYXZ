// pages/newQuestion/newQuestion.js
Page({
  inputTitle:function(event){
    this.setData({
      title:event.detail.value
    })
  },
  inputContent:function(event){
    this.setData({
      content:event.detail.value
    })
  },
  pushQuestion: function () {
    let that=this
    let uploadPromises = []; // 存储上传的 Promise
    let imgsUrl = this.data.imgsUrl;
    this.data.imgs.forEach((v, i) => {
      const uploadPromise = new Promise((resolve, reject) => {
        wx.uploadFile({
          filePath: v,
          name: 'file',
          url: 'http://api.lxzz.top:25251/xcx/imgs',
          success: function (result) {
            imgsUrl.push(JSON.parse(result.data).url)
            that.setData({
              imgsUrl:imgsUrl
            })
            console.log("imgs ok");
            resolve(); // 上传成功，解决 Promise
          },
          fail: function (error) {
            console.log("imgs fail", error);
            reject(error)
          }
        })
      })
      uploadPromises.push(uploadPromise); // 将 Promise 添加到数组中
    })
    Promise.all(uploadPromises).then(() => {
      wx.request({
        url: 'http://api.lxzz.top:25251/xcx/newquestion',
        method: 'POST',
        data: JSON.stringify({
          title: this.data.title,
          content: this.data.content,
          pictures: this.data.imgsUrl
        }),
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log("newQuetiong ok", res.data)
          that.setData({
            imgs:[],
            imgsUrl:[],
            title:'',
            content:''
          })
        },
        fail: function (err) {
          console.log(err)
        }
      })
    })
    
  },
  handleChooseImg: function () {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          imgs: [...this.data.imgs, ...result.tempFilePaths]
        })
      }
    })
  },
  removeImg: function (event) {
    let imgs = this.data.imgs;
    imgs.splice(event.currentTarget.dataset.imgRemoveIndex, 1)
    this.setData({
      imgs: imgs
    })
  },
  viewImg: function (event) {
    wx.previewImage({
      urls: this.data.imgs,
      current: this.data.imgs[event.currentTarget.dataset.imgViewIndex]
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [

    ],
    imgsUrl: [
    ],
    title:'',
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})