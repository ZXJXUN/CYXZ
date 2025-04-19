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
      }
    },
    
    // 导航到指定页面
    navigate(e) {
      const path = e.currentTarget.dataset.path;
      
      // 如果当前已经在该页面，不执行导航
      if (this.data.active === path) return;
      
      // 使用 switchTab 如果页面是 tabBar 页面
      // 否则使用 navigateTo
      wx.navigateTo({
        url: `/pages/${path}/${path}`
      });
    }
  }
})