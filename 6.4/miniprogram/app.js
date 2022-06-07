// miniprogram/app.js
App({
  // 最好不使用这样的全局替代方法，测试后要注释掉
  // 充许从项目根目录，以绝对路径引入，这里有同步异步两个方法
  // require: (path, cb)=> {
  //   path = path.startsWith("/") ? path.substring(1) : path
  //   require(path, cb)
  // },
  // requireAsync: async path=> {
  //   path = path.startsWith("/") ? path.substring(1) : path
  //   return require.async(path)
  // },
  // 充许从项目根目录，以绝对路径引入，这里有同步异步两个方法
  onLaunch() {
    // 现在就开始加载主页数据
    const { default: retrieveHomeData } = require("./library/services/retrieve_home_data.js")
    retrieveHomeData()
    
    // 拉取系统信息
    wx.getSystemInfo({
      success: e => {
        console.log("已取到了系统信息")
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        let CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        this.globalData.CustomBar = CustomBar;
        // 适配全面屏底部距离
        if (CustomBar > 75) {
          this.globalData.tabbar_bottom = "y"
        }
      }
    })
  },
  onUnhandledRejection(res) {
    console.log(res.reason);
  },
  // 全局信息对象
  globalData: {
    userInfo: null
  },
})