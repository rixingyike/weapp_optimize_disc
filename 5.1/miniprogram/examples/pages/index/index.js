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

    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list
    })
  },
  nav(e){
    const page = e.currentTarget.dataset.page
    wx.navigateTo({
      url: page
    })
  }
});