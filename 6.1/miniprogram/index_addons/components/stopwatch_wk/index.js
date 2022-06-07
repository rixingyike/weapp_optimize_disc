// miniprogram/index_addons/components/stopwatch_wk/index.js
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
      this.worker = wx.createWorker('workers/index.js', {
        useExperimentalworker: true
      })
      this.worker.onMessage(res => {
        self.setData({ text: res.result })
        flag = true
      })

      let convertTimeStampToString = (ts) => {
        flag = false
        self.worker.postMessage({ ts: 600000 - (Date.now() - startTime) })
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
      if (this.worker) {
        this.worker.terminate()
        this.worker = null
      }
    },
    switch() {
      this.properties.mode === "stop" ? this.start() : this.stop()
      console.log(this.properties.mode);
    }
  }
})
