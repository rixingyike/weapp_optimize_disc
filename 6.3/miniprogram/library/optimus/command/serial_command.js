// JS：command/serial_command_group.js
/**
 * 串发复合命令对象
 * 可以让动画一个接一个依次执行
 * 也可以让js代码依次执行，其中前一段代码是后一段代码执行的前提条件
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
import CommandGroup from "command_group.js"
import Iterator from "../iterator.js"

/** 串发复合命令，子命令依次执行，直至所有完成 */
class SerialCommand extends CommandGroup {
  execute() {
    const iterator = new Iterator(this.subCommands)
    const executeNextCommand = () => {
      let c = iterator.next()
      if (!c.done) {
        c = c.value
        c.once("complete", () => {
          executeNextCommand()
        })
        c.execute()
      } else {
        this.markComplete()
      }
    }
    executeNextCommand()
    return this 
  }
}

export default SerialCommand