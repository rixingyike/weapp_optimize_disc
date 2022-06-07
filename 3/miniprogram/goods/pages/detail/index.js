const app = getApp()
Page({
  data: {
    loading: true,
    loadingHint: "正在加载",
    StatusBar: app.globalData.StatusBar + 6,
    swiperlist: [],
  },
  animation1() {
    this.animation.scale(0).step()
    this.animation.scale(1).step()
    this.animation.opacity(0).step()
    this.animation.opacity(1).step()
    this.setData({
      animation: this.animation.export()
    })
  },
  animation2() {
    const id = "#goodsSwiper"
    this.animate(id, [{
      opacity: 0,
      scaleX: 0,
      scaleY: 0,
    },
    {
      opacity: 0.5,
      scaleX: 0.5,
      scaleY: 0.5,
      offset: 0.5,
    },
    {
      opacity: 1.0,
      scaleX: 1,
      scaleY: 1,
    },
    ], 1000, ()=> {
      this.clearAnimation(id, {
        opacity: true,
        scaleX: true,
        scaleY: true,
      }, function () {
        console.log("清除了动画属性")
      })
    })
  },
  onAnimationFinish(e) {
    // this.animation1()
    this.animation2()
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
            // 设置动态缓存数据
            this.setInitialRenderingCache({
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