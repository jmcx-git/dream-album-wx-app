var app = getApp();
Page({
  data: {
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
    replayHidden:false
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
    that.albumId = options.albumId;
    that.userAlbumId = options.userAlbumId;
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
    let albumId = that.albumId;
    let userAlbumId = that.userAlbumId;
    wx.request({
      url: app.globalData.serverHost + 'dream/album/common/getpreview.json?',
      data: {
        albumId: albumId == undefined ? '' : albumId,
        userAlbumId: userAlbumId == undefined ? '' : userAlbumId,
        appId: app.globalData.appId
      },
      method: 'GET',
      success: function (res) {
        if (res.data.makeComplete) {
          wx.hideToast();
          // if(that.data.extraPic!=undefined){
          //   res.data.loopPreImgs.push(that.data.extraPic);
          // }
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
    wx.redirectTo({
      url: '../my/my'
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
    let that = this;
    let queryStr = "appId=" + app.globalData.appId
    if(typeof this.data.shareAlbumId !== "undefined"){
        queryStr = queryStr + "&albumId=" + this.data.shareAlbumId;
    }
    if(typeof this.data.shareUserAlbumId !== "undefined"){
        queryStr = queryStr + "&userAlbumId=" + this.data.shareUserAlbumId;
    }
    queryStr=queryStr+"&lastId="+that.data.currentLink;
    return {
      title: '分享我的相册',
      desc: '欢迎来参观我的相册，这里有我给你最好的时光！',
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
  }
})