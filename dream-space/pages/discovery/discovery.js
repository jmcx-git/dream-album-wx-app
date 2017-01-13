var app = getApp();
let pageData = {
    data:{
        activitylist: [],
        start: 0,
        size: 2,
        noMoreList: false,
        scrollHeight: 0
    },
    convert2px: function(rpx){
      return rpx / this.convertrate
    },
    onLoad:function(option){
      let that = this;

      // init data
      wx.getSystemInfo({
       success: function(res){
         that.convertrate = 750/res.windowWidth;
         that.setData({
           scrollHeight: res.windowHeight+that.convert2px(100)// android bug, 底部tabs不是第一页时,获取windowHeight 出错,直接添加100rpx的高度
         })
        }
      })
      console.log("discovery"+this.data.scrollHeight)
      this.loadMore()
    },
    showdetail: function(e){
      let that = this
      if(this.showdetailtouched != true){
          this.showdetailtouched = true
          wx.navigateTo({
            url: '../activitydetail/activitydetail?id='+e.currentTarget.dataset.id,
            complete: function(e){
              that.showdetailtouched = false
            }
          })
      }
    },
    icontap :function(e){

    },
    loadMore: function(e){
      if(this.data.noMoreList){
        return;
      }
      let that = this
      wx.request({
        url: app.globalData.serverHost + "discovery/list.json",
        data:{
          openId: app.globalData.openId,
          start: this.data.start,
          size: this.data.size
        },
        method: "GET",
        success: function(res){
          if(res.statusCode == 200){
            if(res.data.status ==0){
              let list = that.data.activitylist.concat(res.data.data.resultList);
              that.setData({
                activitylist: list,
                start: that.data.start + res.data.data.resultList.length,
                noMoreList: res.data.data.resultList.length < that.data.size
              })
              return
            }
          }

          let msg = "服务器返回出错"
          that.handleFail(msg)

        },
        fail: function(res){
          let msg = "网络出错,请稍后再试!"
          that.handleFail(msg)
        }
      })
    },
    scrolltolower: function(e){
      this.loadMore()
    },
    handleFail: function(msg){
      wx.showToast({
        title: msg,
        icon: 'loading',
        duration: 2000
      })
    }
}
Page(pageData)
