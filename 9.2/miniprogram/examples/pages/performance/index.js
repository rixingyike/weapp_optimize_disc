const {default:systemInfoManager} = require("../../../library/manager/system_info_manager.js")

Page({
  entries: [],
  data: {},
  observer: null,
  onLoad() {
    // 通过 SelectorQuery 获取 Canvas 节点
    wx.createSelectorQuery()
      .select("#canvas")
      .fields({
        node: true,
        size: true,
      })
      .exec(this.init.bind(this))
    
      // 查询性能数据
    const performance = wx.getPerformance()
    this.observer = performance.createObserver((entryList) => {
      this.entries.push(...entryList.getEntries())
      console.log("加载到的性能数据", entryList.getEntries())
    })
    this.observer.observe({
      entryTypes: ["render", "script", "navigation"]
    })
  },
  onUnload() {
    this.observer?.disconnect()
    this.canvas.cancelAnimationFrame(this.renderLoop)
    this.canvas = null 
  },

  onTap: function (e) {
    this.entries.push(`btn clicked.${new Date().getTime()}`)
  },

  // 初始化，开启渲染
  init(res) {
    const width = res[0].width
    const height = res[0].height

    const canvas = res[0].node
    const ctx = canvas.getContext("2d")
    
    const dpr = systemInfoManager.getPixelRatio() 
    // const dpr = wx.getSystemInfoSync().pixelRatio

    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    this.canvas = canvas

    this.renderLoop = () => {
      this.render(canvas, ctx)
      canvas.requestAnimationFrame(this.renderLoop)
    }
    canvas.requestAnimationFrame(this.renderLoop)
  },
  // 渲染方法
  render(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let x = 10,
      y = 10
    const len = Math.max(10, this.entries.length)
    for (let j = 0; j < len; j++) {
      const item = this.entries[this.entries.length - 1 - j]
      const s = JSON.stringify(item)
      ctx.fillText(s, x, y)
      y += 30
    }
  }
})