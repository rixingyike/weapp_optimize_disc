// router.js
/**
 * 一个朴素的路由对象，打破最大10个页面栈大小的限制
 * 它还可以扩展，例如依用户控制页面的访问权限等
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
export default {
  navigateTo(object) {
      if (getCurrentPages().length > 9) {
          this.redirectTo(object)
      } else {
          wx.navigateTo(object)
      }
  },
  navigateBack(object) {
      wx.navigateBack(object)
  },
  switchTab(object) {
      wx.switchTab(object)
  },
  redirectTo(object) {
      wx.redirectTo(object)
  },
  reLaunch(object) {
      wx.reLaunch(object)
  },
}