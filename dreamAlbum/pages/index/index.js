Page({
  data:{
     inputShowed:false,
     inputVal:"",
     kjsearchList:['圣诞快乐','旧时光','周岁','双12'],
    items:[],
    winHeight:0,
    winWidth:0,
    searchKeyWords:'',
    start:0,
    size:10,
    placeholderWords:'请输入搜索关键词...',
    hostConfig:'https://api.mokous.com/wx/'
  },
  showInput:function(){
    this.setData({
      inputShowed:true
    });
  },
  hideInput:function(){    
    this.setData({
      inputVal:"",
      inputShowed:false
    })
  },
  clearInput:function(){
    this.setData({
      inputVal:""
    })
  },
  inputTyping:function(e){
    this.setData({
      inputVal:e.detail.value
    })
  },
  requestFailed: function(res){
    wx.showModal({
      title:"提示",
      content: "网络错误，请稍后再试！"
    }),
    wx.hideToast()
  },
  collectApi:function(e){
    let that=this;
    let index=e.currentTarget.dataset.index;
    let userId=wx.getStorageSync('userId');
    let currentStatus=e.currentTarget.dataset.collect;
    let status=currentStatus==0?'1':0;
    let message=currentStatus==0?'收藏成功':'取消收藏';
    that.data.items[index].collect=status;
    this.setData({
      items:that.data.items
    })
    wx.request({
      url: that.data.hostConfig+'dream/user/login/updatecollectstatus.json',
      data: {
          userId:userId,
          albumId:e.currentTarget.dataset.albumid,
          status:status
      },
      method: 'GET',
      success: function(res){
        wx.showToast({
          title:message,
          icon:'success',
          duration:1000
        })
      },
      fail: function(res){
        that.requestFailed(res)
      },
    })
  },
  previewImage:function(e){
    console.log(e.currentTarget.dataset.albumid);
    //进入创作页面
    wx.navigateTo({
       url: '../create/create?albumId=' + e.currentTarget.dataset.albumid
     })
  },
  onLoad:function(options){
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
          title:'授权提示',
          content:'将访问你的基本信息',
          showCancel:true,
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
                              that.search('',ss[0]);
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
      that.search('',wx.getStorageSync('userId'));
    }
  },
  onPullDownRefresh:function(){
    this.refreshData();
    wx.stopPullDownRefresh();
  },
  refreshData:function(){
    let that=this;
    this.setData({
      start:0,
      size:that.data.size,
      items:[]
    })
    this.search(that.data.searchKeyWords,wx.getStorageSync('userId'));
  },
  moreData:function(){
    let that=this;
    that.search(that.data.searchKeyWords,wx.getStorageSync('userId'));
  },
  searchKeyWordsFast:function(e){
    let that=this;
    that.setData({
      searchKeyWords:e.currentTarget.dataset.keyword,
      start:0,
      size:that.data.size,
      items:[]
    })
    this.search(e.currentTarget.dataset.keyword,wx.getStorageSync('userId'));
  },
  search(queryWords,userId){
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 5000
    });
    let that=this;
    wx.request({
      url: that.data.hostConfig+'dream/album/common/homepage.json',
      data: {
        keyword:queryWords,
        userId:userId,
        size:that.data.size,
        start:that.data.start
      },
      method: 'GET',
      success: function(res){
        that.setData({
          items:that.data.items.concat(res.data.albumList),
          start:that.data.start+res.data.albumList.length,
          inputVal: queryWords,
          inputShowed: queryWords.length != 0
        });
        console.log("Finish load album list.");
        wx.hideToast();
      },
      fail: function(res){
        that.requestFailed(res)
      }
    })
  },
  getKeywords:function(e){
    let that=this;
    that.setData({
      searchKeyWords:e.detail.value,
      start:0,
      size:that.data.size,
      items:[]
    })
    this.search(e.detail.value,wx.getStorageSync('userId'));
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