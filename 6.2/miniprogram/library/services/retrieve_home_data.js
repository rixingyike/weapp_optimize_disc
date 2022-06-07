/**
 * 这是拉取首页数据的操作
 * 因为在两个地方用到了，所以把它抽离了出来
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
// miniprogram/library/services/retrieve_home_data.js
export default function () {
  const {default:ClosureCommand} = require("../optimus/command/closure_command.js")
  const {default:ParallelCommand} = require("../optimus/command/parallel_command.js")
  const {default:promisify} = require("../optimus/promisify.js")

  // 从后端接口拉取数据
  const requestCmd = new ClosureCommand(async function () {
    const res = await promisify(wx.request)({
      url: "http://localhost:3000/api/home",
    }).catch(console.log)
    if (res && res.errMsg === "request:ok" &&
      res.data.errMsg === "ok") {
      console.log("从后端取到了首页数据");
      if (!global.retrieveHomeData.data) {
        global.retrieveHomeData.data = res.data.data
        global.retrieveHomeData.data.channel = "wx.request"
      }
      // 设置第一个节点完成
      requestCmd.markComplete()
    }
  })
  global.retrieveHomeData = new ParallelCommand([requestCmd, new ClosureCommand()]).execute()
  console.log("开始拉取首页数据");
}