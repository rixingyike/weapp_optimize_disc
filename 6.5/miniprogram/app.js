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
    
    // 按新方式拉取系统信息
    ; (() => {
      // 先设置默认参数，这些信息在商品详情页中有用到
      Object.assign(this.globalData, {
        Custom: {
          width: 87,
          height: 32,
          left: 320,
          top: 24,
          right: 407
        },
        CustomBar: 60,
        StatusBar: 20,
        tabbar_bottom: "n"
      })
      const { default: SerialCommand } = require("./library/optimus/command/serial_command.js")
      const { default: ClosureCommand } = require("./library/optimus/command/closure_command.js")
      const { default: sysInfoMgr } = require("./library/manager/system_info_manager.js")
      const cmd = new ClosureCommand(async () => {
        if (await sysInfoMgr.retrieveSystemInfo()) {
          console.log("已取到了系统信息");
          const statusBarHeight = sysInfoMgr.getStatusBarHeight()
          const custom = sysInfoMgr.getMenuButtonRect()
          this.globalData.StatusBar = statusBarHeight
          this.globalData.Custom = custom;
          let CustomBar = custom.bottom + custom.top - statusBarHeight;
          this.globalData.CustomBar = CustomBar;
          // 适配全面屏底部距离
          if (CustomBar > 75) {
            this.globalData.tabbar_bottom = "y"
          }
        }
      })
      global.asyncRetrieveSystemInfo = new SerialCommand([new ClosureCommand(), cmd]).execute()
    })()
  },
  onUnhandledRejection(res) {
    console.log(res.reason);
  },
  // 全局信息对象
  globalData: {
    userInfo: null
  },
})