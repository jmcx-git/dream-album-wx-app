var app=getApp();
Page({
  data:{
    personalInfo:{}
  },
  onLoad:function(options){
    let that=this;
    wx.request({
      url: app.globalData.serverHost+'user/interaction/info.json',
      data: {
        openId:options.openId,
        spaceId:options.spaceId,
        version:options.version
      },
      method: 'GET',
      success: function(res){
        that.setData({
            personalInfo:res.data.data
        })
        wx.setNavigationBarTitle({
          title: res.data.data.nickname
        })
      },
      fail: function(ron) {
        console.log("获取个人信息失败!");
        console.log(ron);
        app.failedToast();
      }
    })
  },
  showPreview:function(e){
    var urls=[];
    urls.push(e.currentTarget.dataset.src);
    wx.previewImage({
      urls:urls
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
  exitFriends:function(e){
    wx.navigateBack({
      delta: getCurrentPages().length // 回退前 delta(默认为1) 页面
    })
  },
  onUnload:function(){
    // 页面关闭
  }
})