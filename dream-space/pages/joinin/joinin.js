// pages/joinin/joinin.js
let entry= {"id":30,"title":null,
"cover":"https://cdn.mokous.com/space/feed/2017-01-12/feed_oRi3q0Hd4wlyCuZKYUcNZEuvD6p4_1484222922963.jpg",
"type":0,
"content":"%E4%BD%A0%E6%9C%80hi%E5%93%88%E5%93%88",
"resourceUrl":null,"duration":0,
"avatarUrl":"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
"openId":"oRi3q0Hd4wlyCuZKYUcNZEuvD6p4",
"nickname":"昵称最长可以设置多少字呀",
"timeDesc":"4小时前",
"dateDesc":"01-12"}
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
  },
  onLoad:function(options){
    let that = this;
    wx.getSystemInfo({
     success: function(res){
       that.setData({
         scrollHeight: res.windowHeight,
         activityId: options.id
       })
      }
    })
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
              console.log(res)
              if(res.statusCode == 200){
                if(res.data.status == 0){
                  if(res.data.data){
                    wx.redirectTo({
                      url: '../vote/vote?activityId ='+that.data.activityId
                    })
                    return
                  }
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
  handleFail: function(msg){
    wx.showToast({
      title: msg,
      icon: 'loading',
      duration: 2000
    })
  },
  scrolltolower: function(e){
    this.loadMore()
  },
  radioChange: function (e) {
    console.log(e)
    this.data.worksId = e.detail.value;
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