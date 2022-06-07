/**
 * 系统信息管理器，获取屏幕宽高、胶囊按钮大小等信息
 * 文档：
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
// miniprogram/library/manager/system_info_manager.js
import promisify from "../optimus/promisify.js"

/** 系统信息管理器 */
class SystemInfoManager {
  /** 获取菜单按钮（右上角胶囊按钮）的布局位置信息。 */
  getMenuButtonRect() {
    return (this.menuButtonRectInfo ||= wx.getMenuButtonBoundingClientRect())
  }

  getPixelRatio() {
    return wx.getSystemInfoSync().pixelRatio
  }

  /** 获取状态栏的高度，单位px */
  getStatusBarHeight() {
    return wx.getSystemInfoSync().statusBarHeight
  }

  getWindowWidth() {
    return wx.getSystemInfoSync().windowWidth
  }

  /** 优先使用异步接口，统一拉取所有系统信息 */
  async retrieveSystemInfo() {
    const res = wx.canIUse("wx.getSystemInfoAsync") ? await promisify(wx.getSystemInfoAsync)() : await promisify(wx.getSystemInfo)()
    if (res) {
      // 这里不能直接改变wx.getSystemInfoSync
      // TypeError: Cannot assign to read only property
      // wx.getSystemInfoSync = ()=> res 
      Object.defineProperty(wx, "getSystemInfoSync", {
        value: ()=> res,
        writable: true,
        configurable: true
      })      
      return true 
    }
    return false
  }
}

export default new SystemInfoManager()