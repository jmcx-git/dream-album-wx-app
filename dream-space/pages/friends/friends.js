var app=getApp();
Page({
  data:{
    occupantList:[],
    secert:'',
    spaceId:0,
    version:0
  },
  onLoad:function(options){
    let that=this;
    that.setData({
      secert:options.secert,
      spaceId:options.spaceId,
      version:options.version
    })
    wx.request({
      url: app.globalData.serverHost+'occupant/list.json',
      data: {
        openId:options.openId,
        spaceId:options.spaceId,
        version:options.version
      },
      method: 'GET',
      success: function(res){
        console.log(res);
        var nickname=((res.data.data.resultList)[0]).nickname;
        console.log(nickname.length);
        that.setData({
          occupantList:res.data.data.resultList
        })

      },
      fail: function(ron) {
        console.log("获取亲友团列表失败！");
        console.log(ron);
      }
    })
  },
  resetYqm:function(){
    let that=this;
    wx.request({
      url: app.globalData.serverHost+'secert/reset.json',
      data: {
          openId:wx.getStorageSync('openId'),
          spaceId:that.data.spaceId,
          version:that.data.version
      },
      method: 'GET',
      success: function(res){
        that.setData({
          secert:res.data.data
        })
      },
      fail: function(ron) {
        console.log("重置邀请码失败!");
        console.log(ron);
      }
    })
  },
  showDetail:function(e){
    let that=this;
    wx.navigateTo({
      url: '../psersonalPage/psersonalPage?spaceId='+that.data.spaceId+"&openId="+e.currentTarget.dataset.openid
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