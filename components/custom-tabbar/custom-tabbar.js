Component({
  properties: {
    currentPage: {
      type: String,
      value: ""
    }
  },
  methods: {
    navigateToIndex() {
      wx.navigateTo({
        url: '/pages/index/index'
      });
    },
    navigateToHome() {
      wx.navigateTo({
        url: '/pages/home/home'
      });
    }
  }
});
