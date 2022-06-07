/**
 * 主页
 * 
 * @author LIYI <9830131@qq.com>
 * @site https://www.yishulun.com/
 * @wechat 9830131
 * 
 */
const createRecycleContext = require("miniprogram-recycle-view")
const {default:promisify} = require("../../../library/optimus/promisify.js")
const {default:systemInfoMgr} = require("../../../library/manager/system_info_manager.js")
const {default:request} = require("../../../library/optimus/request.js")

const {default:debounce} = require("../../../library/optimus/debounce.js")
const {default:throttle} = require("../../../library/optimus/throttle.js")

function rpx2px(rpxNum) {
  return rpxNum * (1 / 750 * systemInfoMgr.getWindowWidth());
}

Page({
  page:1,
  ctx: null, // recycle-view的上下文对象
  data: {
    loading: true,
    loadingTip: "页面正在加载",
    newList: null, // 每次新加载的分页数据
    allList: [], // 所有长列表数据
    theme: "light",
    swipers: [],
    navs: [],
  },
  // 在scroll-view滑到页面底部时触发
  onRecycleViewScrollToLower:throttle(async function(e) {
    const page = this.page + 1
    console.log(`开始拉取第${page}页数据`);
    const res = await request({
      url: `http://localhost:3000/api/home/${page}`,
    }).catch(console.log)
    if (res && res.errMsg === "request:ok" &&
      res.data.errMsg === "ok") {
      console.log(`拿到了第${page}页数据`);
      this.dealWithListData(res.data.data)
    }
  }),
  // 使用this关键字的版本，使用箭头函数也可以
  onTapRecycleItem: debounce(function(e) {
    const index = e.currentTarget.dataset.index
    // const item = e.currentTarget.dataset.item
    // const id = e.currentTarget.dataset.id
    const item = this.data.allList[index]
    const id = item.id 
    console.log(`点击了列表项${id}:${item.title}`);
  }),
  themeChangeHandler({theme}) {
    console.log(`当前主题是${theme}`);
    this.setData({
      theme
    })
  },
  // 处理获取的数据，进行可能的必要的数据处理
  dealWithListData(data) {
    this.setData({
      loading: false,
    })
    const {
      page,
      list,
      swipers
    } = data
    this.page = page
    this.setData({
      swipers
    })
    const newList = new Array(list.length)
    for (let j = 0; j < newList.length; j++) {
      newList[j] = {
        id: j + 1,
        title: list[j].title,
        text: list[j].text,
        image: list[j].icon,
      }
    }
    this.setData({
      newList
    })
    this.data.allList = this.data.allList.concat(newList)
    this.setRecycleContext()
    // this.setRecycleContext.call(this)
  },
  setRecycleContext() {
    if (!this.ctx) {
      const args = {
        id: "recycleId",
        dataKey: "recycleList",
        page: this,
        useInPage: false,
        itemSize: {
          height: rpx2px(130),
          width: rpx2px(750)
        },
        position: {
          height: rpx2px(400)
        }
      }
      this.ctx = createRecycleContext(args)
    }
    this.ctx.append(this.data.newList)
  },
  onScroll: throttle(function(e) {
    console.log("列表发生了滚动")  // 这里节流效果明显
  }),
  onReady() {
    console.log("index onready")

    // 测试setData劫持
    // setInterval(()=>{
    //   console.log("set");
    //   this.setData({
    //       xxx: new Date().getTime()
    //   })
    // }, 500)

    // 允许异步拉取系统信息了
    global.asyncRetrieveSystemInfo?.getCommand(0).markComplete()

    // 在Page.onReady时设置第二个节点complete，这时候长列表元素才可以查询
    global.retrieveHomeData?.getCommand(1).markComplete()

    // 主页中从后端加载导航列表
    ;(async () => {
      const res = await request({
        url: "http://localhost:3000/api/home/navs",
      }).catch(console.log)
      if (res && res.errMsg === "request:ok") {
        console.log("也取到了后端的导航数据");
        const navs = res.data.data
        this.setData({
          navs
        })
        if (navs) {
          wx.setStorage({
            key: "navs",
            data: JSON.stringify(navs)
          })
        }
      }
    })()

    // 测试分包中JS代码的异步化加载与执行
    ;(async ()=>{
      // const {default:getNavList} = await getApp().requireAsync("/index_addons/components/get_nav_list.js")
      const {default:getNavList} = await require.async("../../../index_addons/components/get_nav_list.js")
      const navs = getNavList()
      console.log("分包异步化拿到了本地导航数据")
      this.setData({
        navs
      })
    })()

    // ;(async ()=>{
    //   // 测试插件中JS代码的分包异步化
    //   // 关于插件的分步异化化
    //   requirePlugin("myPlugin", plugin => {
    //     console.log("插件版本1",plugin.getPluginVersion())
    //   })
    //   // 或者使用 Promise 风格的调用
    //   let plugin = await requirePlugin.async("myPlugin").catch(console.log)
    //   console.log("插件版本2",plugin.getPluginVersion())
    // })()

    this.selectComponent("#tabBar")?.select(1)
  },
  onLoad() {
    console.log("index onload");
    wx.onThemeChange(this.themeChangeHandler)

    // 主页面已加载，可以设置数据了（如果已经请求完成）
    ;(() => {
      if (!global.retrieveHomeData) {
        const {
          default: retrieveHomeData
        } = require("../../../library/services/retrieve_home_data.js")
        retrieveHomeData()
      }
      global.retrieveHomeData?.onComplete((() => {
        console.log(`数据都准备好了，渠道：${global.retrieveHomeData.data.channel}`);
        this.dealWithListData(global.retrieveHomeData.data)
        global.retrieveHomeData.dispose() // 完成任务后释放
        delete global.retrieveHomeData
      }).bind(this))
    })()
  }
})