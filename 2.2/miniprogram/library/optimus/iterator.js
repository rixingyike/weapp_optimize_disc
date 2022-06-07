// JS：iterator.js
/**
 * 扩展Object类型的迭代器接口
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
if (!Object.prototype[Symbol.iterator]){
  Object.prototype[Symbol.iterator] = function* () {
    let keys = Object.keys(this).sort()
    for (let key of keys) {
      yield [key, this[key]]
    }
  }
}

/** 迭代器 */
class Iterator{
  /** 迭代器构造器
   * @param {*} source Object、Array、String、Set、Map和TypedArray
   */
  constructor(source){
    this.#internalIterator = source[Symbol.iterator]()
  }

  #internalIterator

  next(){
    return this.#internalIterator.next()
  }
}

export default Iterator