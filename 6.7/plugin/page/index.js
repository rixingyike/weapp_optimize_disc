Page({
  data: {
    message: '',
  },
  onLoad() {
    const message = requireMiniProgram().greeting()
    this.setData({ message })
  }
})