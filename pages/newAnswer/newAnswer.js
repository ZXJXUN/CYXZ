// pages/newAnswer/newAnswer.js
const links = [
  {
    text: "首页",
    url: "/pages/index/index",
    openType: "switchTab",
  },
  {
    text: "个人",
    url: "/pages/home/home",
    openType: "switchTab",
  },
];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    links,
    linksNoLinkData: links.map((v) => ({ text: v.text })),
    question_title: "如何学？",
    question_id: 1,
    imageList: [],
    images: [],
    content: "",
    fileList: [],
    push_loading: false,
    save_content: 1,
    save_image: 1,
    nowtime: "",
    headers: {
      username: "ab",
      token: "6927fe4d-a141-47e6-9e11-faf68d2ab601",
    },
  },
  onChange(e) {
    console.log("onChange", e);
    const { file, fileList } = e.detail;
    if (file.status === "uploading") {
      this.setData({
        progress: 0,
      });
      wx.showLoading();
    } else if (file.status === "done") {
      this.setData({
        imageUrl: file.url,
      });
    }

    // Controlled state should set fileList
    this.setData({ fileList });
  },
  onSuccess(e) {
    console.log("onSuccess", e);
  },
  onFail(e) {
    console.log("onFail", e);
  },
  onComplete(e) {
    console.log("onComplete", e);
    wx.hideLoading();
  },
  onProgress(e) {
    console.log("onProgress", e);
    this.setData({
      progress: e.detail.file.progress,
    });
  },
  onPreview(e) {
    console.log("onPreview", e);
    const { file, fileList } = e.detail;
    wx.previewImage({
      current: file.url,
      urls: fileList.map((n) => n.url),
    });
  },
  onRemove(e) {
    const { file, fileList } = e.detail;
    wx.showModal({
      content: "确定删除？",
      success: (res) => {
        if (res.confirm) {
          this.setData({
            fileList: fileList.filter((n) => n.uid !== file.uid),
          });
        }
      },
    });
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
  submit() {
    wx.showLoading({
      title: "发布中",
    });
    const child = this.selectComponent("#ans_content");
    console.log(child);
    this.setData({
      content: child.data.inputValue,
      imageList: this.data.fileList.map((n) => n.url),
    });
    this.uploadAndRequest();
  },
  back() {
    wx.navigateBack({
      delta: 1,
    });
  },
  onConfirm(e) {
    console.log("onConfirm", e);
  },
  onlinkClick(e) {
    console.log("onlinkClick", e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.setData({
    //   question_id: wx.getStorageSync("question_id"),
    //   question_title: wx.getStorageSync("question_title"),
    // });
    console.log(this.data.content.length);
    console.log(this.data.imageList.length);
    console.log(this.data.save_content);
    console.log(this.data.save_image);
    if (
      this.data.save_content != this.data.content.length ||
      this.data.save_image != this.data.imageList.length
    ) {
      wx.enableAlertBeforeUnload({
        message: "您是否需要保存当前内容",
        success: function (res) {
          console.log("保存成功：", res);
        },
        fail: function (errMsg) {
          console.log("未保存：", errMsg);
        },
      });
    }
  },
  clearContent() {
    var nowtime = this.getNowTime();
    this.setData({
      nowtime: nowtime,
    });
    wx.showModal({
      title: "提示",
      content: "是否保存草稿",
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync("save_content", this.data.content);
          wx.setStorageSync("save_image", this.data.imageList);
          wx.setStorageSync("save_time", nowtime);
          wx.showToast({
            title: "已保存",
          });
        } else if (res.cancel)
          wx.showToast("已取消保存，草稿将不会保留", wx.navigateBack);
      },
    });
  },

  getNowTime() {
    var dataTime;
    var yy = new Date().getFullYear();
    var mm = new Date().getMonth() + 1;
    var dd = new Date().getDate();
    var hh = new Date().getHours();
    var mf =
      new Date().getMinutes() < 10
        ? "0" + new Date().getMinutes()
        : new Date().getMinutes();
    var ss =
      new Date().getSeconds() < 10
        ? "0" + new Date().getSeconds()
        : new Date().getSeconds();
    dataTime = `${yy}-${mm}-${dd} ${hh}:${mf}:${ss}`;
    return dataTime;
  },

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

  uploadAndRequest: function () {
    const imageList = this.data.imageList;

    // 定义一个函数来执行上传任务
    function uploadFile(task) {
      return new Promise((resolve, reject) => {
        console.log(task);
        wx.uploadFile({
          url: "https://nurl.top:8000/oss/upload",
          header: {
            username: "ab",
            token: "6927fe4d-a141-47e6-9e11-faf68d2ab601",
          },
          filePath: task,
          name: "file",
          success(res) {
            console.log("上传成功", res);
            console.log(res.data);
            //获取res.data中的data属性
            const data = JSON.parse(res.data);
            console.log(data);
            const resData = data.data;
            console.log(resData);

            resolve(res);
          },
          fail(err) {
            reject(err);
          },
        });
      });
    }

    // 定义一个函数来发起请求
    function request(url, method, data) {
      return new Promise((resolve, reject) => {
        wx.request({
          url: url,
          method: method,
          data: data,
          header: {
            username: "ab",
            token: "29b04146-b2de-4733-b0f5-fba06f7b45fe",
            "Content-Type": "application/json",
          },
          success(res) {
            resolve(res);
            wx.hideLoading();
            wx.showToast({
              title: "发布成功",
              icon: "success",
              time: 1500,
            });
            setTimeout(() => {
              wx.navigateTo({
                url: "/pages/question/question",
              });
            }, 1800);
          },
          fail(err) {
            reject(err);
            wx.hideLoading();
            wx.showToast({
              title: "发布失败,请检查网络",
              icon: "error",
              time: 1500,
            });
          },
        });
      });
    }
    // 使用 Promise.all 来并行执行所有上传任务
    Promise.all(imageList.map((task) => uploadFile(task)))
      .then((results) => {
        console.log("所有上传任务完成");
        var test = results.map((res) => JSON.parse(res.data).data);
        console.log(test);
        // 所有上传任务完成后，发起一次请求
        const connectedString = test.join(",");
        console.log(connectedString);
        return request("https://nurl.top:8000/api/answerly/v1/answer", "POST", {
          content: this.data.content,
          question_id: this.data.question_id,
          images: connectedString,
        });
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
});
