var app=getApp();
Page({
  data:{
    items:[],
    winHeight:0,
    winWidth:0,
    start:0,
    size:10,
    nomore:false
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
  onLoad:function(options){
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
      nomore:false
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
      duration: 5000
    });
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
          start:that.data.start+res.data.albumList.length,
        });
        if(res.data.albumList.length<that.data.size){
          that.setData({
            nomore:true
          })
        }
        console.log("Finish load album list.");
        wx.hideToast();
      },
      fail: function(res){
        that.requestFailed(res)
      }
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