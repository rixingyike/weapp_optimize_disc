// JS：event_dispatcher.js
/**
 * 事件派发者对象
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
class EventDispatcher {
  // 监听映射对象
  events = {}

  /** 开始监听事件 */
  on(eventType, func) {
    (this.events[eventType] || (this.events[eventType] = [])).push(func)
  }

  /** 移除事件监听 */
  off(eventType, func = undefined) {
    if (func) {
      let stack = this.events[eventType]
      if (stack && stack.length > 0) {
        for (let j = 0; j < stack.length; j++) {
          if (Object.is(stack[j], func)) {
            stack.splice(j, 1)
            break
          }
        }
      }
    } else if (eventType) {
      delete this.events[eventType]
    } else {
      for (const eventType in this.events) {
        delete this.events[eventType]
      }
    }
  }

  /** 只监听事件一次 */
  once(eventType, func) {
    function on() {
      this.off(eventType, on)
      func.apply(this, arguments)
    }
    this.on(eventType, on)
  }

  /** 发布订阅通知 */
  emit(eventType, ...args) {
    const stack = this.events[eventType]
    if (stack && stack.length > 0) {
      stack.forEach(item => item.apply(this, args))
    }
  }
}

export default EventDispatcher