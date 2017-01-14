var app=getApp();
Page({
  data:{
    spaceId:0,
    version:0,
    placeholderText:'为今天的记录说点什么呢？'
  },
  onLoad:function(options){
    let that=this;
    this.setData({
      spaceId:options.spaceId,
      version:options.version,
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  sendMessage:function(e){
    if(e.detail.value.content==''){
      return;
    }
    let that=this;
    wx.hideKeyboard();
    setTimeout(function(){
       wx.request({
        url: app.globalData.serverHost+'feed/add.json',
        data: {
          'openId':wx.getStorageSync("openId"),
          'spaceId':that.data.spaceId,
          'version':that.data.version,
          'type':1,
          'content':e.detail.value.content
        },
        method: 'get',
        success: function(res){
        app.globalData.createFinishFlag=true;
          wx.navigateBack({
            delta: 1
          })
        },
        fail: function(ron) {
          console.log("添加文字失败 ！");
          console.log(ron);
        }
      })
    },500);
   
    
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    console.log("页面卸载");
    // app.globalData.createFinishFlag=true;
  }
})