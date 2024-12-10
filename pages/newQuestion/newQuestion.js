Page({
  previewPicture: function (event) {
    wx.previewImage({
      urls: this.data.tempPictures,
      current: event.currentTarget.dataset.picture
    })
  },
  chooseSubject: function (event) {
    this.setData({
      choosedSubject: event.currentTarget.dataset.subjectIndex
    })
  },
  titleInput: function (event) {
    this.setData({
      title: event.detail.value
    })
  },
  contentInput: function (event) {
    this.setData({
      content: event.detail.value
    })
  },
  submitToDraft: async function () {
    let promises = [];
    const pictures = this.data.tempPictures
    let submitPictures = this.data.submitPictures
    for (let i = 0; i < pictures.length; i++) {
      let element = pictures[i];
      if (element.split(':')[0] == 'https') {
        submitPictures.push(element)
      } else {
        promises.push(new Promise((resolve, reject) => {
          wx.uploadFile({
            filePath: element,
            name: 'file',
            url: "http://47.120.26.83:8000/oss/upload",
            header: {
              'username': wx.getStorageSync('name'),
              'token': wx.getStorageSync('token'),
            },
            success: (res) => {
              submitPictures.push('https://oss-symbol.oss-cn-beijing.aliyuncs.com/' + JSON.parse(res.data).data)
              resolve(res)
            },
            fail: (err) => {
              console.log(err);
              reject(err)
            }
          })
        }))
      }
    }
    await Promise.all(promises).then(() => {
      //还没弄好
      return
      wx.request({
        url: 'http://47.120.26.83:8000/api/answerly/v1/question',
        // url: 'http://127.0.0.1:3000',
        header: {
          'username': 'ab',
          'token': '6927fe4d-a141-47e6-9e11-faf68d2ab601',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        data: {
          "content": this.data.content,
          "title": this.data.title,
          "user_id": 0,
          "category": this.data.choosedSubject,
          "pictures": this.data.submitPictures
        },
        success: (res) => {
          // console.log(res.data)
          Notify({
            type: 'success',
            message: '提交成功',
            selector: '#van-notify',
            context: this
          });
          this.setData({
            isShowSubjectPicker: false,
            tempPictures: [],
            choosedSubject: 0,
            content: '',
            title: '',
            submitPictures: []
          })
          Notify({
            type: 'success',
            message: '提交成功',
            selector: '#van-notify',
            context: this
          });
        },
        fail: (err) => {
          console.log(err);
          Notify({
            type: 'warning',
            message: '提交失败',
            selector: '#van-notify',
            context: this
          });
        }
      })
    })
  },
  addPicture: function () {
    wx.chooseMedia({
      count: 9,
      sizeType: ['compressed', 'original'],
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          tempPictures: [...this.data.tempPictures, ...result.tempFiles.map(file => file.tempFilePath)]
        })
      }
    })
  },
  deletePicture: function (event) {
    const {
      tempPictures
    } = this.data
    let index = event.currentTarget.dataset.index
    tempPictures.splice(index, 1)
    this.setData({
      tempPictures: tempPictures
    })
  },
  addPic: function (event) {
    const {
      file: pics
    } = event.detail
    const {
      tempPictures
    } = this.data
    for (let i = 0; i < pics.length; i++) {

      tempPictures.push({
        url: pics[i].url
      })

    }
    this.setData({
      tempPictures
    })
  },
  // validate: function (title, message) {
  //   await new Promise((resolve,reject)=>{
  //     if (!this.data[title]) {
  //       wx.showToast({
  //         title: message,
  //       })
  //     }
  //   })
  //   return Promise.resolve()
  // },
  submit: async function () {
    // await this.validate('title','标题为空')
    // await this.validate('content','内容为空')
    if (!this.data.title) {
      console.log(this.data.title);
      wx.showToast({
        title: '题目为空',
        icon:'error'
      })
      return
    }
    if (!this.data.content) {
      wx.showToast({
        title: '内容为空',
        icon:'error'
      })
      return
    }
    wx.showToast({
      title: '正在提交，请稍等',
      mask:true,
      icon:'success'
    })
    let promises = [];
    const pictures = this.data.tempPictures
    let submitPictures = this.data.submitPictures
    for (let i = 0; i < pictures.length; i++) {
      let element = pictures[i];
      if (element.split(':')[0] == 'https') {
        submitPictures.push(element)
      } else {
        promises.push(new Promise((resolve, reject) => {
          wx.uploadFile({
            filePath: element,
            name: 'file',
            url: "https://nurl.top:8000/oss/upload",
            header: {
              'username': wx.getStorageSync('name'),
              'token': wx.getStorageSync('token')
            },
            success: (res) => {
              // submitPictures.push('https://oss-symbol.oss-cn-beijing.aliyuncs.com/' + (JSON.parse(res.data)).data)
              submitPictures.push((JSON.parse(res.data)).data)
              this.setData({
                submitPictures: submitPictures
              })
              resolve(res)
            },
            fail: (err) => {
              console.log(err);
              reject(err)
            }
          })
        }))
      }
    }
    await Promise.all(promises).then(() => {
      wx.request({
        // url: 'http://localhost:4000',
        url: 'https://nurl.top:8000/api/answerly/v1/question',
        header: {
          'token': wx.getStorageSync('token'),
          'username': wx.getStorageSync('name')
        },
        method: 'POST',
        data: {
          "content": this.data.content,
          "title": this.data.title,
          "categoryId": this.data.subjectList[this.data.choosedSubject].id,
          // "categoryId": '1862378922353868801',
          "images": this.data.submitPictures.join(',')
        },
        success: (res) => {
          console.log(res.data)
          if (res.data.code!=="0") {
            wx.showToast({
              title: '发布失败',
              icon: 'error'
            })
            
          } else {
            
            wx.showToast({
              title: '发布成功',
            })
            this.setData({
              isShowSubjectPicker: false,
              tempPictures: [],
              choosedSubject: 0,
              content: '',
              title: '',
              submitPictures: []
            })
          }
        },
        fail: (err) => {
          if (res.data.code) {
            wx.showToast({
              title: '发布失败',
              icon: 'error'
            })
          }
          console.log(err);
        }
      })
    })
  },
  data: {
    tempPictures: [],
    subjectList: [],
    choosedSubject: 0,
    content: '',
    title: '',
    submitPictures: []
  },
  onLoad: function (options) {
    if (Object.keys(options).length!==0) {
      let draft = JSON.parse(options.draft)
      this.setData({
        choosedSubject: draft.draft_category,
        title: draft.draft_title,
        content: draft.draft_content,
        tempPictures: draft.draft_pictures
      })
    }
    wx.request({
      url: 'https://nurl.top:8000/api/answerly/v1/category',
      header: {
        'token': wx.getStorageSync('token'),
        'username': wx.getStorageSync('name')
      },
      success: (res) => {
        console.log(res.data);
        this.setData({
          subjectList: res.data.data
        })
      },
      fail: (err) => {
        console.log('err: '+err);
      }
    })
  }
});