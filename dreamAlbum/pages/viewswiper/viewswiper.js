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
      url: that.data.testConfig+'dream/album/common/getpreview.json?',
      data: {
        albumId:albumId==undefined?'':albumId,
        userAlbumId:userAlbumId==undefined?'':userAlbumId
      },
      method: 'GET',
      success: function(res){
        that.setData({
          loopPreImgs:res.data.loopPreImgs,
          bigPreImg:res.data.bigPreImg
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
  saveImg:function(e){
    wx.showActionSheet({
      itemList:['保存到本地'],
      success:function(res){
        if(!res.cancel){
          if(res.tapIndex==0){
            wx.downloadFile({
              url: e.currentTarget.dataset.src,
              type: 'image', // 下载资源的类型，用于客户端识别处理，有效值：image/audio/video
              // header: {}, // 设置请求的 header
              success: function(ress){
                 wx.saveFile({
                    tempFilePath: ress.tempFilePath,
                    success: function(resl){
                      wx.showToast({
                        title:'保存成功',
                        icon:'success',
                        duration:1000
                      })
                    },
                    fail:function(resx){
                      console.log("失败");
                      console.log(res);
                  }
                })
              }
            })
          }
        }
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