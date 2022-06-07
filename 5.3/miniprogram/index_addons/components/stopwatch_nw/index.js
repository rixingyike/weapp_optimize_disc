// miniprogram/index_addons/components/stopwatch_nw/index.js

Component({
  // 组件自定义属性
  properties: {
    mode: { // 属性名
      type: String,
      value: "stop"
    }
  },
  data: {
    text: "00:00.000"
  },
  methods: {
    start() {
      this.properties.mode = "start"
      let flag = true
      let self = this
      let startTime = Date.now()

      const convertTimeStampToString = ts => {
        flag = false
        // 调用后端时间格式化接口
        wx.request({
          url: `http://localhost:3000/api/home/formatedms?ts=${ts}`,
          success:res=>{
            if (res && res.errMsg === "request:ok") {
              self.setData({ text: res.data.data })
              flag = true
            }
          },
          fail:console.log
        })
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
