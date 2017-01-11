var app = getApp();
let pageData = {
    data:{
        activitylist: [],
        start: 0,
        size: 10,
        noMoreList: true,
        scrollHeight: 0
    },
    onLoad:function(option){
      let that = this;

      // init data
      wx.getSystemInfo({
       success: function(res){
         that.setData({
           scrollHeight: res.windowHeight
         })
        // that.globalData.windowWidth = res.windowWidth;
        // that.globalData.windowHeight = res.windowHeight;
        }
      })

      let activitylist = [
          {id:0,title:"邀请宝宝上电视1",intr:"",cover:"https://raw.githubusercontent.com/yanchunlei/res/master/ps/ps_0.png",endTimeMillis:1484435987076, participates: 10},
          {id:1,title:"邀请宝宝上电视2",intr:"活动2描述",cover:"https://raw.githubusercontent.com/yanchunlei/res/master/ps/ps_0.png",endTimeMillis:1484435987076, participates: 10},
          {id:2,title:"邀请宝宝上电视3",intr:"活动3描述",cover:"https://raw.githubusercontent.com/yanchunlei/res/master/ps/ps_0.png",endTimeMillis:1484435987076, participates: 10},
          {id:3,title:"邀请宝宝上电视4",intr:"活动4描述",cover:"https://raw.githubusercontent.com/yanchunlei/res/master/ps/ps_0.png",endTimeMillis:1484435987076, participates: 10}]
      this.resetDate(activitylist);
      this.setData({
          activitylist:activitylist
      })
      this.loadMore()
    },
    showdetail: function(e){
      console.log(e)
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
      console.log(e)
    },
    resetDate: function(list){
      for(let i=0;i<list.length; i++){
        let item = list[i];
        let d = new Date(item.endTimeMillis)
        item.year = d.getFullYear()
        item.month = d.getMonth() + 1
        item.day = d.getDate()

        item.hour = d.getHours()
        item.minute = d.getMinutes()
        item.second = d.getSeconds()
        item.endtime = item.day +" "+this.getEndtimeMonth(item.month)+" "+item.year

        item.deadline = Math.floor((item.endTimeMillis - Date.now())/24/60/60/1000)
      }
    },
    getEndtimeMonth: function(month){
      switch (month) {
        case 1:
          return "Jan."
          break;
        case 2:
          return "Feb."
          break;
        case 3:
          return "Mar."
          break;
        case 4:
          return "Apr."
          break;
        case 5:
          return "May."
          break;
        case 6:
          return "Jun."
          break;
        case 7:
          return "Jul."
          break;
        case 8:
          return "Aug."
          break;
        case 9:
          return "Sep."
          break;
        case 10:
          return "Oct."
          break;
        case 11:
          return "Nov."
          break;
        case 12:
          return "Dec."
          break;
        default:
          return "Mar."
      }
    },
    loadMore: function(e){
      if(this.data.noMoreList){
        return;
      }
      wx.request({
        url: app.globalData.serverHost + "discovery/list.json",
        data:{
          openId: app.globalData.openId,
          start: this.data.start,
          size: this.data.size
        },
        method: "GET",
        success: function(res){

          let list = that.data.activitylist.concat(res.data);
          that.setData({
            activitylist: list,
            start: that.data.start + res.data.length,
            noMoreList: res.data.length < this.data.size
          })
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

    }
}
Page(pageData)
