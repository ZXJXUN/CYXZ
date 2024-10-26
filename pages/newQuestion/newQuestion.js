// pages/newQuestion/newQuestion.js
Page({
  handleChooseImg:function(){
    wx.chooseImage({
      count:9,
      sizeType:['original','compressed'],
      sourceType:['album','camera'],
      success:(result)=>{
        this.setData({
          imgs:[...this.data.imgs,...result.tempFilePaths]
        })
      }
    })
  },
  removeImg:function(event){
    let imgs=this.data.imgs;
    imgs.splice(event.currentTarget.dataset.imgRemoveIndex,1)
    this.setData({
      imgs:imgs
    })
  },
  viewImg:function(event){
    wx.previewImage({
      urls: this.data.imgs,
      current:this.data.imgs[event.currentTarget.dataset.imgViewIndex]
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    imgs:[

    ]
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