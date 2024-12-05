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
    question_title: "这是默认的测试问题标题",
    question_id: 1,
    imageList: [],
    images: [],
    content: "",
    fileList: [],
    push_loading: false,
    save_content: 1,
    save_image: 1,
    nowtime: "",

    username: "ab",
    token: "29b04146-b2de-4733-b0f5-fba06f7b45fe",

    is_post: false,
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
    console.log(child.data.inputValue); // 获取内容
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
    wx.setStorageSync("is_post", false);
    console.log(wx.getStorageSync("NewAnswer_question_id"));
    this.setData({
      question_id: wx.getStorageSync("NewAnswer_question_id"),
      question_title: wx.getStorageSync("NewAnswer_question_title"),
    });
    console.log("name: ");
    console.log(wx.getStorageSync("name"));
    console.log("token: ");
    console.log(wx.getStorageSync("token"));
    var tempname = wx.getStorageSync("name");
    if (
      tempname == "" ||
      tempname == null ||
      tempname == undefined ||
      temptoken.length == 0 ||
      temptoken == null ||
      temptoken == undefined
    ) {
      wx.showToast({
        title: "获取登录信息错误,使用默认账户ab进行测试",
        icon: "none",
        duration: 3000,
      });
    } else {
      this.setData({
        username: wx.getStorageSync("name"),
        token: wx.getStorageSync("token"),
      });
    }
    console.log(this.data.content.length);
    console.log(this.data.imageList.length);
    if (this.data.is_post) {
      wx.enableAlertBeforeUnload({
        message: "您的内容尚未保存草稿箱，确定要离开吗？",
        success: function (res) {
          console.log("未保存离开：", res);
        },
        fail: function (errMsg) {
          console.log("返回保存：", errMsg);
        },
      });
    }
  },
  clearContent() {
    wx.showModal({
      title: "是否清空内容",
      success: (res) => {
        if (res.confirm) {
          console.log("用户点击确定");
          console.log("清除内容");
          const child = this.selectComponent("#ans_content");
          child.onClear();
          const images_upload = this.selectComponent("#images_upload");
          images_upload.clearAll();
          this.setData({
            fileList: [],
          });
        } else if (res.cancel) {
          console.log("用户点击取消,不清除内容");
        }
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
    const now_username = this.data.username;
    const now_token = this.data.token;
    var that = this;
    this.setData({
      is_post: true,
    });

    // 定义一个函数来执行上传任务
    function uploadFile(task, username, token, that) {
      return new Promise((resolve, reject) => {
        console.log(task);
        wx.uploadFile({
          url: "https://nurl.top:8000/oss/upload",
          header: {
            username: username,
            token: token,
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
    function request(url, method, data, username, token, that) {
      //var that = this;
      return new Promise((resolve, reject) => {
        wx.request({
          url: url,
          method: method,
          data: data,
          header: {
            username: username,
            token: token,
            "Content-Type": "application/json",
          },
          success(res) {
            resolve(res);
            wx.hideLoading();
            wx.removeStorageSync("NewAnswer_question_id");
            wx.removeStorageSync("NewAnswer_question_title");
            wx.showToast({
              title: "发布成功",
              icon: "success",
              time: 1500,
            });

            wx.setStorageSync("is_post", "true");
            setTimeout(() => {
              wx.navigateBack();
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
    Promise.all(
      imageList.map((task) => uploadFile(task, now_username, now_token, that))
    )
      .then((results) => {
        console.log("所有上传任务完成");
        var test = results.map((res) => JSON.parse(res.data).data);
        console.log(test);
        // 所有上传任务完成后，发起一次请求
        const connectedString = test.join(",");
        console.log(connectedString);
        return request(
          "https://nurl.top:8000/api/answerly/v1/answer",
          "POST",
          {
            content: this.data.content,
            question_id: this.data.question_id,
            images: connectedString,
          },
          now_username,
          now_token
        );
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  saveContent() {
    //调用存草稿接口

    wx.showToast({
      title: "功能还在开发中",
      icon: "error",
      duration: 2000,
    });
  },
});
