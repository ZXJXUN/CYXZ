Component({
  properties: {},
  methods: {
    navigate(e) {
      const path = e.target.dataset.path
      const pages = getCurrentPages()
      if (pages[pages.length - 1].route != `pages/${path}/${path}`) {
        wx.navigateTo({
          url: `/pages/${path}/${path}`
        })
      }
    }
  }
})