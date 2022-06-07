const app = getApp({ allowDefault: true }) // 独立分包中getApp为空，这里设置默认值
app.globalData = {
  StatusBar: 40,
}

Page({
  data: {
    loading: true,
    loadingHint: "正在加载",
    StatusBar: app.globalData.StatusBar + 6,
    swiperlist: [],
  },
  onReady() {
    const {default:request} = require("../../../library/optimus/request.js")
    // 拉取轮播图数据
    ; (async () => {
      const res = await request({
        url: "http://localhost:3000/api/home/swipers",
      }).catch(console.log)
      if (res.errMsg === "request:ok") {
        const {
          swipers
        } = res.data.data
        this.setData({
          loading: false,
          swiperlist: swipers,
        })
      }
    })()

    this.selectComponent("#tabBar")?.select(0)
  },
  onLoad(options) {
    this.animation = wx.createAnimation()
  }
});