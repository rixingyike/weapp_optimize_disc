// miniprogram/components/tab_bar/index.js
Component({
  data: {
    selected: 0,
    list: [ {
      "pagePath": "/goods/pages/detail/index",
      "iconPath": "/static/icons/goods.png",
      "selectedIconPath": "/static/icons/goods_on.png",
      "text": "商品"
    }, {
      "pagePath": "/index/pages/index/index",
      "iconPath": "/static/icons/list.png",
      "selectedIconPath": "/static/icons/list_on.png",
      "text": "主页"
    }, {
      "pagePath": "/user/pages/my/index",
      "iconPath": "/static/icons/my.png",
      "selectedIconPath": "/static/icons/my_on.png",
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
