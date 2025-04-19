const app = getApp();
Page({

  data: {
    tempPictures: [],
    subjectList: [],
    choosedSubject: 0,
    content: "",
    title: "",
    submitPictures: [],
    uploadUrl: app.globalData.backend + '/oss/upload',
    baseUrl: app.globalData.backend + "/api/answerly/v1", // API 基地址
  },

  onLoad: async function (options) {
    wx.showLoading({ title: '加载中...', mask: true });
    try {
      // 获取科目列表
      await this.getSubjectList();
      
      // 处理传入的科目ID
      if (options.categoryId) {
        const categoryId = Number(options.categoryId);
        // 在科目列表加载完成后设置选择的科目
        this.setSelectedCategory(categoryId);
      }
      
      // 草稿功能（暂不启用，保留代码）
      // this.loadDraft(options);
    } catch (error) {
      console.error("初始化失败:", error);
      wx.showToast({ title: '初始化失败', icon: 'error' });
    } finally {
      wx.hideLoading();
    }
  },

  // 获取科目列表
  getSubjectList: async function () {
    try {
      // 将 wx.request 封装成 Promise
      const res = await new Promise((resolve, reject) => {
        wx.request({
          url: `${this.data.baseUrl}/category`,
          header: app.getRequestHeader(),
          success: (res) => {
            resolve(res); // 请求成功，resolve Promise
          },
          fail: (err) => {
            reject(err); // 请求失败，reject Promise
          },
        });
      });
  
      if (res.statusCode !== 200 || !res.data.data) {
        throw new Error(res.data.message || '获取科目列表失败');
      }
  
      this.setData({ subjectList: res.data.data });
    } catch (error) {
      console.error("获取科目列表失败:", error);
      wx.showToast({ title: '获取科目列表失败', icon: 'error' });
      throw error; // 继续抛出，防止初始化流程中断
    }
  },
  

  // （草稿功能，暂不启用）
  loadDraft: function (options) {
    if (Object.keys(options).length !== 0) {
      const draft = JSON.parse(options.draft);
      this.setData({
        choosedSubject: draft.draft_category,
        title: draft.draft_title,
        content: draft.draft_content,
        tempPictures: draft.draft_pictures,
      });
    }
  },


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
    this.setData({ title: event.detail.value });
  },

  // 内容输入
  contentInput: function (event) {
    this.setData({ content: event.detail.value });
  },

  // 增加图片
  addPicture: async function () {
    try {
      const result = await wx.chooseMedia({
        count: 9,
        sizeType: ["compressed", "original"],
        mediaType: ["image"],
        sourceType: ["album", "camera"],
      });

      const newPictures = result.tempFiles.map((file) => file.tempFilePath);
      const allPictures = [...this.data.tempPictures, ...newPictures];

      if (allPictures.length > 9) {
        wx.showToast({ title: '图片过多', icon: 'error' });
        this.setData({ tempPictures: allPictures.slice(0, 9) });
      } else {
        this.setData({ tempPictures: allPictures });
      }

    } catch (error) {
      console.error("选择图片失败:", error);
      wx.showToast({ title: '选择图片失败', icon: 'error' });
    }
  },

  // 删除图片
  deletePicture: function (event) {
    const index = event.currentTarget.dataset.index;
    const tempPictures = [...this.data.tempPictures]; // Create a copy to avoid direct mutation
    tempPictures.splice(index, 1);
    this.setData({ tempPictures: tempPictures });
  },

  // 上传图片
  uploadImg: async function (filePath) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: this.data.uploadUrl,
        filePath: filePath,
        name: 'file',
        header: app.getRequestHeader(),
        success: (res) => {
          const responseData = JSON.parse(res.data);
          if (res.statusCode !== 200 || !responseData.data) {
            wx.showToast({ title: '上传图片失败', icon: 'error' });
            return reject(new Error("上传图片失败:" + res.data));
          }
          const submitPictures = [...this.data.submitPictures, responseData.data];
          this.setData({ submitPictures: submitPictures });
          resolve(responseData.data); // 返回上传后的图片链接
        },
        fail: (err) => {
          console.error("上传图片失败:", err);
          wx.showToast({ title: '上传图片失败', icon: 'error' });
          reject(err);
        },
      });
    });
  },

  // 提交问题
  submit: async function () {
    if (!this.data.title) {
      wx.showToast({ title: "题目为空", icon: "error" });
      return;
    }
    if (!this.data.content) {
      wx.showToast({ title: "内容为空", icon: "error" });
      return;
    }

    wx.showLoading({ title: "正在提交，请稍候", mask: true });

    try {
      // 1. 上传所有图片
      const uploadPromises = this.data.tempPictures.map(picture => this.uploadImg(picture));
      await Promise.all(uploadPromises);

      // 2. 提交问题
      await this.submitQuestion();

      // 3. 处理成功发布后的导航
      wx.showToast({ title: "发布成功" });
      
      // 设置全局刷新标记
      wx.setStorageSync("is_post", "true");
      
      // 获取当前选中科目的ID
      const currentCategoryId = this.data.subjectList[this.data.choosedSubject].id;
      console.log("提交成功，选中科目ID:", currentCategoryId);
      
      // 获取页面栈
      const pages = getCurrentPages();
      console.log("当前页面栈:", pages.map(p => p.route || p.__route__));
      
      // 查找是否有列表页在页面栈中（检查多种可能的路由格式）
      let listPageIndex = -1;
      for (let i = pages.length - 1; i >= 0; i--) {
        const pageRoute = pages[i].route || pages[i].__route__ || '';
        console.log(`检查页面[${i}]:`, pageRoute);
        // 兼容不同的路由格式
        if (pageRoute === 'pages/list/list' || pageRoute.endsWith('/list/list')) {
          listPageIndex = i;
          break;
        }
      }
      
      if (listPageIndex !== -1) {
        // 如果列表页存在于页面栈中
        const listPage = pages[listPageIndex];
        console.log("找到列表页，位置:", listPageIndex);
        
        try {
          // 设置列表页需要刷新
          if (typeof listPage.setNeedRefresh === 'function') {
            listPage.setNeedRefresh();
            console.log("已设置列表页需要刷新");
          } else {
            console.warn("列表页没有setNeedRefresh方法");
            // 尝试直接设置needRefresh变量
            listPage.needRefresh = true;
          }
          
          // 如果科目不同，需要更新列表页的科目ID
          if (listPage.data.category != currentCategoryId) {
            listPage.setData({ category: currentCategoryId });
            console.log("已更新列表页科目ID为:", currentCategoryId);
          }
        } catch (e) {
          console.error("设置列表页属性失败:", e);
        }
        
        // 返回到列表页，并确保返回后会刷新
        const delta = pages.length - 1 - listPageIndex;
        console.log(`返回${delta}页到列表页`);
        wx.navigateBack({
          delta: delta
        });
      } else {
        // 如果列表页不在页面栈中，直接使用reLaunch而不是redirectTo
        console.log("列表页不在页面栈中，重新加载到列表页");
        wx.reLaunch({
          url: `/pages/list/list?id=${currentCategoryId}&refresh=true&t=${Date.now()}`,
        });
      }

    } catch (error) {
      console.error("提交失败:", error);
      wx.showToast({ title: "发布失败", icon: "error" });
    } finally {
      wx.hideLoading();
    }
  },

  // 提交问题到服务器
  submitQuestion: async function () {
    const apiUrl = `${this.data.baseUrl}/question`;
    try {
      // 将 wx.request 封装成 Promise
      const res = await new Promise((resolve, reject) => {
        wx.request({
          url: apiUrl,
          method: "POST",
          header: app.getRequestHeader(),
          data: {
            content: this.data.content,
            title: this.data.title,
            categoryId: this.data.subjectList[this.data.choosedSubject].id,
            images: this.data.submitPictures.join(","),
          },
          success: (res) => {
            resolve(res); // 请求成功，resolve Promise
          },
          fail: (err) => {
            reject(err); // 请求失败，reject Promise
          },
        });
      });

      if (res.statusCode !== 200 || res.data.code !== "0") {
        throw new Error(res.data.message || "发布失败");
      }
    } catch (error) {
      console.error("发布失败:", error);
      wx.showToast({ title: "发布失败", icon: "error" });
      throw error; // 继续抛出错误，让外层处理
    }
  
  },

  // 根据categoryId设置选中的科目
  setSelectedCategory: function(categoryId) {
    if (!categoryId || !this.data.subjectList || this.data.subjectList.length === 0) {
      return;
    }
    
    // 查找传入的categoryId在科目列表中对应的索引
    const subjectIndex = this.data.subjectList.findIndex(subject => subject.id === categoryId);
    
    // 如果找到了，设置为当前选中的科目
    if (subjectIndex !== -1) {
      this.setData({
        choosedSubject: subjectIndex
      });
      console.log('自动选择科目:', this.data.subjectList[subjectIndex].name);
    }
  },
});
