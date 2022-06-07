// miniprogram/library/page.js
const nativePage = Page

export default function(options) {
  let {onLoad} = options

  // 重写onLoad方法以劫持setData，
  // onLoad方法只有在页面实例化以后才存在，所以只能在onLoad里面获取
  options.onLoad = (onLoadFunc => {
    return function (res) {
      const {setData} = this

      Object.defineProperty(this.__proto__, "setData", {
        configurable: true,
        enumerable: false,
        value(...args) {
          if (global.state !== "hide"){
            // console.log("setData发挥了作用");
            return setData.apply(this, args)
          }
          else {
            console.log("setData没有作用");
            return void(0)
          }
        }
      })
      onLoadFunc?.call(this, res)
    }
  })(onLoad)

  return nativePage?.call(this, options)
}