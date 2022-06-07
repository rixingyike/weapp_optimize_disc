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

  // 设置自定义登录态，在周期性拉取数据时带上，便于服务器验证小程序端的请求合法性
  wx.setBackgroundFetchToken({
    token: "WeappOptimus" // 方便服务器验证请求的合法性，对数据预拉取操作无影响
  })
  // 监听开始数据预拉取后收到 backgroundFetch 数据事件
  const fetchData1Cmd = new ClosureCommand(() => {
    wx.onBackgroundFetchData((res) => {
      console.log("已经取得缓存数据1", res.timeStamp)
      // 返回的数据是一个json字符串，并非json对象
      if (!global.retrieveHomeData?.data) {
        global.retrieveHomeData.data = (JSON.parse(res.fetchedData)).data
        global.retrieveHomeData.data.channel = "onBackgroundFetchData"
      }
      fetchData1Cmd.markComplete()
    })
  })
  // 预拉取
  const fetchData2Cmd = new ClosureCommand(async () => {
    const res = await promisify(wx.getBackgroundFetchData)({
      fetchType: "pre",
    }).catch(console.log)
    if (res && res.errMsg === "getBackgroundFetchData:ok") {
      console.log("已经取得缓存数据2", res.timeStamp, (JSON.parse(res.fetchedData)).data)
      if (!global.retrieveHomeData.data) {
        global.retrieveHomeData.data = (JSON.parse(res.fetchedData)).data
        global.retrieveHomeData.data.channel = "getBackgroundFetchData"
      }
      fetchData2Cmd.markComplete()
    }
  })

  // 获取周期性更新的数据（12小时）
  const fetchData3Cmd = new ClosureCommand(async () => {
    const res = await promisify(wx.getBackgroundFetchData)({
      fetchType: "periodic",
    }).catch(console.log)
    if (res && res.errMsg === "getBackgroundFetchData:ok") {
      console.log("已经取得缓存数据3", res.timeStamp, (JSON.parse(res.fetchedData)).data)
      if (!global.retrieveHomeData.data) {
        global.retrieveHomeData.data = (JSON.parse(res.fetchedData)).data
        global.retrieveHomeData.data.channel = "getBackgroundFetchData:periodic"
      }
      fetchData3Cmd.markComplete()
    }
  })

  // 从后端接口拉取数据
  const requestCmd = new ClosureCommand(async function () {
    const res = await promisify(wx.request)({
      url: "http://localhost:3000/api/home/1",
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
  // 使用竞赛模式
  const preFetchDataParallelCmd = new ParallelCommand([fetchData1Cmd, fetchData2Cmd, fetchData3Cmd, requestCmd], true)
    .onComplete(() => {
      console.log(`数据拿到了：${global.retrieveHomeData.data.channel}`);
      preFetchDataParallelCmd.dispose()
    })
  // 代替原单一方式的数据拉取
  global.retrieveHomeData = new ParallelCommand([preFetchDataParallelCmd, new ClosureCommand()]).execute()
  console.log("开始拉取首页数据");
}