/**
 * 一个朴素的防抖动函数
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
function debounce(func, wait = 50){
  let timer = null

  return function(...args) {
    const context = this 
    if (timer) {
      clearTimeout(timer)
      console.log("防抖少许");
    }
    timer = setTimeout(() => {
      func.call(context, ...args)
    }, wait)
  }
}

export default debounce