/**
 * 让静态目录下的本地文件，上传至腾讯云cos的脚本
 * 结果以json的格式保存到cos_urls.json文件中
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
// tools/upload.js
const fs = require("fs")
const path = require("path")
const { uploadImageToCos } = require("./upload_img_to_cos.js")
const targetDir = "../miniprogram/static/"

// 循环读取文件
function readFileList(path, filesList) {
  var files = fs.readdirSync(path);
  files.forEach(function (item, index) {
    var stat = fs.statSync(path + item);
    if (stat.isDirectory()) {
      //递归读取文件
      readFileList(path + item + "/", filesList)
    } else {
      var obj = {}
      obj.path = path
      obj.filename = item
      filesList.push(obj);
    }
  })
}

function getFileList(path) {
  var filesList = [];
  readFileList(path, filesList);
  return filesList;
}

const imgRegExp = /.+\.(jpg|jpeg|gif|bmp|png|svg)$/;
// 获取所有图片文件
function getImageFiles(path) {
  var imageList = [];

  getFileList(path).forEach((item) => {
    if (imgRegExp.test(item.filename)) {
      imageList.push({
        path: item.path + item.filename,
        name: item.filename
      })
    }
  });
  return imageList;
}

// 开始处理本地图片
; (async function () {
  let allImages = getImageFiles(targetDir)
  const result = []
  for (const { path, name } of allImages) {
    const item = {}
    Object.assign(item, { path, name })
    const fileObject = fs.readFileSync(path)
    const res = await uploadImageToCos(fileObject, name).catch(console.log)
    Object.assign(item, res)
    result.push(item)
    console.log("item", item);
  }
  console.log("上传结果\n", JSON.stringify(result));
  fs.writeFileSync(path.resolve("./cos_urls.json"), JSON.stringify(result), "utf-8")
})()
