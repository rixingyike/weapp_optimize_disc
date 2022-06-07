// miniprogram/index_addons/components/stopwatch_wxs/index.js
Component({
  data: {
    mode: "stop", // mode需要动态绑定
    text: "00:00.000"
  },
  methods: {
    start() {
      this.setData({
        mode: "start"
      })
    },
    stop() {
      this.setData({
        mode: "stop"
      })
    },
    switch() {
      this.data.mode === "stop" ? this.start() : this.stop()
      console.log(this.data.mode);
    }
  }
})
