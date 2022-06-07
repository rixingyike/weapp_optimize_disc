// Go：controllers\api\home.go
/**
 * 给小程序优化示例使用的后端简易接口
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * 腾讯云TVP，公众号/视频号'网络榨知机'作者，
 * 学编程就像登山，小白学编程7天入门。
 * 
*/
package api

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net"
	"time"
	"os"

	"fmt"
	"local/models"
	"math/rand"
	"strconv"

	"github.com/kataras/iris/v12"
	"xorm.io/xorm"
)

// curl测试示例
// GET：/api/home/navs
// curl -X GET "http://localhost:3000/api/home/formatedms?ts=11100000"
// curl -X GET http://localhost:3000/api/home/navs
// curl -v -k --http2 https://localhost/api/home/navs

var (
	// 长列表数据中备用的图片地址
	imgUrls = []string{
		"/static/images/goods1.png",
		"/static/images/goods2.png",
		"/static/images/goods3.png",
		"/static/images/goods4.png",
	}

	// 网络请求用到的客户端，向微信服务器发起
	httpTransport = &http.Transport{
		DialContext: (&net.Dialer{
			Timeout:   30 * time.Second,
			KeepAlive: 30 * time.Second,
		}).DialContext,
		ForceAttemptHTTP2:     true,
		MaxIdleConns:          100,
		IdleConnTimeout:       90 * time.Second,
		TLSHandshakeTimeout:   10 * time.Second,
		ExpectContinueTimeout: 1 * time.Second,
	}
	client = http.Client{
		Transport: httpTransport,
		Timeout: time.Second * 3, // Timeout after 3 seconds
	}
	// 在拉取小程序token时用到密钥信息，写在环境变量中了，见~/.bashrc
	APPID = os.Getenv("WEAPP01_APP_ID")
	APPSECRET = os.Getenv("WEAPP01_APP_SECRET")

	// 格式化时间时用到零时对象
	zero = time.Unix(0, 0).UTC()
)

type (
	// 导航对象的信息结构
	Nav struct{
		Id int `json:"id"`
		Title string `json:"title"`
		Icon string `json:"icon"`
		Page string `json:"page"`
	}
)

// 拉取微信微信服务器上的token，用于访问小程序接口
// 见文档：https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html
func getAccessToken() string {
	url := fmt.Sprintf("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s",APPID,APPSECRET)
	req, _ := http.NewRequest(http.MethodGet, url, nil)
	res, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)
	accessToken := struct{
		AccessToken string `json:"access_token"`
		ExpiresIn int `json:"expires_in"`
	}{}
	json.Unmarshal(body, &accessToken)
	return accessToken.AccessToken
}

// 接口基地址：/api/home/
type HomeController struct {
	Ctx iris.Context // HTTP请求上下文对象，由iris自动绑定
	Db  *xorm.Engine
}

// 由毫秒获取已消逝的时间，在go WebAssembly文件中有同样计算
// GET：/api/home/formatedms?ts=11100000
func (c *HomeController) GetFormatedms() models.Result {
	ts,_ := strconv.ParseInt(c.Ctx.URLParamDefault("ts", "0"), 10, 64)
	startTime := time.UnixMilli(ts).UTC()
	delta := time.Now().Sub(startTime)
	res := zero.Add(delta).Format("04:05.000")

	return models.Result{Data: res, ErrMsg: "ok"}
}

// 模拟提供首页全部数据，1000条
// GET：/api/home
func (c *HomeController) Get() models.Result {
	imgRandSource := rand.NewSource(time.Now().Unix())
	imgRand := rand.New(imgRandSource)

	list := make([]struct{
		Id int `json:"id"`
		Title string `json:"title"`
		Text string `json:"text"`
		Icon string `json:"icon"`
	}, 1000)
	for j := 0; j < len(list); j++ {
		list[j].Id = j+1
		list[j].Title = fmt.Sprintf("标题「%d」", j+1)
		list[j].Text = "小程序是一种新的开放能力，开发者可以快速地开发一个小程序。小程序可以在微信内被便捷地获取和传播。"
		list[j].Icon = imgUrls[imgRand.Intn(len(imgUrls))]
	}

	navs := make([]string, 5)
	for j := 0; j < len(navs); j++ {
		navs[j] = "/static/icons/nav.png"
	}
	swipers := make([]struct {
		ClassName string `json:"className"`
		Banner string `json:"banner"`
	},3)
	for j := 0; j < len(swipers); j++ {
		swipers[j].ClassName = fmt.Sprintf("demo-text-%d", j+1)
		swipers[j].Banner = "https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/BANNER.png?x-oss-process=image/format,webp"
	}

	var data = map[string]interface{}{
		"navs":navs,
		"swipers":swipers,
		"list":list,
	}

	return models.Result{Data: data, ErrMsg: "ok"}
}

// 分页提供首页列表数据，每页10条
// GET：/api/home/:page
func (c *HomeController) GetBy(page int64) models.Result {
	size,_ := strconv.ParseInt(c.Ctx.URLParamDefault("size", "10"), 10, 64)

	imgRandSource := rand.NewSource(time.Now().Unix())
	imgRand := rand.New(imgRandSource)

	list := make([]struct{
		Id int `json:"id"`
		Title string `json:"title"`
		Text string `json:"text"`
		Icon string `json:"icon"`
	}, size)
	for j := 0; j < len(list); j++ {
		var id = int((page-1) * size) + j + 1
		list[j].Id = id
		list[j].Title = fmt.Sprintf("标题「%d」", id)
		list[j].Text = "小程序是一种新的开放能力，开发者可以快速地开发一个小程序。小程序可以在微信内被便捷地获取和传播。"
		list[j].Icon = imgUrls[imgRand.Intn(len(imgUrls))]
	}

	navs := make([]string, 5)
	for j := 0; j < len(navs); j++ {
		navs[j] = "https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/nav.png?x-oss-process=image/format,webp"
	}
	swipers := make([]struct {
		ClassName string `json:"className"`
		Banner string `json:"banner"`
	},3)
	for j := 0; j < len(swipers); j++ {
		swipers[j].ClassName = fmt.Sprintf("demo-text-%d", j+1)
		swipers[j].Banner = "https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/BANNER.png?x-oss-process=image/format,webp"
	}

	var data = map[string]interface{}{
		"navs":navs,
		"swipers":swipers,
		"list":list,
		"page":page,
		"size":size,
	}

	return models.Result{Data: data, ErrMsg: "ok"}
}

// 首页轮播图数据，4条
// GET：/api/home/swipers
func (c *HomeController) GetSwipers() models.Result {
	swipers := []string{
		"http://mmbiz.qpic.cn/sz_mmbiz_jpg/GEWVeJPFkSEV5QjxLDJaL6ibHLSZ02TIcve0ocPXrdTVqGGbqAmh5Mw9V7504dlEiatSvnyibibHCrVQO2GEYsJicPA/0?wx_fmt=jpeg",
		"http://mmbiz.qpic.cn/sz_mmbiz_jpg/GEWVeJPFkSEV5QjxLDJaL6ibHLSZ02TIcve0ocPXrdTVqGGbqAmh5Mw9V7504dlEiatSvnyibibHCrVQO2GEYsJicPA/0?wx_fmt=jpeg",
		"http://mmbiz.qpic.cn/sz_mmbiz_jpg/GEWVeJPFkSEV5QjxLDJaL6ibHLSZ02TIcve0ocPXrdTVqGGbqAmh5Mw9V7504dlEiatSvnyibibHCrVQO2GEYsJicPA/0?wx_fmt=jpeg",
		"http://mmbiz.qpic.cn/sz_mmbiz_jpg/GEWVeJPFkSEV5QjxLDJaL6ibHLSZ02TIcve0ocPXrdTVqGGbqAmh5Mw9V7504dlEiatSvnyibibHCrVQO2GEYsJicPA/0?wx_fmt=jpeg",
	}

	var data = map[string]interface{}{
		"swipers":swipers,
	}

	return models.Result{Data: data, ErrMsg: "ok"}
}

// 提供首的导航信息，4条
// GET：/api/home/navs
func (c *HomeController) GetNavs() models.Result {
	list := make([]Nav, 5)
	list[0] = Nav{1,"封面页","https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/nav.png?x-oss-process=image/format,webp","/pages/cover/index"}
	list[1] = Nav{2,"首页","https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/nav.png?x-oss-process=image/format,webp","/index/pages/index/index"}
	list[2] = Nav{3,"我的主页","https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/nav.png?x-oss-process=image/format,webp","/user/pages/my/index"}
	list[3] = Nav{4,"商品详情页","https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/nav.png?x-oss-process=image/format,webp","/goods/pages/detail/index"}
	list[4] = Nav{5,"扩展示例","https://cloud-1252822131.cos.ap-beijing.myqcloud.com/images/nav.png?x-oss-process=image/format,webp","/examples/pages/index/index"}

	return models.Result{Data: list, ErrMsg: "ok"}
}

type LoginResp struct {
	Account string `json:"account"`
}
