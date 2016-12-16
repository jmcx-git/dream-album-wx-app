Page({
  data: {
    winHeight:0,
    winWidth:0,
    items:[],
    hostConfig:'https://api.mokous.com/wx/',
    testConfig:'https://developer.mokous.com/wx/',
    avatarUrl:'',
    nopichidden:'none',
    authorizeTitle:"请确认授权以下信息",
    authorizeContent:". 获得你的公开信息(昵称、头像等)"
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
    if(!wx.getStorageSync('userId')){
        wx.showModal({
          title:that.data.authorizeTitle,
          content:that.data.authorizeContent,
          showCancel:false,
          success:function(res){
            if(res.confirm){
              //用户点击确定
              wx.login({
                success: function(res){
                  //获取code
                  wx.request({
                    url: that.data.hostConfig+'dream/user/login/getSession.json',
                    data: {
                      code:res.code
                    },
                    method: 'GET',
                    success: function(ress){
                       //缓存第三方key
                      wx.setStorageSync('threeSessionKey',ress.data);
                       wx.getUserInfo({
                        success: function(resinfo){
                          wx.request({
                            url: that.data.hostConfig+'dream/user/login/getUserInfo.json',
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
                    }
                  })
                },
                fail: function() {
                  console.log("登录出错了！");
                }
              })
            }else{
              //用户点击取消
              wx.request({
                url: that.data.hostConfig+'dream/user/login/addUser.json',
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
    let that=this;
    this.getData(that.data.currentTab);
    wx.stopPullDownRefresh();
  },
  viewTemplateList:function(e){
    wx.navigateTo({
      url: '../index/index'
    })
  },
  refreshData:function(){
    this.getData();
  },
  previewImage:function(e){
      wx.navigateTo({
        url: '../viewswiper/viewswiper?userAlbumId='+e.currentTarget.dataset.useralbumid+'&albumId='+e.currentTarget.dataset.albumid
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
      duration:50000
    })
    var userId=wx.getStorageSync('userId');
    var url=that.data.testConfig+'dream/album/common/myalbum.json';
    wx.request({
      url: url,
      data: {
          userId:userId
      },
      method: 'GET',
      success: function(res){
          //渲染我的数据
        if(res.data.length==0){
          that.setData({
            nopichidden:'block'
          })
          return;
        }
        that.setData({
          items:res.data,
          nopichidden:'none'
        })
        wx.hideToast();
      },
      fail: function() {
        console.log("获取数据失败！");
      }
    })
  }
})
