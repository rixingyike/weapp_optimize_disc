// Go：server/main.go
package main

import (
	"github.com/kataras/iris/v12"
	"local/models"
	"local/routers"
	"local/middlewares"
	"fmt"
	"os"
	"github.com/lucas-clemente/quic-go/http3"
)

func main() {
	db := models.ConnectMySQL()
	defer db.Close() // 延迟关闭数据库连接

	app := iris.New()
	middlewares.Init(app)
	routers.Init(app, db)

	// var PORT = os.Getenv("PORT")
	// app.Listen(fmt.Sprintf(":%s",PORT))

	var PORT = os.Getenv("PORT")
	fmt.Printf("\nstarting server at port:%v\n", PORT)
	if PORT == "443" {
		app.Run(iris.Raw(func() error {
			return http3.ListenAndServe(fmt.Sprintf(":%s",PORT), "./localhost.cert", "./localhost.key", app)
		}))
	}else{
		app.Listen(fmt.Sprintf(":%s",PORT))
	}
}
