/**
 * 将小程序/小游戏异步接口转为同步接口
 * 这是异步转同步编程范式必需的一个工具函数
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
// miniprogram/library/optimus/promisify.js
// 将小程序/小游戏异步接口转为同步接口
export default function promisify(fn) {
  return (args = {}) =>
    new Promise((resolve, reject) => {
      fn(
        Object.assign(args, {
          success: resolve,
          fail: reject
        })
      )
    })
}