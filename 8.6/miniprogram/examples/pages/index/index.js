Page({
  data: {
    list: [{
      id: 'form',
      name: '扩展',
      open: true,
      pages: ['performance', 'input', 'form', 'list', 'slideview', 'slider', 'uploader'],
    }, {
      id: 'layout',
      name: '基础',
      open: false,
      pages: ['article', 'badge', 'flex', 'footer', 'gallery', 'grid', 'icons', 'loading', 'loadmore', 'panel', 'preview', 'progress', 'steps'],
    },],
  },
  kindToggle(e) {
    const {
      id
    } = e.currentTarget;
    const {
      list
    } = this.data;
    let tempData = {}

    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        if (list[i].open != !list[i].open) {
          tempData[`list[${i}].open`] = !list[i].open
        }
        list[i].open = !list[i].open
      } else {
        if (list[i].open != false) {
          tempData[`list[${i}].open`] = false
        }
        list[i].open = false
      }
    }

    console.log("tempData", tempData);
    // this.setData({
    //   list,
    // });
    this.setData(tempData)
  },
  nav(e){
    const page = e.currentTarget.dataset.page
    const {default:router} = require("../../../library/optimus/router.js")
    router.navigateTo({
      url: page
    })
  }
});