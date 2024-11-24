import Notify from '@vant/weapp/notify/notify'
Page({
  submitToDraft: async function () {
    let promises = [];
    const pictures = this.data.tempPictures
    let submitPictures = this.data.submitPictures
    for (let i = 0; i < pictures.length; i++) {
      let element = pictures[i];
      if (element.split(':')[0] == 'https') {
        // console.log('element: '+element);
        submitPictures.push(element)
      } else {
        promises.push(new Promise((resolve, reject) => {
          wx.uploadFile({
            filePath: element,
            name: 'file',
            url: "http://47.120.26.83:8000/oss/upload",
            header: {
              'username': 'ab',
              'token': '6927fe4d-a141-47e6-9e11-faf68d2ab601'
            },
            success: (res) => {
              submitPictures.push('https://oss-symbol.oss-cn-beijing.aliyuncs.com/' + JSON.parse(res.data).data)
              // console.log('submitPictures: '+submitPictures.length)
              // console.log('res.data: '+res.data)
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
    // console.log(this.data.tempPictures);
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
  showSubjectPicker: function () {
    this.setData({
      isShowSubjectPicker: !this.data.isShowSubjectPicker
    })
  },
  subjectChoose: function (event) {
    this.showSubjectPicker()
    this.setData({
      choosedSubject: event.detail.index
    })
    // console.log(this.data.choosedSubject);
  },
  submit: async function () {
    let promises = [];
    const pictures = this.data.tempPictures
    let submitPictures = this.data.submitPictures
    for (let i = 0; i < pictures.length; i++) {
      let element = pictures[i];
      if (element.split(':')[0] == 'https') {
        // console.log('element: '+element);
        submitPictures.push(element)
      } else {
        promises.push(new Promise((resolve, reject) => {
          wx.uploadFile({
            filePath: element,
            name: 'file',
            url: "http://47.120.26.83:8000/oss/upload",
            header: {
              'username': 'ab',
              'token': '6927fe4d-a141-47e6-9e11-faf68d2ab601'
            },
            success: (res) => {
              submitPictures.push('https://oss-symbol.oss-cn-beijing.aliyuncs.com/' + JSON.parse(res.data).data)
              // console.log('submitPictures: '+submitPictures.length)
              // console.log('res.data: '+res.data)
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
  data: {
    isShowSubjectPicker: false,
    tempPictures: [],
    subjectList: ['高等代数', '基础物理', '离散数学', '数据结构', '程序设计'],
    choosedSubject: 0,
    content: '',
    title: '',
    submitPictures: []
  },
  onLoad: function (options) {
    let draft = JSON.parse(options.draft)
    this.setData({
      choosedSubject: draft.draft_category,
      title: draft.draft_title,
      content: draft.draft_content,
      tempPictures: draft.draft_pictures
    })
  }
});