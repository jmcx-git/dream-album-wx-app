// pages/joinin/joinin.js
var app = getApp();
Page({
  data:{
    start:0,
    size: 10,
    entries:[],
    scrollHeight: 600,
    activityId:0,
    noMoreList: false,
    worksId: -1,
    buttonstop: 560,
    voteWorksId:-1,
    userWorksId:-1
  },
  convert2px: function(rpx){
    return rpx / this.convertrate
  },
  onLoad:function(options){
    console.log(options)
    let that = this;
    wx.getSystemInfo({
     success: function(res){
       that.convertrate = 750/res.windowWidth;
       that.setData({
         scrollHeight: res.windowHeight,
         activityId: options.id,
         buttonstop: res.windowHeight - that.convert2px(98),
         voteWorksId:options.voteWorksId,
         userWorksId:options.userWorksId
       })
      }
    })
    console.log(this.data.activityId)
    this.loadMore()
  },
  loadMore: function(){
    if(this.data.noMoreList){
      return
    }
    let that = this
    wx.request({
      url:app.globalData.serverHost+"/user/feed/list.json",
      data:{
        openId:app.globalData.openId,// "oRi3q0Hd4wlyCuZKYUcNZEuvD6p4",//
        start: that.data.start,
        size: that.data.size
      },
      success: function(res){
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
  joinin: function(e){
    if(this.data.worksId == -1){
      wx.showToast({
        title:"请选择相册",
        icon: 'loading',
        duration: 20000
      })
      return
    }
    let that = this
    wx.showModal({
      title:"提示",
      content:" 确定参加活动",
      success:function(res){
        if(res.confirm){
          wx.request({
            url: app.globalData.serverHost +"discovery/activity/apply.json",
            data:{
              openId: app.globalData.openId,
              id: that.data.activityId,
              feedId: that.data.worksId
            },
            success:function(res) {
              if(res.statusCode == 200){
                if(res.data.status == 0 || (res.data.status == -1 && res.data.message == "您已参与")){
                  wx.redirectTo({
                    url: '../vote/vote?activityId='+that.data.activityId+"&voteWorksId="+that.data.voteWorksId+"&userWorksId="+that.data.userWorksId
                  })
                  return
                }
              }
              let msg = "网络错误,请稍后再试!"
              that.handleFail(msg)
            },
            fail: function(res){
              let msg = "网络错误,请稍后再试!"
              that.handleFail(msg)
            }
          })
        }

      }
    })
  },
  onPullDownRefresh: function () {
    this.refreshData()
    wx.stopPullDownRefresh();
  },
  onReachBottom: function (){
    this.loadMore()
  },
  refreshData: function(){
    this.setData({
      start:0,
      entries:[],
      noMoreList: false,
      worksId: -1
    })
    this.loadMore();
  },
  handleFail: function(msg){
    wx.showToast({
      title: msg,
      icon: 'loading',
      duration: 2000
    })
  },
  radioChange: function (e) {
    if(this.data.worksId != e.currentTarget.dataset.id){
      this.setData({
        worksId :e.currentTarget.dataset.id
      })
    }else{
      this.setData({
        worksId : -1
      })
    }
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
