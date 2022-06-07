// miniprogram/index_addons/components/stopwatch_go/index.js
require("./wasm_exec.js");
const wasmFile = "/index_addons/components/stopwatch_go/stopwatch.wasm.br"
// console.log("wasmFile",wasmFile)

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
  lifetimes:{
    async ready(){
      global.console = console
      await this.initGo()
    },
    // detached(){ // 在脚本优化点添加
    //   global.console = null
    //   delete global.console
    //   delete global.Go
    //   delete global.getFormatedMiniSeconds
    // }
  },
  methods: {
    async initGo(){
      const go = new global.Go()
      try {
        const result = await WXWebAssembly.instantiate(wasmFile, go.importObject)
        console.log(`Go初始化成功：${result}`)
        // 运行go程序的main()方法，但不要得到结果
        // 在go程序的main()方法退出之前，小程序一直可以调用go程序中的方法，
        // 这行代码不可以去掉
			  await go.run(result.instance);
      } catch (err) {
        console.error("initGo error", err)
      }
    },
    start() {
      this.properties.mode = "start"
      let flag = true 
      let startTime = Date.now()
      let self = this
      let convertTimeStampToString = ts=> {
        flag = false
        global.getFormatedMiniSeconds(ts, res=> {
          self.setData({text:res})
          flag = true 
        })
      }
      // convertTimeStampToString(0)
      this.intervalId = setInterval(function() {
        if (flag) {
          convertTimeStampToString(600000-(Date.now() - startTime))
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
