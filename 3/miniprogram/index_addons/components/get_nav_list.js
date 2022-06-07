// miniprogram/index_addons/components/get_nav_list.js
function getNavList() {
  return [
    {
      "title": "封面页",
      "icon": "/static/icons/nav.png",
      "page": "/pages/cover/index"
    },
    {
      "title": "首页",
      "icon": "/static/icons/nav.png",
      "page": "/index/pages/index/index"
    },
    {
      "title": "我的主页",
      "icon": "/static/icons/nav.png",
      "page": "/user/pages/my/index"
    },
    {
      "title": "商品详情页",
      "icon": "/static/icons/nav.png",
      "page": "/goods/pages/detail/index"
    },
    {
      "title": "扩展示例",
      "icon": "/static/icons/nav.png",
      "page": "/examples/pages/index/index"
    }
  ]
}

export default getNavList