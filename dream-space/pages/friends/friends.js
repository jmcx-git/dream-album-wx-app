var app=getApp();
Page({
  data:{
    occupantList:[],
    secert:'',
    spaceId:0,
    version:0,
    name:''
  },
  onLoad:function(options){
    var owner=options.owner;
    if(owner!=undefined && owner!=null && owner!=''){
      app.globalData.fromOpenId=options.fromOpenId;
      app.globalData.spaceId=options.spaceId;
      app.globalData.redirectRefer=1;
      app.globalData.owner=options.owner;
       wx.switchTab({
         url: '../index/index'
       })
    }else{
      let that=this;
      that.setData({
        secert:options.secert,
        spaceId:options.spaceId,
        version:options.version,
        name:options.name
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
          app.failedToast();
        }
      })
    }
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
        app.errorToast("重置邀请码失败!");
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
  },
  onShareAppMessage:function(){
      let that=this;
      var fromOpenId=wx.getStorageSync('openId');
      var spaceId=that.data.spaceId;
      var owner=(that.data.secert==null || that.data.secert=='' || that.data.secert==undefined)?0:1;
      var queryStr="/pages/friends/friends?fromOpenId="+fromOpenId+"&spaceId="+spaceId+"&owner="+owner;
      var ownerTitle=wx.getStorageSync('nickName')+"邀请您入住他(她)的私密空间"+that.data.name;
      var guestTitle=wx.getStorageSync('nickName')+"邀请您使用"+app.globalData.productName;
      var ownerContent='这是属于我们的秘密';
      var guestContent="用它，您可以记录，分享您的珍贵时刻。"
      return {
        title:owner==0?guestTitle:ownerTitle,
        desc:owner==0?guestContent:ownerContent,
        path:queryStr
      }
    }
})