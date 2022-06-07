// JS：command/parallel_command_group.js
/**
 * 并发复合命令对象
 * 它可以用于同时启动的动画，也可以用于js中并发执行的代码
 * 它还有竞赛模式，把raceMode参数设置为true就是竞赛模式
 * 在竞赛模式内，只要有一个子命令完成执行了，复合命令即算完成
 * 反之要等所有子命令全部完成
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
import CommandGroup from "command_group.js"
import Iterator from "../iterator.js"

/** 并发复合命令，所有子命令一起执行，直接最后一个完成 */
class ParallelCommand extends CommandGroup {
  constructor(subCommands = [], isRaceMode = false) {
    super(subCommands)
    this.#isRaceMode = isRaceMode
  }

  #completedNumber = 0

  /** 是否为竞赛模式，该模式下只要有一个子命令完成，即算完成 */
  #isRaceMode = false

  execute() {
    const iterator = new Iterator(this.subCommands)
    let item = iterator.next()
    while (!item.done) {
      const c = item.value
      c.once("complete", () => {
        if (!this.#isRaceMode) {
          if (++this.#completedNumber >= this.subCommands.length) {
            this.markComplete()
          }
        }else {
          this.markComplete()
        }
      })
      c.execute()
      item = iterator.next()
    }
    return this 
  }

  dispose() {
    super.dispose()
    this.#completedNumber = 0
  }
}

export default ParallelCommand