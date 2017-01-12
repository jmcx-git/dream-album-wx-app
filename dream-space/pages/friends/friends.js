// pages/friends/friends.js
Page({
  data:{
    nickName:'1234',
    spaceId:0,
    occupantList:[
      {
        nickname:'189',
        avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
        info:'9分钟前来过n次'
      },
     {
        nickname:'189',
        avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
        info:'9分钟前来过n次'
      },{
        nickname:'189',
        avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
        info:'9分钟前来过n次'
      },{
        nickname:'189',
        avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
        info:'9分钟前来过n次'
      },{
        nickname:'189',
        avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
        info:'9分钟前来过n次'
      },{
        nickname:'189',
        avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
        info:'9分钟前来过n次'
      }
    ],
  },
  onLoad:function(options){
    let that=this;
    this.setData({
      spaceId:options.spaceId
    })
    // wx.request({
    //   url: 'https://developer.mokolus.com/space/occupant/list.json',
    //   data: {
    //     openId:options.openId,
    //     spaceId:options.spaceId,
    //     version:options.version
    //   },
    //   method: 'GET',
    //   success: function(res){
    //     that.setData({
    //       occupantList:res.data.data
    //     })

    //   },
    //   fail: function(ron) {
    //     console.log("获取亲友团列表失败！");
    //     console.log(ron);
    //   }
    // })
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