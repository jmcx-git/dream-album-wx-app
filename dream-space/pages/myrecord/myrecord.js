// pages/myrecord/myrecord.js
Page({
  data:{
    recordsList:[{
    month:1,
    recordCount:10,
    backgroundUrl:'http://static.yingyonghui.com/article/1483498371939_a.jpg'
  },{
    month:2,
    recordCount:6,
    backgroundUrl:'http://static.yingyonghui.com/article/1483498371939_a.jpg'
  },{
    month:3,
    recordCount:5,
    backgroundUrl:'http://static.yingyonghui.com/article/1483498371939_a.jpg'
  }],
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  showRecordList:function(){
    wx.navigateTo({
      url: '../myRecordList/myRecordList'
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