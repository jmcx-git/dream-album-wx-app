var app = getApp()
Page({
  data: {
    userInfo: {},
    barTitle:[{'name':'收藏',currentTab:0},
              {'name':'我的',currentTab:1}],
    items:[
       {id:1,title:'模版1',cover:'http://img.huiyoobao.com/funny/columnback/1474432200020_orign.jpg'},
       {id:2,title:'模版2',cover:'http://img.huiyoobao.com/funny/columnback/1473825600311_orign.jpg'},
       {id:3,title:'模版3',cover:'http://img.huiyoobao.com/funny/columnback/1473825601094_orign.jpg'},
       {id:4,title:'模版4',cover:'http://img.huiyoobao.com/funny/columnback/1473825076410_orign.jpg'},
       {id:5,title:'模版5',cover:'http://img.huiyoobao.com/funny/columnback/1473825075998_orign.jpg'}],
    winHeight:0,
    winWidth:0,
    currentTab:0,
    collectCount:10,
    myCount:3
  },
  swichNav:function(e){
    this.setData({
      currentTab:e.currentTarget.dataset.id
    })
    this.getData(e.currentTarget.dataset.id);
  },
  onLoad: function () {
    console.log('onLoad')
    let that=this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winHeight:res.windowHeight,
          winWidth:res.windowWidth
        })
      }
    })
    this.getData(that.data.currentTab);
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  previewImage:function(e){
    console.log(e.currentTarget.dataset.albumid);
    //进入创作页面
    // wx.navigateTo({
    //   url: '?albumId='+e.currentTarget.dataset.albumid
    // })
  },
  getData(type){
    let that=this;
    var userId=wx.getStorageSync('userId');
    console.log("本地中的用户id："+userId);
    // wx.request({
    //   url: 'https://URL',
    //   data: {
    //       userId:userId,
    //       type:type
    //   },
    //   method: 'GET',
    //   success: function(res){
    //     that.setData({
    //       items:res.data.albumList
    //     })
    //   },
    //   fail: function() {
    //     console.log("获取数据失败！");
    //   }
    // })
  }
})
