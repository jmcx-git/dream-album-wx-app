var app = getApp();
Page({
  data: {
    windowHeight: 0,
    windowWidth: 0,
    convertTimes: 2,
    items: []
  },
  onLoad: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        let convertTimes=750/res.windowWidth;
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          convertTimes: convertTimes
        })
      }
    })
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    let items = []
    for (let i = 0; i < 7; i++) {
      let item = {}
      item.cover = '../../image/pre' + (i+1) + '.jpg';
      item.title = '测试标题';
      item.record = i+1;
      item.desc = '描述,巴拉巴拉巴拉~';
      items.push(item)
    }
    that.setData({
      items:items
    })
  },
  addSpace:function(e){
    wx.navigateTo({
      url: '../addspace/addspace'
    })
  },
  toSpace:function(){
    wx.navigateTo({
      url: '../spacetimeline/spacetimeline'
    })
  }
})
