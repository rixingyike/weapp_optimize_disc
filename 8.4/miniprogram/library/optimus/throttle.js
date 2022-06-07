/**
 * 一个朴素的节流函数
 * 它可以直接套在小程序页面中事件监听函数的外面，并且也劫持在代码中保留this
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
function throttle(method, wait = 50) {
  let previous = 0
  return function(...args) {
    let context = this
    let now = new Date().getTime()
    if (now - previous > wait) {
      method.apply(context, args)
      previous = now
    }else {
      console.log("节流少许");
    }
  }
}

export default throttle