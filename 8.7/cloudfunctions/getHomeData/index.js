// cloudfunctions/getHomeData/index.js
// 云函数入口文件
const cloud = require("wx-server-sdk")

cloud.init()

const imgUrls = [
  "https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/goods1.png?x-oss-process=image/format,webp",
  "https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/goods2.png?x-oss-process=image/format,webp",
  "https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/goods3.png?x-oss-process=image/format,webp",
  "https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/goods4.png?x-oss-process=image/format,webp",
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
    navs[j] = "https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/nav.png?x-oss-process=image/format,webp"
  }
  const swipers = new Array(3).fill({})
  for (let j = 0; j < swipers.length; j++) {
    swipers[j].className = `demo-text-${j + 1}`,
      swipers[j].banner = "https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/BANNER.png?x-oss-process=image/format,webp"
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