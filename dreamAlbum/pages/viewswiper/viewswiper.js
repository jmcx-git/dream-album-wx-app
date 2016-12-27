var app=getApp();
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
    bigPreImg:'',
    loopPreImgs:[],
    intervalOver:true,
    bottomHidden:false,
    clickCount:0,
    shareTitle:'分享我的相册',
    shareDesc:'欢迎来参观我的相册，这里有我给你最好的时光！',
    shareAlbumId:'',
    shareUserAlbumId:'',
    bottomHeight: 50,
    dbClick: false,
    goClick: true
  },
  onLoad:function(options){
    let that=this;
    that.setData({
        winWidth:app.globalData.windowWidth,
        winHeight:app.globalData.windowHeight,
        shareAlbumId:options.albumId,
        shareUserAlbumId:options.userAlbumId
    })
    var albumId=options.albumId;
    var userAlbumId=options.userAlbumId;
    wx.request({
      url: app.globalData.serverHost+'dream/album/common/getpreview.json?',
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
        setTimeout(function(){
            that.setData({
              intervalOver:false,
              bottomHidden:true
            })
        },3000)
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
            wx.showToast({
              title:'下载中...',
              duration:50000,
              icon:'loading'
            })
            wx.downloadFile({
              url: e.currentTarget.dataset.src,
              type: 'image', // 下载资源的类型，用于客户端识别处理，有效值：image/audio/video
              // header: {}, // 设置请求的 header
              success: function(ress){
                 wx.saveFile({
                    tempFilePath: ress.tempFilePath,
                    success: function(resl){
                      console.log(resl);
                      wx.hideToast();
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
              },
              fail:function(nn){
                console.log("出错了");
                console.log(nn);
              }
            })
          }
        }
      }
    })
  },
  showBottom:function(e){
    let that=this;
    this.setData({
      clickCount: that.data.clickCount + 1
    })
    setTimeout(function(){
      if(that.data.dbClick){
        return;
      }
      that.setData({
        goClick: true,
        dbClick: false,
        clickCount: 0
      })
      that.showBottomNav();
    },1000)
    setTimeout(function(){
      if(that.data.goClick){
        return;
      }
      if(that.data.clickCount >= 2){
        that.setData({
          goClick: false,
          dbClick: true,
          clickCount: 0
        });
        that.showPreviewImage(e.currentTarget.dataset.img);
      }
    }, 500);
  },
  showPreviewImage: function(imgs){
    let that = this;
    var urls=[];
    urls.push(imgs);
    wx.previewImage({
      urls: urls
    });
    that.clearData();
  },
  showBottomNav: function(){
    let that = this;
    that.setData({
      intervalOver:true,
      bottomHidden:false
    });
    that.clearData();
    setTimeout(function(){
        that.setData({
          intervalOver:false,
          bottomHidden:true
        })
      },3000)
  },
  clearData: function(){
    this.setData({
      dbClick: false,
      goClick: false,
      clickCount:0
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
    if(app.globalData.finishCreateFlag){
        wx.navigateBack({
          delta: 6
        })
    } 
  },
  onShareAppMessage:function(){
    let that=this;
    return{
      title:that.data.shareTitle,
      desc:that.data.shareDesc,
      path:'/pages/viewswiper/viewswiper?albumId='+that.data.shareAlbumId+'&userAlbumId='+that.data.shareUserAlbumId
    }
  }
})