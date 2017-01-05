var app = getApp();
Page({
  data: {
    userAnimation: true,

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
    nickName: ""
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
      this.setData({
        showNav: true
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
    let albumId = that.albumId;
    let userAlbumId = that.userAlbumId;
    wx.request({
      url: app.globalData.serverHost + 'dream/album/lite/common/getpreview.json?',
      data: {
        albumId: albumId == undefined ? '' : albumId,
        userAlbumId: userAlbumId == undefined ? '' : userAlbumId,
        appId: app.globalData.appId,
        openId: app.globalData.openId
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
    var url = '../my/my?from=share&shareUserOpenId=' + app.globalData.openId;
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
    let queryStr = "shared=1&appId=" + app.globalData.appId + "&openId=" + app.globalData.openId + "&userAlbumId=" + this.data.shareUserAlbumId;
    var title="";
    if(typeof app.globalData.nickName !== "undefined"){
      title = "分享" + app.globalData.nickName + "的相册";
    }else{
      title = "分享给我的亲密好友的相册";
    }
    
    let desc = "这里记录了我的精彩照片和故事，快来看看吧！";
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
