// components/login/index.js
Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },
  observers: {
    show(value) { // 监听属性show的变化
      this.setData({
        visible: value
      })
    }
  },
  data: {
    visible: false
  },
  methods: {
    async close(e) {
      const res = await wx.navigateBack().catch(console.log)
      if (!res || res.errMsg !== "navigateBack:ok") 
        this.setData({
          visible: false
        })
    },
    async login(e, retryNum = 0) {
      getApp().globalData.userInfo = e.detail.userInfo
      console.log(getApp().globalData.userInfo);
      this.close()
    }
  }
})