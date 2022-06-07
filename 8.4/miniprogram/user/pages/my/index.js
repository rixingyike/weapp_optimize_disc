Page({
  windowWidth:414,
  data: {
    statusBarHeight: 22,// 后续这两行代码需要放在onLoad中，@6.5
    left: 414 - 17,
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
  popup(e) {
    this.selectComponent("#loginPanel").setData({
      visible: true
    })
  },
  scroll(e) {
    if (e.detail.scrollLeft + this.windowWidth + 3 >= e.detail.scrollWidth) {
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
    if (this._lastScrollLeft > 210 * this.data.menuList.length - this.windowWidth) {
      this.setData({
        scrollLeft: 210 * this.data.menuList.length - this.windowWidth,
      })
    }
  },
  onReady(){
    this.windowWidth = wx.getSystemInfoSync().windowWidth
    this.setData({
      statusBarHeight:wx.getSystemInfoSync().statusBarHeight,
      left:wx.getSystemInfoSync().windowWidth - 17
    })

    this.selectComponent("#tabBar")?.select(2)
  },
})