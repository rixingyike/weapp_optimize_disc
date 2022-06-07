/**
 * 将onXxx形式的事件异步监听方法转为同步调用，
 * 只监听一次，昨到结果后立马以wx.offXx解除全局监听，
 * 下次要用，需要重新发起。
 * 注意，如果监听的事件一直不来，代码阻塞会被阻塞
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
export default function promisifyOn(fn, off) {
  return () =>
    new Promise((resolve, reject) => {
      // 这里防止消费代码取到undefined误以为调用失败
      const cb = res => resolve(res || {})
      fn(cb) && unset(cb)
    })
}