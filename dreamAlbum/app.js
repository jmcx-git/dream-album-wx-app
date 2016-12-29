//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
  wx.checkSession({
    success:function(){
      console.log("登录状态未过期!");
    },
    fail:function(){
      console.log("登录状态已过期！");
    }
  })
   let that = this
   wx.getSystemInfo({
     success: function(res){
       that.globalData.windowWidth = res.windowWidth;
       that.globalData.windowHeight = res.windowHeight;
     }
   })
  },
  globalData:{
    windowWidth: 375,
    windowHeight: 625,
    serverHost: "https://developer.mokous.com/wx/",
    finishCreateFlag:false,
    appId: "wx0ddc8673b8df3827"
  }
})