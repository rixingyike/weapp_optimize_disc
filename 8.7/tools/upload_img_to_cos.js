/**
 * 上传本地图片对腾讯云对象存储中的代码
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
// tools/upload_img_to_cos.js
const COS = require("cos-nodejs-sdk-v5")

// 查看用户中心-》访问管理-》访问密钥-》API密钥管理
const cos = new COS({
  SecretId: process.env.COS_SecretId, // 身份识别ID
  SecretKey: process.env.COS_SecretKey // 身份秘钥
})

// 上传
function uploadImageToCos(file, filename) {
  return new Promise((resolve, reject) => {
    cos.putObject({
      Bucket: "cloud-1252822131", // 存储桶名字（必须）
      Region: "ap-beijing",     // 存储桶所在地域，必须字段
      Key: `images/${filename}`,        //  文件名  必须 
      StorageClass: "STANDARD",  // 上传模式（标准模式）
      Body: file,   // 上传文件对象
      onProgress: progressData=>{  // 文件上传进度
        // console.log(JSON.stringify(progressData));
      }
    }, function (err, data) {
      if (err) {
        reject(err)
      }
      if (data) {
        const imgUrl = `https://${data.Location}`
        const webpUrl = `${imgUrl}?x-oss-process=image/format,webp`
        resolve({
          imgUrl,
          webpUrl
        })
      }
    });
  })
}

// ; (async function () {
//   const fileObject = fs.readFileSync("./static/images/goods1.png")
//   const url = await uploadImageToCos(fileObject,"goods1.png").catch(console.log)
//   console.log("url",url);
// })()

module.exports = {
  uploadImageToCos
}