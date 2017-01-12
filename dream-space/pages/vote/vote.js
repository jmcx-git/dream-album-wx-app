let app = getApp();
Page({
  data:{
    bottom_top: 500,
    entries:[],
    start: 0,
    size: 10,
    noMoreList: false,
    activityId: 0,
    findKey: ""
  },
  convert2px: function(rpx){
    return rpx / this.convertrate
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    wx.getSystemInfo({
     success: function(res){
       that.convertrate = 750/res.windowWidth;
       that.setData({
         bottom_top: res.windowHeight - that.convert2px(100),
         activityId: options.activityId
       })
      }
    })

    this.loadMore()
  },
  loadMore: function(){
    if(this.data.noMoreList){
      return
    }
    let that = this;
    wx.request({
      url: app.globalData.serverHost +"discovery/activity/works/list.json",
      data:{
        openId: app.globalData.openId,
        id: that.data.activityId,
        findKey: that.data.findKey,
        start: that.data.start,
        size: that.data.size
      },
      success:function(res){
        console.log(res)
        if(res.statusCode == 200){
          if(res.data.status == 0){
            let list = that.data.entries.concat(res.data.data.resultList);
            that.setData({
              entries: list,
              start: that.data.start + res.data.data.resultList.length,
              noMoreList: res.data.data.resultList.length < that.data.size
            })
            return
          }
        }
        let msg = "服务器错误,请稍后再试!"
        that.handleFail(msg)
      },
      fail: function(res){
        let msg = "网络出错,请稍后再试!"
        that.handleFail(msg)
      }
    })
  },
  handleFail: function(msg){
    wx.showToast({
      title: msg,
      icon: 'loading',
      duration: 2000
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})
