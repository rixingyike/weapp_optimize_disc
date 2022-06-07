// miniprogram/workers/index.js
// worker是当前worker环境默认的实例名
worker.onMessage(({ts}) => {
  let ms = (~~(ts) % 1000 + "").padStart(3, "0")
  let s = String(100 + ~~(ts / 1000) % 60).slice(1)
  let m = ~~(ts / 60000)
  if (m < 10) m = "0" + m
  let result = m + ":" + s + "." + ms
  worker.postMessage({ result })
})