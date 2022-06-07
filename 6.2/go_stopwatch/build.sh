# 在运行该指令前，要安装go1.17.8，版本要一致
# go env -w GO111MODULE=off
GO111MODULE=off GOOS=js GOARCH=wasm go build -o stopwatch.wasm main.go