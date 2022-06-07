// miniprogram/index_addons/components/stopwatch/index.js
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
      let startTime = Date.now()
      let self = this
      let convertTimeStampToString = ts=> {
        let ms = (~~(ts) % 1000 + "").padStart(3, "0")
        let s = String(100 + ~~(ts / 1000) % 60).slice(1)
        let m = ~~(ts / 60000)
        if (m < 10) m = "0" + m
        console.log(m + ':' + s + '.' + ms);
        return m + ':' + s + '.' + ms
      }
      
      this.intervalId = setInterval(function() {
        const s = convertTimeStampToString(600000-(Date.now() - startTime))
          self.setData({
            text: s
          })
      }, 100)
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
