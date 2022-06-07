/**
 * 编译WebAssembly文件的Go语言源码
 * 用于向小程序提供一个格式化时间字符串的方法
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
// go_stopwatch/main.go
package main

import (
	"syscall/js"
	"time"
	"strconv"
)

var zero = time.Unix(0, 0).UTC()

// js调用Go, Go回调js
func getFormatedMiniSeconds(this js.Value, args []js.Value) interface{} {
	// js输入参数，是一个ms时间，代表JS里的startTime
	msStr := args[0].String()
	// js回调函数
	callback := args[1]

	// Go协程
	go func() {
		ms,_ := strconv.ParseInt(msStr, 10, 64)
		startTime := time.UnixMilli(ms).UTC()
		delta := time.Now().Sub(startTime)
		res := zero.Add(delta).Format("04:05.000")
		res += "ms"
		// 运行js回调函数
		callback.Invoke(res)
	}()

	return nil
}

func main() {
	// 创建通道
	channel := make(chan int)
	// 1.Go调用js的console.log()方法,在开发者工具的Consol面板中查看。
	console := js.Global().Get("console")

	// 2.js调用Go的asyncAndCallbak()方法, Go回调js。
	js.Global().Set("getFormatedMiniSeconds", js.FuncOf(getFormatedMiniSeconds))

	// 通道阻塞了main()方法，防止程序退出
	// 如果程序退出
	<-channel
	console.Call("log", "exit")
}
