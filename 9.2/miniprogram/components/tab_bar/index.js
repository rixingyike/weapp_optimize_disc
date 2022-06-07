// miniprogram/components/tab_bar/index.js
Component({
  data: {
    selected: 0,
    list: [ {
      "pagePath": "/goods/pages/detail/index",
      "iconPath": "https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/goods.png?x-oss-process=image/format,webp",
      "selectedIconPath": "https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/goods_on.png?x-oss-process=image/format,webp",
      "text": "商品"
    }, {
      "pagePath": "/index/pages/index/index",
      "iconPath": "https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/list.png?x-oss-process=image/format,webp",
      "selectedIconPath": "https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/list_on.png?x-oss-process=image/format,webp",
      "text": "主页"
    }, {
      "pagePath": "/user/pages/my/index",
      "iconPath": "https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/my.png?x-oss-process=image/format,webp",
      "selectedIconPath": "https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/my_on.png?x-oss-process=image/format,webp",
      "text": "我的"
    }]
  },
  methods: {
    select(index) {
      this.setData({
        selected: index
      })
    },
    nav(e) {
      const page = e.currentTarget.dataset.page;
      const {default:router} = require("../../library/optimus/router.js")
      // wx.navigateTo({
      //   url: page
      // })
      router.navigateTo({
        url: page
      })
    }
  }
})
