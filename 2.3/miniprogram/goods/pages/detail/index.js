const app = getApp()
Page({
  data: {
    loading: true,
    loadingHint: "正在加载",
    StatusBar: app.globalData.StatusBar + 6,
    swiperlist: [],
  },
  onReady() {
    // 拉取轮播图数据
    ; (() => {
      wx.request({
        url: "http://localhost:3000/api/home/swipers",
        success:res=>{
          if (res.errMsg === "request:ok") {
            const {
              swipers
            } = res.data.data
            this.setData({
              loading: false,
              swiperlist: swipers,
            })
          }
        },
        fail:console.log
      })
    })()
  },
  onLoad(options) {
    this.animation = wx.createAnimation()
  }
});