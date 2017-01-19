var app = getApp();
Page({
  data: {
    userAnimation: true,
    winWidth: 0,
    winHeight: 0,

    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    loopPreImgs: [],
    itemProperties: [],
    shareAlbumId: '',
    shareUserAlbumId: '',
    refresh: true,
    refreshtip: '',
    clickCount: 0,
    picHeight: 520,
    picWidth: 300,
    reloadHidden: true,
    refreshInterval: 2000,
    avatarUrl: '',

    replayHidden: false,
    shareHidden:true,
    showShare:false,

    isLoadPic:false,

    showLayer: false,
    showNav: false,
    avatarUrl: "",
    nickName: "",
    fromShare: false,
    fromShareUserOpenId: '',
    stopMusic: false,
    bgMusic: '',
    hiddenMusicBtn: true,
    loadTotal:0,
    cssAnimationTimeMilles: 4000
    // if you want to modify above attr value, also you should modify the value in wxss file.
    // see wxss file animation-duration
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
      avatarUrl: wx.getStorageSync('avatarUrl')
    })
    that.from = options.from;
    that.userAlbumId = options.userAlbumId;
    //if from share
    if (typeof options.shared !== "undefined") {
      //get data from server
      var fromShareUserOpenId = options.fromShareUserOpenId
      this.setData({
        fromShare: true,
        showNav: true,
        fromShareUserOpenId: fromShareUserOpenId
      })
      wx.request({
        url: app.globalData.serverHost + 'album/user/getShareUserInfo.json?',
        data: {
          appId: app.globalData.appId,
          openId: fromShareUserOpenId
        },
        method: 'GET',
        success: function (res) {
          // wx.hideToast();
          if (res.statusCode == 200 && res.data.status == 0) {
            that.setData({
              avatarUrl: res.data.data.avatarUrl,
              nickName: res.data.data.nickName
            })
          }
        },
        fail: function (res) {
          app.serverFailedToast();
        }
      });
    } else {
      this.setData({
        avatarUrl: wx.getStorageSync('avatarUrl'),
        nickName: wx.getStorageSync('nickName'),
        showNav: false
      })
    }
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
      that.setData({
        refresh:true
      })
    } else {
      //若出现网络状未能等到接口的makeComplete状态可能会出现
      //用户从首页跳转预览页时会出现正在制作中的图片提示
      that.setData({
        refresh:false
      })
    }
    that.requestData(from);
  },
  requestData: function (from = 0) {
    let that = this
    var title = "";
    if(from == 0){
      title = "相载相册中";
    }else{
      title = "努力制作相册中";
    }
    wx.showToast({
      title: title,
      icon: 'loading',
      duration: 10000
    })
    let userAlbumId = that.userAlbumId;
    var openId = ""
    if (this.data.fromShare) {
      openId = this.data.fromShareUserOpenId
    } else {
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
          // wx.hideToast();
          var itemPros = [];
          for(var i = 0; i < res.data.loopPreImgs.length; i++){
            var itemPro = {};
            itemPro.cssName = "hiddenNow";
            itemPros.push(itemPro);
          }
          that.setData({
            itemProperties: itemPros
          });
          that.setData({
            refresh: false,
            loopPreImgs: res.data.loopPreImgs,
            bgMusic: res.data.music
          })
          if (that.data.bgMusic != undefined && that.data.bgMusic != '') {
            that.audioCtx = wx.createAudioContext('music');
            that.setData({
              hiddenMusicBtn: false
            })
          }
        } else {
          that.setData({
            refreshtip: '点击页面刷新'
          })
        }
      }
    });
  },
  showIndex:function(){
    var url = '../my/my?from=share&fromShareUserOpenId=' + app.globalData.openId;
    wx.redirectTo({
      'url': url
    })
  },
  showAlbum: function (e) {
    let that = this;
    this.setData({
      clickCount: that.data.clickCount + 1
    })
    setTimeout(function () {
      if (that.data.clickCount >= 2) {
        that.showPreviewImage(e.currentTarget.dataset.index);
      } else {
        that.setData({
          clickCount: 0
        })
      }
    }, 500);
  },
  showPreviewImage: function (curImgIndex) {
    let that = this;
    wx.previewImage({
      current: that.data.loopPreImgs[curImgIndex],
      urls: that.data.loopPreImgs
    });
    that.setData({
      clickCount: 0
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
    let that = this;
    if (app.globalData.finishCreateFlag) {
      wx.navigateBack({
        delta: getCurrentPages().length
      })
    }
  },
  onShareAppMessage: function () {
    var queryStr = "";
    if (this.data.fromShare) {
      queryStr = "shared=1&appId=" + app.globalData.appId + "&fromShareUserOpenId=" + this.data.fromShareUserOpenId + "&userAlbumId=" + this.data.shareUserAlbumId;
    } else {
      queryStr = "shared=1&appId=" + app.globalData.appId + "&fromShareUserOpenId=" + app.globalData.openId + "&userAlbumId=" + this.data.shareUserAlbumId;
    }

    var title = "";
    let desc = "";
    if(this.data.fromShare){
      title = "分享"+ this.data.nickName +"的相册";
    }else{
      title="分享我的相册";
    }
    desc = "这里记录了" + this.data.nickName + "的精彩照片和故事，快来看看吧！";
    return {
      title: title,
      desc: desc,
      path: '/pages/viewswiper/viewswiper?' + queryStr
    }
  },
  loadPic: function () {
    let curLoads =  this.data.loadTotal + 1;
    if(curLoads < this.data.loopPreImgs.length){
      this.setData({
        loadTotal: curLoads
      });
      return
    }
    this.setData({
      isLoadPic:true
    })
    wx.hideToast();
    if(typeof this.audioCtx !=="undefined"){
      this.audioCtx.play();
    }
    this.doCssAnimation();
  },
  doCssAnimation: function(){
    let that = this;
    for (var i = 0; i <= that.data.itemProperties.length; i++) {
      let curIndex = i;
      let timeoutMis = i * that.data.cssAnimationTimeMilles;
      if( i == that.data.itemProperties.length){
        setTimeout(function(){
          that.setData({
            reloadHidden: false,
            stopMusic: true,
            showShare:true
          });
          if(typeof that.audioCtx !=="undefined"){
            that.audioCtx.pause();
          }
        }, timeoutMis);
      }else if(i + 1 == that.data.itemProperties.length){
        setTimeout(function(){
          that.data.itemProperties[curIndex].cssName="css-half-animation css-half-show";
          that.setData({
            itemProperties: that.data.itemProperties
          });
        }, timeoutMis);        
      }else{
        setTimeout(function(){
          that.data.itemProperties[curIndex].cssName = "css-animation";
          that.setData({
            itemProperties: that.data.itemProperties
          })
        }, timeoutMis);
      }
    }
  },
  reloadPlay: function () {
    let that = this;
    this.setData({
      reloadHidden: true,
      replayHidden: true,
      stopMusic: false,
      showShare:false,
      isLoadPic:false
    })
    for (var i = 0; i < that.data.itemProperties.length; i++) {
      that.data.itemProperties[i].cssName = "hiddenNow";
    }
    that.setData({
      itemProperties: that.data.itemProperties
    });
    setTimeout(function () {
      that.setData({
        replayHidden: false
      });
      that.doCssAnimation();
    }, 500);
  },

  reloadSwiperPlay: function () {
    let that = this;
    this.setData({
      autoplay: true,
      showLayer: false,
      interval: 500
    })
  },
  swiperChange: function (event) {
    var that = this;
    if (event.detail.current + 1 == this.data.loopPreImgs.length) {
      setTimeout(function () {
        that.setData({
          autoplay: false,
          showLayer: true
        });
      }, 2500);
    } else {
      this.setData({
        interval: 3000
      });
    }
  },
  audioPause: function () {
    if (this.data.stopMusic) {
      this.setData({
        stopMusic: false
      })
      this.audioCtx.play();
    } else {
      this.setData({
        stopMusic: true
      })
      this.audioCtx.pause();
    }
  },
   showSharePic:function(){
    let that=this;
    that.setData({
      shareHidden:false
    })
    setTimeout(function(){
      that.setData({
        shareHidden:true
      })
    },2000)
  }
})