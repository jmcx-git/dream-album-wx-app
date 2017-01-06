//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    let that = this
    wx.getSystemInfo({
     success: function(res){
      that.globalData.windowWidth = res.windowWidth;
      that.globalData.windowHeight = res.windowHeight;
      }
    })
    let openId = wx.getStorageSync("openId");
    if(typeof openId !== 'undefined' && openId != ''){
      this.globalData.openId =  openId;
    }
    let nickName = wx.getStorageSync("nickName");
    if(typeof nickName !== 'undefined' && nickName != ''){
      this.globalData.nickName =  nickName;
    }
    let avatarUrl = wx.getStorageSync("avatarUrl");
    if(typeof avatarUrl !== 'undefined' && avatarUrl != ''){
      this.globalData.avatarUrl =  avatarUrl;
    }
  },
  globalData:{
    windowWidth: 375,
    windowHeight: 625,
    // serverHost: "https://developer.mokous.com/wx/",
    // serverHost: "http://10.1.0.131:8080/dream-album/",
    serverHost: "https://developer.mokous.com/wx/",
    // serverHost: "https://api.mokous.com/wx/",

    finishCreateFlag:false,
    albumPageCount: 4,
    appId: "wx0ddc8673b8df3827",
    nickName: "",
    avatarUrl: "",
    openId: ""
  },
  serverFailedToast(){
    wx.showToast({
      title: '远程应用服务器忙，请下拉刷新重试。',
      icon: 'success',
      duration: 2000
    });
  },
  weixinServerFailedToast(){
    wx.showToast({
      title: '微信服务忙，请下拉刷新重试。',
      icon: 'success',
      duration: 2000
    });
  },
  uploadFileFailedToast(){
    wx.showModal({
      title: "提示",
      content: '上传文件遇到网张异常，请稍后重试。',
      icon: 'success',
      showCancel: false
    });
  }
})
