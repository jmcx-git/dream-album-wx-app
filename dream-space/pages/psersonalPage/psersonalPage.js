// pages/psersonalPage/psersonalPage.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
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
  modifyNickName:function(e){
    wx.navigateTo({
      url: '../modifyNickName/modifyNickName'
    })
  },
  onUnload:function(){
    // 页面关闭
  }
})