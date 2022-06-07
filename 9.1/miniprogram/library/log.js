const rtlog = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : {}
// 保持原console接口
const oriConsoleApi = {
  log: console.log
}

const logger = {
  debug() {
    rtlog?.debug.apply(rtlog, arguments)
  },
  info() {
    oriConsoleApi.log(...arguments)
    rtlog?.info.apply(rtlog, arguments)
  },
  warn() {
    rtlog?.warn.apply(rtlog, arguments)
  },
  error() {
    rtlog?.error.apply(rtlog, arguments)
  },
  setFilterMsg(msg) { // 从基础库2.7.3开始支持
    if (!rtlog.setFilterMsg) return
    if (typeof msg !== "string") return
    rtlog.setFilterMsg(msg)
  }
}

export default logger