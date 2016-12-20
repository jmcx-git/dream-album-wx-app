var app=getApp();
Page({
  data: {
    winHeight:0,
    winWidth:0,
    items:[],
    avatarUrl:'',
    nopichidden:'none',
    viewtap:false,
    authorizeTitle:"请确认授权以下信息",
    authorizeContent:". 获得你的公开信息(昵称、头像等)",
    picLoadFinish:false,
    picLoadCount:0
  },
  onLoad: function () {
    let that=this;
    that.setData({
      winWidth:app.globalData.windowWidth,
      winHeight:app.globalData.windowHeight
    })
    if(!wx.getStorageSync('userId')){
        wx.showModal({
          title:that.data.authorizeTitle,
          content:that.data.authorizeContent,
          showCancel:false,
          success:function(res){
            if(res.confirm){
              //用户点击确定
              wx.login({
                success: function(resl){
                  //获取code
                  wx.request({
                    url: app.globalData.serverHost+'dream/user/login/getSession.json',
                    data: {
                      code:resl.code
                    },
                    method: 'GET',
                    success: function(ress){
                       //缓存第三方key
                      wx.setStorageSync('threeSessionKey',ress.data);
                       wx.getUserInfo({
                        success: function(resinfo){
                          wx.request({
                            url: app.globalData.serverHost+'dream/user/login/getUserInfo.json',
                            data: {
                              threeSessionKey:ress.data,
                              encryptedData:resinfo.encryptedData,
                              iv:resinfo.iv
                            },
                            method: 'GET',
                            success: function(resuser){
                              var ss=(''+resuser.data).split("#");
                              //缓存用户id
                              wx.setStorageSync('userId', ss[0]);
                              wx.setStorageSync('avatarUrl', ss[1]);
                              that.getData();
                            }
                          })
                        },
                        fail: function() {
                          console.log("获取用户信息出错！");
                        }
                      })
                    },
                    fail:function(trd){
                      console.log("缓存第三方key出错！");
                      console.log(trd);
                    }
                  })
                },
                fail: function(ee) {
                  console.log("登录出错了！");
                  console.log(ee);
                }
              })
            }else{
              //用户点击取消
              wx.request({
                url: app.globalData.serverHost+'dream/user/login/addUser.json',
                data: {},
                method: 'GET',
                success: function(res){
                  wx.setStorageSync('userId',res.data);
                  that.search('',res.data);
                },
                fail: function(e) {
                  console.log("新增用户失败！");
                  console.log(e);
                }
              })
            }
          }
        })
    }else{
      that.getData();
    }
  },
  onPullDownRefresh:function(){
    this.refreshData();
    wx.stopPullDownRefresh();
  },
  viewTemplateList:function(e){
    wx.navigateTo({
      url: '../index/index'
    })
  },
  refreshData:function(){
    this.setData({
      items:[],
      nopichidden:'none',
      viewtap:false,
      picLoadFinish:false,
      picLoadCount:0
    })
    this.getData();
  },
  previewImage:function(e){
    let that=this;
    if(!that.data.viewtap){
      return;
    }
      wx.navigateTo({
        url: '../viewswiper/viewswiper?userAlbumId='+e.currentTarget.dataset.useralbumid
      })
  },
  getData(){
    let that=this;
    this.setData({
      avatarUrl:wx.getStorageSync('avatarUrl')
    })
    wx.showToast({
      title:'加载中...',
      icon:'loading',
      duration:10000
    })
    that.consoleImage();
    var userId=wx.getStorageSync('userId');
    var url=app.globalData.serverHost+'dream/album/common/myalbum.json';
    wx.request({
      url: url,
      data: {
          userId:userId
      },
      method: 'GET',
      success: function(res){
          //渲染我的数据
        if(res.statusCode==200){
          if(res.data.length==0){
            that.setData({
              nopichidden:'block'
            })
            wx.hideToast();
          }else{
            that.setData({
              items:res.data,
              nopichidden:'none',
              viewtap:true
            })
          }
          // wx.hideToast();
        }
      },
      fail: function() {
        console.log("获取数据失败！");
      }
    })
  },
  picLoad:function(e){
    let that=this;
    this.setData({
      picLoadCount:that.data.picLoadCount+1
    })
    if(this.data.picLoadCount==this.data.items.length){
      wx.hideToast();
      that.setData({
        picLoadFinish:true
      })
    }
  },
  consoleImage:function(){
    let that=this;
    setTimeout(function(){
        that.setData({
          picLoadFinish:true
        })
        wx.hideToast();
    },10000)
  },
  onShow:function(){
    if(app.globalData.finishCreateFlag){
      this.refreshData();
      app.globalData.finishCreateFlag=false;
    }
  }
})
