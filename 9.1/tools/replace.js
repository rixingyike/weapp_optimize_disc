// tools/replace.js
const fs = require("fs")
const path = require("path")
// const dealWithDir = "../server/controllers/api/"
const dealWithDir = "../cloudfunctions/getHomeData/"
// const dealWithDir = "../miniprogram/components/tab_bar/"
const cosUrlsFile = "./cos_urls.json"
const regExp = /.+\.(go|wxml|js)$/;
const localToCloud = true // 从本地向云端替换

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

// 获取所有图片文件
function getFiles(path) {
  var imageList = [];

  getFileList(path).forEach((item) => {
    if (regExp.test(item.filename)) {
      imageList.push({
        path: item.path + item.filename,
        name: item.filename
      })
    }
  });
  return imageList;
}

function readAsJsonObject(target) {
  const res = fs.readFileSync(target, 'utf-8');
  const data = JSON.parse(res.toString());
  // console.log(data);
  return data
}

// 递归创建目录
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

// 开通替换链接
;(function(){
  const urlsData = readAsJsonObject(cosUrlsFile)
  console.log(urlsData);
  const allFiles = getFiles(dealWithDir)
  console.log(allFiles);
  for (const { path: targetFilePath } of allFiles) {
    let fileContent = fs.readFileSync(targetFilePath, 'utf-8').toString()
    let hasReplaced = false
    for (let {path,webpUrl} of urlsData) {
      if (path.startsWith("./")) path = path.substring(1) // 路径中一般没有“.”开头
      if (localToCloud) {
        if (fileContent.indexOf(path) > -1) {
          fileContent = fileContent.replace(path, webpUrl,-1)
          hasReplaced = true 
        }
      } else {
        // console.log("webpUrl", webpUrl);
        if (fileContent.indexOf(webpUrl) > -1) {
          fileContent = fileContent.replace(webpUrl, path,-1)
          hasReplaced = true 
        }
      }
    }
    if (hasReplaced) {
      const newDestFilePath = path.join(path.resolve("./dist"), path.resolve(targetFilePath).replace(path.resolve("../"), ""))
      mkdirsSync(path.dirname(newDestFilePath))
      fs.writeFileSync(newDestFilePath, fileContent, "utf-8")
      console.log(`已经处理${newDestFilePath}`)
    }
  }
})()
