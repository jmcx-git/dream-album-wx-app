var app = getApp();
Page({
  data: {
    userAnimation: false,

    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    winWidth: 0,
    winHeight: 0,
    bigPreImg: '',
    loopPreImgs: [],
    shareAlbumId: '',
    shareUserAlbumId: '',
    refresh: true,
    refreshtip: '',
    extraPic:undefined,
    clickCount:0,
    currentLink:'',
    imgUrl:'',
    imgs:[],
    animationData: {},
    // animationDataPre: {},
    currentIndex:0,
    picHeight:520,
    picWidth:300,
    reloadHidden:true,
    refreshInterval:4000,
    shareAnimationDatas:[],
    avatarUrl:'',
    replayHidden:false,

    showLayer: false,
    showNav: false,
    avatarUrl: "",
    nickName: "",
    fromShare: false,
    fromShareUserOpenId: ''
  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      winWidth: app.globalData.windowWidth,
      winHeight: app.globalData.windowHeight,
      picWidth: app.globalData.windowWidth,
      picHeight: app.globalData.windowHeight,
      shareAlbumId: options.albumId,
      shareUserAlbumId: options.userAlbumId,
      avatarUrl: wx.getStorageSync('avatarUrl'),
      currentLink:wx.getStorageSync('avatarUrl')
    })
    that.from = options.from;
    that.userAlbumId = options.userAlbumId;
    //if from share
    if(typeof options.shared !== "undefined"){
        //get data from server
        var fromShareUserOpenId = options.fromShareUserOpenId
        this.setData({
          fromShare: true,
          fromShareUserOpenId: fromShareUserOpenId
        })
        wx.request({
          url: app.globalData.serverHost + 'album/user/getShareUserInfo.json?',
          data: {
            appId: app.globalData.appId,
            fromShareUserOpenId: fromShareUserOpenId
          },
          method: 'GET',
          success: function (res) {
            wx.hideToast();
            if (res.statusCode == 200 && res.data.status == 0) {          
              that.setData({
                avatarUrl: res.data.data.avatarUrl,
                nickName: res.data.data.nickName
              })
          }
        },
        fail: function(res){
          app.serverFailedToast();
        }
      });
    }else{
      this.setData({
        avatarUrl: wx.getStorageSync('avatarUrl'),
        nickName: wx.getStorageSync('nickName'),
        showNav: false
      })
    }
    this.setData({
      extraPic:options.lastId,
    })
    that.init()
  },
  init: function (e) {
    let that = this;
    that.setData({
      refreshtip: ''
    })
    let from = that.from;
    let albumId = that.albumId;
    let userAlbumId = that.userAlbumId;
    if (userAlbumId != undefined && from == 1) {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 5000
      })
      setTimeout(function () {
        that.requestData()
      }, 5000)
    } else {
      that.requestData()
    }

  },
  requestData: function (e) {
    let that = this
    let userAlbumId = that.userAlbumId;
    var openId = ""
    if(this.data.fromShare){
      openId = this.data.fromShareUserOpenId
    }else{
      openId = app.globalData.openId
    }
    wx.request({
      url: app.globalData.serverHost + 'dream/album/lite/common/getpreview.json?',
      data: {
        userAlbumId: userAlbumId == undefined ? '' : userAlbumId,
        appId: app.globalData.appId,
        openId: openId
      },
      method: 'GET',
      success: function (res) {
        if (res.data.makeComplete) {
          wx.hideToast();
          that.setData({
            refresh: false,
            loopPreImgs: res.data.loopPreImgs,
            imgs:res.data.loopPreImgs
          })
          setTimeout(function(){
              that.prepareAction();
          },500)
        } else {
          that.setData({
            refreshtip: '点击页面刷新'
          })
        }
      }
    })
  },
  showIndex:function(){
    this.setData({
      extraPic:undefined
    })
    var url = '../my/my?from=share&fromShareUserOpenId=' + app.globalData.openId;
    wx.redirectTo({
      'url': url
    })
  },
  showAlbum:function(e){
    let that=this;
    this.setData({
      clickCount: that.data.clickCount + 1
    })
    setTimeout(function(){
      if(that.data.clickCount >= 2){
        that.showPreviewImage(e.currentTarget.dataset.img);
      }else{
         that.setData({
          clickCount:0
        })
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
    that.setData({
      clickCount:0
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    let that=this;
    this.setData({
      currentIndex:0,
      imgs:[],
      animationData:{}
    })
    if (app.globalData.finishCreateFlag) {
      wx.redirectTo({
        url: "../my/my"
      })
    }
  },
  onShareAppMessage: function () {
    var queryStr = "";
    if(this.data.fromShare){
      queryStr = "shared=1&appId=" + app.globalData.appId + "&fromShareUserOpenId=" + this.data.fromShareUserOpenId + "&userAlbumId=" + this.data.shareUserAlbumId;
    }else{
      queryStr = "shared=1&appId=" + app.globalData.appId + "&fromShareUserOpenId=" + app.globalData.openId + "&userAlbumId=" + this.data.shareUserAlbumId;
    }
    
    var title="";
    let desc = "";
    if(this.data.fromShare){
      if(typeof app.globalData.nickName !== "undefined"){
        title = app.globalData.nickName + "请你来看看你们共同好友" + this.data.nickName + "的相册";
      }else{
        title = "你的好友分享给你你们共同好友"+ this.data.nickName +"的相册";
      }
    }else{
      if(typeof app.globalData.nickName !== "undefined"){
        title = app.globalData.nickName + "请你来看看她(他)的相册";
      }else{
        title = "你的好友分享给你他的相册";
      }
      desc = "这里记录了我的精彩照片和故事，快来看看吧！";
    }
    return {
      title: title,
      desc: desc,
      path: '/pages/viewswiper/viewswiper?' +  queryStr
    }
  },
  // 动画效果
  prepareAction:function(){
    let that=this;
    if(that.data.currentIndex<that.data.imgs.length){
       that.setData({
          imgUrl:that.data.imgs[that.data.currentIndex]
        })
        // that.executeAction();
        // setTimeout(function(){
        //     that.setData({
        //       currentIndex:that.data.currentIndex+1,
        //       animationData:{}
        //     })
        //     that.prepareAction();
        // },that.data.refreshInterval*2+500)
     }else{
        console.log("没有图片了了！");
        that.setData({
          reloadHidden:false
        })
      }
  },
  loadPic:function(){
    let that=this;
    that.executeAction();
    setTimeout(function(){
        that.setData({
          currentIndex:that.data.currentIndex+1,
          animationData:{}
        })
        that.prepareAction();
    },that.data.refreshInterval*2+500)
  },
  executeAction:function(){
    let that=this;
    var animations=wx.createAnimation({
      duration:that.data.refreshInterval,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50%',
      success: function(res) {
        console.log(res);
      }
    })
    this.animation=animations;
    // this.toMiddleScale();
    this.linerStartEnd();
  },
   //放到屏幕中心位置,放大缩小
  toMiddleScale:function(){
    let that=this;
    var x=this.data.winWidth/2-this.data.picWidth/2;
    var y=this.data.winHeight/2-this.data.picHeight/2;
    // this.animation.translate(x,y).scale(2,2).step();
    this.animation.scale(2.6,2.4).step();
    this.animation.scale(0,0).step();
    this.setData({
      animationData:that.animation.export()
    })
  },
  //放到屏幕中心位置,渐变出现消失
  linerStartEnd:function(){
    let that=this;
    this.animation.opacity(1).step();
    if(this.data.currentIndex!=this.data.imgs.length-1){
      this.animation.opacity(0).step();
    }else{
      this.animation.opacity(0.2).step();
    }
    this.setData({
      animationData:that.animation.export()
    })
  },
  reloadPlay:function(){
    let that=this;
    this.setData({
      reloadHidden:true,
      currentIndex:0,
      imgUrl:'',
      replayHidden:true
    })
    setTimeout(function(){
      that.setData({
        replayHidden:false
      })
      that.prepareAction();
    },500)
  },

  reloadSwiperPlay:function(){
    let that=this;
    this.setData({
      autoplay: true,
      showLayer: false,
      interval: 500
    })
  },
  swiperChange: function(event){
    var that = this;
    if(event.detail.current + 1 == this.data.loopPreImgs.length){
      setTimeout(function(){
        that.setData({          
          autoplay: false,
          showLayer: true
        }); 
      }, 2500);
    }else{
      this.setData({
        interval: 3000
      });
    }
  }
})
