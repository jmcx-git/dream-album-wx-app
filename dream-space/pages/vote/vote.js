let app = getApp();
Page({
  data:{
    bottom_top: 500,
    entries:[],
    start: 0,
    size: 10,
    noMoreList: false,
    activityId: 0,
    findKey: "",
    inputShowed: false,
    inputVal: "",
    scrollHeight: 500,
    showSearchbar: true,
    selectedWorksId: -1
  },
  showInput: function () {
      this.setData({
          inputShowed: true
      });
  },
  hideInput: function () {
      this.setData({
          inputVal: "",
          inputShowed: false
      });
  },
  clearInput: function () {
      this.setData({
          inputVal: ""
      });
  },
  inputTyping: function (e) {
      this.setData({
          findKey: e.detail.value
      });
      this.data.entries = []
      this.data.noMoreList = false;
      this.data.start = 0;
      this.loadMore()
  },
  convert2px: function(rpx){
    return rpx / this.convertrate
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    wx.getSystemInfo({
     success: function(res){
       that.convertrate = 750/res.windowWidth;
       that.setData({
         bottom_top: res.windowHeight - that.convert2px(100),
         activityId: options.activityId,
         scrollHeight: res.windowHeight
       })
      }
    })

    this.loadMore()
  },
  loadMore: function(){
    console.log(this.data.findKey)
    if(this.data.noMoreList){
      return
    }
    let that = this;
    wx.request({
      url: app.globalData.serverHost +"discovery/activity/works/list.json",
      data:{
        openId: app.globalData.openId,
        id: that.data.activityId,
        findKey: that.data.findKey,
        start: that.data.start,
        size: that.data.size
      },
      success:function(res){
        console.log(res)
        if(res.statusCode == 200){
          if(res.data.status == 0){
            let list = that.data.entries.concat(res.data.data.resultList);
            that.setData({
              entries: list,
              start: that.data.start + res.data.data.resultList.length,
              noMoreList: res.data.data.resultList.length < that.data.size
            })
            return
          }
        }
        let msg = "服务器错误,请稍后再试!"
        that.handleFail(msg)
      },
      fail: function(res){
        let msg = "网络出错,请稍后再试!"
        that.handleFail(msg)
      }
    })
  },
  handleFail: function(msg){
    wx.showToast({
      title: msg,
      icon: 'loading',
      duration: 2000
    })
    this.voting = false;
  },
  handleScroll: function(e){
    let scrollTop = e.detail.scrollTop;
    let deltaY = e.detail.deltaY;
    let showSearchbar = true;
    if(deltaY > 0){
      showSearchbar = true;
    }else{
      if(scrollTop > 48){
        showSearchbar = false;
      }
    }
    this.setData({
      showSearchbar: showSearchbar
    })
    console.log(this.data.showSearchbar)
  },
  radioChange: function(e){
    console.log(e)
    this.data.selectedWorksId = e.detail.value
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
  voteforone:function(){
    let that = this;
    this.voting = true;
    wx.request({
      url:app.globalData.serverHost + "discovery/activity/vote.json",
      data:{
        openId: app.globalData.openId,
        id: that.data.activityId,
        worksId: that.data.selectedWorksId
      },
      success:function(res){
        console.log(res)
        let msg = "服务器错误,请稍后再试!"
        if(res.statusCode ==200){
          if(res.data.status ==0){
            wx.showModal({
              title:"提示",
              content:"投票成功",
              showCancel: false,
              success:function(res){
                wx.navigateBack({
                  delta: 2
                })
              }
            })
            return
          }
        }
        that.handleFail(msg)
      },
      fail: function(res){
        let msg = "网络出错,请稍后再试!"
        that.handleFail(msg)
      }
    })
  },
  voteone:function(e){
    let that = this;
    if(this.voting == true){
      return
    }
    if(that.data.selectedWorksId == -1){
      wx.showToast({
        title:"还未选择相册",
        duration:2000
      })
      return
    }
    wx.showModal({
      title:"提示",
      content:"确定为"+that.data.selectedWorksId+"号投票",
      success:function(res){
        if(res.confirm){
          that.voteforone()
        }
      }
    })
    console.log(e)

  }
})
