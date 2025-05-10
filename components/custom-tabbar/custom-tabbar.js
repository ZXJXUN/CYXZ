Component({
  data: {
    active: 'index' // 默认选中首页
  },

  lifetimes: {
    attached() {
      this.setActive();
    }
  },

  pageLifetimes: {
    show() {
      this.setActive();
    }
  },

  methods: {
    // 设置当前激活的选项
    setActive() {
      const pages = getCurrentPages();
      if (pages.length === 0) return;
      const currentPage = pages[pages.length - 1];
      const route = currentPage.route;
      if (route.includes('index/index')) {
        this.setData({ active: 'index' });
      } else if (route.includes('home/home')) {
        this.setData({ active: 'home' });
      }else{
        // 都不是就设为0
        this.setData({'active':''})
      }
    },

    // 导航到指定页面
    navigate(e) {
      const path = e.currentTarget.dataset.path;
      // 如果当前已经在该页面，不执行导航
      if (this.data.active === path) return;
      // 历史页面存在就返回到历史页面，不重新开了
      const destRoute = `pages/${path}/${path}`
      const oldRoutes = getCurrentPages().reverse()
      for (let i = 1; i < oldRoutes.length; i++) {
        const r = oldRoutes[i];
        if (r.route == destRoute) {
          wx.navigateBack({delta:i})
          return
        }
      }
      // 使用 switchTab 如果页面是 tabBar 页面
      // 否则使用 navigateTo
      wx.navigateTo({
        url: '/' + destRoute
      });
    }
  }
})