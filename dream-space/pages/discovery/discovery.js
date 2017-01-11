var app = getApp();
let pageData = {
    data:{
        activitylist: [],
        start: 0,
        size: 10
    },
    onLoad:function(option){
        let activitylist = [
            {id:0,title:"标题1",description:"活动1描述"},
            {id:0,title:"标题2",description:"活动2描述"},
            {id:0,title:"标题3",description:"活动3描述"},
            {id:0,title:"标题4",description:"活动4描述"}]
        wx.request({
          url:app.globalData.serverHost + "discovery/list.json",
          data:{
            openId: app.globalData.openId,
            start: this.data.start,
            size: this.data.size
          },
          method: "GET",
          success: function(res){
            console.log(e)
          },
          fail: function(res){

          }
        })
        this.setData({
            activitylist:activitylist
        })
    },
    showdetail: function(e){
        wx.navigateTo({
          url: '../activitydetail/activitydetail'
        })
    }
}
Page(pageData)
