Page({
  data:{
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    winWidth:0,
    winHeight:0,
    currentTab:0,
    pptHidden:false,
    portHidden:true,
    hostConfig:'https://api.mokous.com/wx/',
    testConfig:'https://developer.mokous.com/wx/',
    bigPreImg:'',
    loopPreImgs:[]
  },
  onLoad:function(options){
    let that=this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
            winWidth:res.windowWidth,
            winHeight:res.windowHeight
        })
      }
    })
    var albumId=options.albumId;
    var userAlbumId=options.userAlbumId;
    wx.request({
      url: that.data.testConfig+'dream/album/common/getpreview.json?userAlbumId='+(userAlbumId==undefined?'':userAlbumId),
      data: {
        albumId:albumId
      },
      method: 'GET',
      success: function(res){
        that.setData({
          loopPreImgs:res.data.loopPreImgs,
          bigPreImg:'https://img.mokous.com/album/template/mc/2d5b/pre.jpg'
        })
      }
    })
  },
  swichNav:function(e){
    this.setData({
      currentTab:e.currentTarget.dataset.id,
      pptHidden:e.currentTarget.dataset.id==1?true:false,
      portHidden:e.currentTarget.dataset.id==0?true:false
    })
    wx.setNavigationBarTitle({
      title: e.currentTarget.dataset.title
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