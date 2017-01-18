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
      wx.showToast({
        title:'内容不能为空',
        icon:'warning',
        duration:1000,
        mask:true
      })
      return;
    }
    wx.showToast({
      title:'保存中',
      icon:'loading',
      duration:10000,
      mask:true
    })
    let that=this;
    setTimeout(function(){
       wx.request({
        url: app.globalData.serverHost+'feed/add.json',
        data: {
          'openId':app.globalData.openId,
          'spaceId':that.data.spaceId,
          'version':that.data.version,
          'type':1,
          'content':e.detail.value.content
        },
        method: 'get',
        success: function(res){
          wx.hideToast();
          app.globalData.createFinishFlag=true;
          wx.navigateBack({
            delta: 1
          })
        },
        fail: function(ron) {
          console.log("添加文字失败 ！");
          console.log(ron);
          app.errorToast('添加文字失败');
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