// cloudfunctions/getHomeData/index.js
// 云函数入口文件
const cloud = require("wx-server-sdk")

cloud.init()

const imgUrls = [
  "/static/images/goods1.png",
  "/static/images/goods2.png",
  "/static/images/goods3.png",
  "/static/images/goods4.png",
]

// 云函数入口函数
exports.main = async (event, context) => {
  const page = event.page || 1
  const size = 10
  const list = new Array(size).fill({})

  for (let j = 0; j < size; j++) {
    let id = (page - 1) * size + j + 1
    console.log(page, id);
    list[j] = {}
    list[j].id = id
    list[j].title = `标题${id}`
    console.log(list[j].title);
    list[j].text = "小程序是一种新的开放能力，开发者可以快速地开发一个小程序。小程序可以在微信内被便捷地获取和传播。"
    list[j].icon = imgUrls[~~Math.random() * imgUrls.length]
  }

  const navs = new Array(5)
  for (let j = 0; j < navs.length; j++) {
    navs[j] = "/static/icons/nav.png"
  }
  const swipers = new Array(3).fill({})
  for (let j = 0; j < swipers.length; j++) {
    swipers[j].className = `demo-text-${j + 1}`,
      swipers[j].banner = "/static/images/BANNER.png"
  }

  const data = {
    navs,
    swipers,
    list,
    page,
    size,
  }

  return { data, errMsg: "ok" }
}