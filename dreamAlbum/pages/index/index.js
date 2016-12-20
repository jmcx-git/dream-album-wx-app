var app=getApp();
Page({
  data:{
    items:[],
    winHeight:0,
    winWidth:0,
    start:0,
    size:10,
    nomore:false,
    picLoadFinish:false,
    picLoadCount:0
  },
  previewImage:function(e){
    //进入预览页面
    wx.navigateTo({
      url:'../viewswiper/viewswiper?albumId='+e.currentTarget.dataset.albumid
     })
  },
  createImage:function(e){
    //进入制作页面
    wx.navigateTo({
      url: '../create/create?albumId='+e.currentTarget.dataset.albumid
    })
  },
  onLoad:function(){
    let that=this;
    that.setData({
      winWidth:app.globalData.windowWidth,
      winHeight:app.globalData.windowHeight
    })
   this.search();
  },
  requestFailed: function(res){
    wx.showModal({
      title:"提示",
      content: "网络错误，请稍后再试！"
    }),
    wx.hideToast()
  },
  onPullDownRefresh:function(){
    this.refreshData();
    wx.stopPullDownRefresh();
  },
  refreshData:function(){
    let that=this;
    this.setData({
      start:0,
      size:that.data.size,
      items:[],
      nomore:false,
      picLoadFinish:false,
      picLoadCount:0
    })
    this.search();
  },
  moreData:function(){
    this.search();
  },
  search(){
    let that=this;
    if(that.data.nomore){
      return;
    }
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    })
    that.consoleImage();
    wx.request({
      url: app.globalData.serverHost+'dream/album/common/homepage.json',
      data: {
        size:that.data.size,
        start:that.data.start
      },
      method: 'GET',
      success: function(res){
        that.setData({
          items:that.data.items.concat(res.data.albumList),
          start:that.data.start+res.data.albumList.length
        });
        if(res.data.albumList.length<that.data.size){
          that.setData({
            nomore:true
          })
        }
        console.log("Finish load album list.");
        // wx.hideToast();
      },
      fail: function(res){
        that.requestFailed(res)
      }
    })
  },
  picLoad:function(e){
    let that=this;
    this.setData({
      picLoadCount:that.data.picLoadCount+1
    })
    if(this.data.picLoadCount==this.data.items.length){
      wx.hideToast();
      that.setData({
        picLoadFinish:true
      })
    }
  },
  onReady:function(){
    console.log("页面ready");
  },
  onShow:function(){
    
  },
  consoleImage:function(){
    let that=this;
    setTimeout(function(){
        that.setData({
          picLoadFinish:true
        })
    },10000)
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})