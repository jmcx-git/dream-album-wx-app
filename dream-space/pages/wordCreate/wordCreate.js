var app=getApp();
Page({
  data:{
    spaceId:0,
    version:0,
    content:''
  },
  onLoad:function(options){
    let that=this;
    this.setData({
      spaceId:options.spaceId,
      version:options.version,
      content:''
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  saveContent:function(e){
    this.setData({
      content:e.detail.value
    })
  },
  sendMessage:function(e){
    let that=this;
    setTimeout(function(){
        console.log("文章内容:"+that.data.content);
        wx.request({
          url: 'https://developer.mokous.com/space/feed/add.json',
          data: {
            'openId':wx.getStorageSync("openId")+'',
            'spaceId':that.data.spaceId,
            'version':that.data.version,
            'type':1,
            'content':that.data.content
          },
          method: 'get',
          success: function(res){
            console.log("在这呢");
            console.log(res);
            wx.navigateBack({
              delta: 1
            })
          },
          fail: function(ron) {
            console.log("添加文字失败失败 ！");
            console.log(ron);
          }
        })
    },500)
    
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    console.log("页面卸载");
    app.globalData.createFinishFlag=true;
  }
})