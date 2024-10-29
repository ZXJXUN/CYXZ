// pages/newAnswer/newAnswer.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    question_title: "如何学好数分？",
    imageList: [],
    form: {
      ossUrl: [],
    },
  },
  upload_image() {
    let _this = this;
    wx.showActionSheet({
      itemList: ["从相册中选择", "拍一张"],
      itemColor: "#0f92e4c5",
      success(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            // 从相册中选择
            _this.chooseWxImage("album");
          } else if (res.tapIndex == 1) {
            // 使用相机
            _this.chooseWxImage("camera");
          }
        }
      },
    });
  },
  chooseWxImage(type) {
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: [type],
      success: (res) => {
        //最多上传5张图片
        if (this.data.imageList.length >= 5) {
          wx.showToast({
            title: "最多上传5张图片",
            icon: "none",
          });
          return;
        }
        this.setData({
          imageList: [...this.data.imageList, ...res.tempFilePaths],
        });
      },
    });
  },
  removeChooseImage(e) {
    let imgs = this.data.imageList;

    imgs.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      "form.ossUrl": imgs,
      imageList: imgs,
    });
  },
  // 预览图片
  previewBigImage(e) {
    let imgs = this.data.imageList;
    let { index } = e.currentTarget.dataset;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs,
    });
  },
  push() {
    wx.showToast({
      title: "发布成功",
      icon: "success",
      duration: 1500,
    });
    //等待1.5秒后跳转

    setTimeout(() => {
      wx.navigateTo({
        url: "/pages/answer/answer",
      });
    }, 1800);
  },
  back() {
    wx.navigateBack({
      delta: 1,
    });
  },
  upload_file() {
    wx.chooseMessageFile({
      count: 1,
      type: "file",
      success(res) {
        const tempFilePaths = res.tempFiles[0].path;
        console.log(tempFilePaths);
        wx.showToast({
          title: "上传成功",
          icon: "success",
          duration: 1500,
        });
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
