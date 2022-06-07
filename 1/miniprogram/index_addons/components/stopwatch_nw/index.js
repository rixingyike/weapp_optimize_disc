// miniprogram/index_addons/components/stopwatch_nw/index.js
const {default:request} = require("../../../library/optimus/request.js")

Component({
  // 组件自定义属性
  properties: {
    mode: { // 属性名
      type: String,
      value: "stop"
    }
  },
  lifetimes:{},
  // 组件所在页面的生命周期
  pageLifetimes: {
    hide(){
      this.stop() // 在页面跳转或转入后台隐藏时，停止定时器
    }
  },
  data: {
    text: "00:00.000"
  },
  methods: {
    start() {
      this.properties.mode = "start"
      let flag = true
      // let self = this
      let startTime = Date.now()

      const convertTimeStampToString = async ts => {
        flag = false
        // 调用后端时间格式化接口
        const res = await request({
          url: `http://localhost:3000/api/home/formatedms?ts=${ts}`,
        }).catch(console.log)
        if (res && res.errMsg === "request:ok") {
          this.setData({ text: res.data.data })
          flag = true
        }
      }

      this.intervalId = setInterval(function () {
        if (flag) {
          convertTimeStampToString(600000 - (Date.now() - startTime))
        }
      }, 300)
    },
    stop() {
      this.properties.mode = "stop"
      clearInterval(this.intervalId)
    },
    switch() {
      this.properties.mode === "stop" ? this.start() : this.stop()
      console.log(this.properties.mode);
    }
  }
})
