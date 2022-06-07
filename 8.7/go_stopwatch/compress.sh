# 安装brew的脚本及压缩工具brotli
# /bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
# brew install brotli
rm -f ../miniprogram/index_addons/components/stopwatch_go/stopwatch.wasm.br
brotli -o ../miniprogram/index_addons/components/stopwatch_go/stopwatch.wasm.br stopwatch.wasm