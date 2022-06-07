// JS：command/sync_closure_command.js
/**
 * 执行即完成的命令对象
 * 它用于在复合命令中执行一些临时需要处理的代码
 * 它也可以用CloureCommand+markComplete代替
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
import ClosureCommand from "closure_command.js"

/** 执行不占用时间的同步闭包命令，执行后马上完成 */
class SyncClosureCommand extends ClosureCommand {
  execute() {
    super.execute()
    this.markComplete()
  }
}

export default SyncClosureCommand