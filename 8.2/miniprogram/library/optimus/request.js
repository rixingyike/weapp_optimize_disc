/**
 * 一个代替wx.request的网络请求接口
 * 封装一些网络请求参数的设置，打破最大10个并发的限制，支持优先级设置
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
// miniprogram/library/optimus/request.js
// 后端接口的基础地址
const BASE_URL = "http://localhost:3000"
// const BASE_URL = "http://192.168.2.251:3000"
// const BASE_URL = "https://192.168.2.251"
// const BASE_URL = "https://localhost"

export default function request(args) {
  Object.assign(args, {
    enableCache: true,
    enableHttp2: true,
    enableQuic: true,
  })
  // 如果代码不包括3000网址，则不需要替换，可以直接写相对接口地址
  if (args.url.indexOf("http://localhost:3000") > -1) {
    args.url = args.url.replace("http://localhost:3000", BASE_URL)
  }else {
    args.url = `${BASE_URL}${args.url}`
  }

  return new Promise((resolve, reject) => {
    wx.request(
      Object.assign(args, {
        success: resolve,
        fail: reject
      })
    )
  })
}