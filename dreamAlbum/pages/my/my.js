var app = getApp()
Page({
  data: {
    barTitle:[{'name':'收藏',currentTab:0},
              {'name':'我的',currentTab:1}],
    winHeight:0,
    winWidth:0,
    currentTab:0,
    collectCount:0,
    myCount:0,
    items:[],
    hostConfig:'https://api.mokous.com/wx/',
    avatarUrl:''
  },
  swichNav:function(e){
    this.setData({
      currentTab:e.currentTarget.dataset.id
    })
    this.setData({
      items:[]
    })
    this.getData(e.currentTarget.dataset.id);
  },
  onLoad: function () {
    let that=this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winHeight:res.windowHeight,
          winWidth:res.windowWidth
        })
      }
    })
    this.setData({
      avatarUrl:wx.getStorageSync('avatarUrl')
    })
    this.getData(that.data.currentTab);
  },
  onPullDownRefresh:function(){
    let that=this;
    this.getData(that.data.currentTab);
    wx.stopPullDownRefresh();
  },
  previewImage:function(e){
    console.log(e.currentTarget.dataset.albumid);
    //进入创作页面
    wx.navigateTo({
       url: '../create/create?albumId=' + e.currentTarget.dataset.albumid
    })
  },
  refreshData:function(){
    let that=this;
    this.getData(that.data.currentTab);
  },
  getData(type){
    wx.showToast({
      title:'加载中...',
      icon:'loading',
      duration:50000
    })
    let that=this;
    var userId=wx.getStorageSync('userId');
    let url=that.data.hostConfig+'dream/user/login/getUserCollectAlbum.json';
    if(type>0){
      url=that.data.hostConfig+'dream/album/common/myalbum.json';
    }
    wx.request({
      url: url,
      data: {
          userId:userId
      },
      method: 'GET',
      success: function(res){
        if(type==0){
          that.setData({
            items:res.data.collectList,
            collectCount:res.data.collectList.length,
            myCount:res.data.count
          })
        }else{
          //渲染我的数据
          that.setData({
            items:res.data,
            myCount:res.data.length
          })
        }
        wx.hideToast();
      },
      fail: function() {
        console.log("获取数据失败！");
      }
    })
  }
})
