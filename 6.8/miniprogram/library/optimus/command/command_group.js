// JS：command/command_group.js
/**
 * 复合命令对象基类，有子命令
 * 它与command共同组成的组合复合
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
import Command from "command.js"

/** 复合命令基类 */
class CommandGroup extends Command {
  constructor(subCommands = []) {
    super()
    this.subCommands = subCommands
  }

  /** 子命令集合 */
  subCommands

  /** 获取指定位置的子命令 */
  getCommand(index) {
    return this.subCommands[index]
  }

  /** 添加子命令 */
  addCommand(c) {
    this.subCommands.push(c)
    return this
  }

  /** 移除子命令 */
  removeCommand(c) {
    const index = this.subCommands.indexOf(c)
    if (index) this.subCommands.splice(index, 1)
    return this
  }

  /** 重设自己及所有子命令状态 */
  dispose() {
    super.dispose()
    this.subCommands.forEach(c => c.dispose())
    return this
  }
}

export default CommandGroup