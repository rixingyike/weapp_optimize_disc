Page({
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,// 后续这两行代码需要放在onLoad中，@6.5
    left: wx.getSystemInfoSync().windowWidth - 17,
    menuList: [{
      title: "火锅（xxxx）",
      distance: Math.floor(1000 * Math.random()),
    }, {
      title: "烤鸭（xxxx）",
      distance: Math.floor(1000 * Math.random()),
    }, {
      title: "火锅（xxxx）",
      distance: Math.floor(1000 * Math.random()),
    }, {
      title: "烤鸭（xxxx）",
      distance: Math.floor(1000 * Math.random()),
    }, ],
  },
  // 设置以滚动驱动的响应式动画
  setUpAnimate() {
    // 这是搜索框架区域的响应式动画设置
    wx.createSelectorQuery().select("#scroller").fields({
      scrollOffset: true,
      size: true,
    }, res => {
      this.animate(".avatar", [{
        borderRadius: "0",
        borderColor: "red",
        transform: "scale(1) translateY(-20px)",
        offset: 0,
      }, {
        borderRadius: "25%",
        borderColor: "blue",
        transform: "scale(.65) translateY(-20px)",
        offset: .5,
      }, {
        borderRadius: "50%",
        borderColor: "blue",
        transform: `scale(.3) translateY(-20px)`,
        offset: 1
      }], 2000, {
        scrollSource: "#scroller",
        timeRange: 2000, // 时间跨度范围
        startScrollOffset: 0,
        endScrollOffset: 85,
        orientation: "vertical", // vertical | horizontal
      })

      this.animate(".nickname", [{
        transform: "translateY(0)",
      }, {
        transform: `translateY(${-44 - this.data.statusBarHeight}px)`,
      }], 1000, {
        scrollSource: "#scroller",
        timeRange: 1000,
        startScrollOffset: 120,
        endScrollOffset: 200,
      })

      this.animate(".search_input", [{
        opacity: "0",
        width: "0%",
      }, {
        opacity: "1",
        width: "100%",
      }], 1000, {
        scrollSource: "#scroller",
        timeRange: 1000,
        startScrollOffset: 120,
        endScrollOffset: 252
      })

      this.animate(".search_icon", [{
        right: "0",
        transform: "scale(1)",
      }, {
        right: (wx.getSystemInfoSync().windowWidth * .5 - 20) + "px",
        transform: "scale(.6)",
      }], 1000, {
        scrollSource: "#scroller",
        timeRange: 1000,
        startScrollOffset: 140,
        endScrollOffset: 252,
      })
    }).exec()

    // 这是横向的绑定
    wx.createSelectorQuery().select("#scroller2").fields({
      scrollOffset: true,
      size: true,
    }, (res) => {
      // 绑定滚动元素
      const scrollTimeline = {
        scrollSource: "#scroller2",
        orientation: "horizontal",
        timeRange: 2000,
        startScrollOffset: (210 * this.data.menuList.length - res.width) + 20,
        endScrollOffset: res.scrollWidth - res.width,
      }
      this.animate("#transform", [{
        offset: 0,
        width: "0px",
      }, {
        offset: 1,
        width: "30px",
      }], 1000, scrollTimeline)
    }).exec()
  },
  // 显示登录面板
  showLoginPanel() {
    this.selectComponent("#loginPanel").setData({
      visible: true
    })
  },
  scroll(e) {
    if (e.detail.scrollLeft + wx.getSystemInfoSync().windowWidth + 3 >= e.detail.scrollWidth) {
      if (e.detail.deltaX < 0 && !this._active) {
        this._active = true
        this.setData({
          wording: "释放跳转"
        })
        wx.vibrateShort()
      } else if (e.detail.deltaX > 0) {
        this._active = false
        this.setData({
          wording: "查看更多"
        })
      }
    } else {
      this._active = false
    }
  },
  onShow() {
    if (this._lastScrollLeft > 210 * this.data.menuList.length - wx.getSystemInfoSync().windowWidth) {
      this.setData({
        scrollLeft: 210 * this.data.menuList.length - wx.getSystemInfoSync().windowWidth,
      })
    }
  },
  onReady(){
    this.setUpAnimate()
  }
})