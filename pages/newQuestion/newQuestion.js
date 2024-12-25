Page({

  // 预览图片
  previewPicture: function (event) {
    wx.previewImage({
      urls: this.data.tempPictures,
      current: event.currentTarget.dataset.picture,
    });
  },

  // 选择科目
  chooseSubject: function (event) {
    this.setData({
      choosedSubject: event.currentTarget.dataset.subjectIndex,
    });
  },

  // 标题输入
  titleInput: function (event) {
    this.setData({
      title: event.detail.value,
    });
  },

  // 内容输入
  contentInput: function (event) {
    this.setData({
      content: event.detail.value,
    });
  },

  // 增加图片
  addPicture: function () {
    wx.chooseMedia({
      count: 9,
      sizeType: ["compressed", "original"],
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (result) => {
        this.setData({
          tempPictures: [
            ...this.data.tempPictures,
            ...result.tempFiles.map((file) => file.tempFilePath),
          ],
        });
        if (this.data.tempPictures.length>9) {
          wx.showToast({
            title: '图片过多',
            icon: "error",
          })
          this.setData({tempPictures:this.data.tempPictures.slice(0,9)})
        }
      },
    });
  },

  // 删除图片
  deletePicture: function (event) {
    const {
      tempPictures
    } = this.data;
    let index = event.currentTarget.dataset.index;
    tempPictures.splice(index, 1);
    this.setData({
      tempPictures: tempPictures,
    });
  },

  // 上传一个图片
  uploadImg: async function (filePath) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: 'https://nurl.top:8000/oss/upload',
        filePath: filePath,
        name: 'file',
        header: {
          username: wx.getStorageSync("name"),
          token: wx.getStorageSync("token"),
        },
        success: (res) => {
          let submitPictures = this.data.submitPictures;
          submitPictures.push(JSON.parse(res.data).data);
          this.setData({
            submitPictures: submitPictures,
          });
          resolve(res)
        },
        fail: (err) => {
          wx.showToast({
            title: '上传出现错误',
            icon: "error",
          })
          console.log(err);
          reject(err);
        },
      });
    });
  },

  // 提交问题
  submit: async function () {
    if (!this.data.title) {
      wx.showToast({
        title: "题目为空",
        icon: "error",
      });
      return;
    }
    if (!this.data.content) {
      wx.showToast({
        title: "内容为空",
        icon: "error",
      });
      return;
    }
    wx.showLoading({
      title: "正在提交，稍等",
      mask: true
    });
    const pictures = this.data.tempPictures;
    for (const picture of pictures) {
      await this.uploadImg(picture)
    }
    wx.request({
      url: "https://nurl.top:8000/api/answerly/v1/question",
      header: {
        token: wx.getStorageSync("token"),
        username: wx.getStorageSync("name"),
      },
      method: "POST",
      data: {
        content: this.data.content,
        title: this.data.title,
        categoryId: this.data.subjectList[this.data.choosedSubject].id,
        images: this.data.submitPictures.join(","),
      },
      success: (res) => {
        if (res.data.code !== "0") {
          wx.showToast({
            title: "发布失败",
            icon: "error",
          });
        } else {
          wx.showToast({
            title: "发布成功",
          });
          this.setData({
            isShowSubjectPicker: false,
            tempPictures: [],
            choosedSubject: 0,
            content: "",
            title: "",
            submitPictures: [],
          });
        }
      },
      fail: (err) => {
        if (res.data.code) {
          wx.showToast({
            title: "发布失败",
            icon: "error",
          });
        }
        console.log(err);
      },
    });
  },
  // 页面 data
  data: {
    tempPictures: [],
    subjectList: [{id:4654}],
    choosedSubject: 0,
    content: "",
    title: "",
    submitPictures: [],
  },
  onLoad: function (options) {

    // 后续的草稿功能
    // if (Object.keys(options).length !== 0) {
    //   let draft = JSON.parse(options.draft);
    //   this.setData({
    //     choosedSubject: draft.draft_category,
    //     title: draft.draft_title,
    //     content: draft.draft_content,
    //     tempPictures: draft.draft_pictures,
    //   });
    // }

    // 获取科目
    wx.request({
      url: "https://nurl.top:8000/api/answerly/v1/category",
      header: {
        token: wx.getStorageSync("token"),
        username: wx.getStorageSync("name"),
      },
      success: (res) => {
        this.setData({
          subjectList: res.data.data,
        });
      },
      fail: (err) => {
        console.log("err: " + err);
        wx.showToast({
          title: "科目获取失败",
          icon: "error",
        });
      },
    });
  },
});