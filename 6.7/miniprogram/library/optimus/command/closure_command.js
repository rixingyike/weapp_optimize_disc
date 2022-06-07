// JS：command/closure_func_command.js
/**
 * 闭包命令
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
import Command from "command.js"

/** 执行一个闭包函数的命令，需要手动标记完成
 * @param thisRef 如果不指定this，默认是当前对象
 */
class ClosureCommand extends Command{
  constructor(closure){
    super()
    this.#closure = closure 
  }
  #closure

  execute(){
    this.#closure?.()
    return this 
  }
}

export default ClosureCommand