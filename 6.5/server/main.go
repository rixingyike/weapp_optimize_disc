// Go：server/main.go
package main

import (
	"github.com/kataras/iris/v12"
	"local/models"
	"local/routers"
	"local/middlewares"
	"fmt"
	"os"
)

func main() {
	db := models.ConnectMySQL()
	defer db.Close() // 延迟关闭数据库连接

	app := iris.New()
	middlewares.Init(app)
	routers.Init(app, db)

	var PORT = os.Getenv("PORT")
	app.Listen(fmt.Sprintf(":%s",PORT))
}
