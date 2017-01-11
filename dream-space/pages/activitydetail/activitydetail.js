var app = getApp();
let pageData = {
    data:{
        id:0,
        title:"",
        intr:"",
        content:"",
        prize: ""
    },
    onLoad:function(option){
      // option parms
      let activityId = option.id;

      let that = this;
      wx.getSystemInfo({
       success: function(res){
          that.setData({
            windowHeight: res.windowHeight
          })
        }
      })
      let activityDetail = {id:0,title:"标题1",intr:"活动的描述",content:"活动1内容", prize: "活动的奖品"}
      this.setData({
          id: activityDetail.id,
          title: activityDetail.title,
          intr: activityDetail.intr,
          content: activityDetail.content,
          prize: activityDetail.prize
      })
    },
    initData: function(activityId){
      let that = this;
      wx.request({
        url:app.globalData.serverHost + "discovery/activity/detail.json",
        data:{
          openId: app.globalData.openId,
          id: activityId
        },
        method: "GET",
        success: function(res) {

        },
        fail: function(res){
          let msg = "网络出错,请稍后再试!"
          that.handleFail(msg)
        }
      })
    },
    handleFail: function(msg){

    },
    joinin: function(e){
        wx.navigateTo({
          url: '../joinin/joinin'
        })
    },
    vote: function(e){
        wx.navigateTo({
          url: '../vote/vote'
        })
    }
}
Page(pageData)
