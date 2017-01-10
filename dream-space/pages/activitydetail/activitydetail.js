let pageData = {
    data:{
        title: "标题",
        content: "活动规则及奖品"
    },
    onLoad:function(option){
        let activityDetail = {id:0,title:"标题1",content:"活动1描述"}
        this.setData({
            title: activityDetail.title,
            content: activityDetail.content
        })
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