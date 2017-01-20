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
    selectedWorksId: -1,
    voteWorksId: -1,
    userWorksId: -1,
    vote: 0
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
      this.refreshData()
  },
  refreshData: function(e){
    this.data.entries = []
    this.data.noMoreList = false;
    this.data.start = 0;
    this.setData({
      selectedWorksId: -1
    })
    this.loadMore()
  },
  convert2px: function(rpx){
    return rpx / this.convertrate
  },
  onLoad:function(options){
    console.log("share: ", options)
    if(options.share == 'yes'){
      app.globalData.indexRefreshStatus=true;
    }
    // 判断分享
    if(options.share ==1){
      // let url = '../index/index?redirectRefer=2&fromOpenId='+option.fromOpenId+"&activityId="+option.activityId+"&voteWorksId="+option.voteWorksId

      app.globalData.fromOpenId = options.fromOpenId
      app.globalData.redirectRefer = 2
      app.globalData.activityId = options.activityId
      app.globalData.voteWorksId = options.voteWorksId
      wx.switchTab({
        url: "../index/index"
      })

      return
    }

    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    wx.getSystemInfo({
     success: function(res){
       that.convertrate = 750/res.windowWidth;
       that.setData({
         bottom_top: res.windowHeight - that.convert2px(100),
         activityId: options.activityId,
         scrollHeight: res.windowHeight,
         voteWorksId: options.voteWorksId,
         userWorksId: options.userWorksId,
         vote: options.vote
       })
      }
    })

    this.loadMore()
  },
  onPullDownRefresh: function () {
    this.refreshData()
    wx.stopPullDownRefresh();
  },
  onReachBottom: function (){
    this.loadMore()
  },
  getWorksId: function(worksId){
    return (worksId == undefined || worksId == 'undefined' || worksId == null || worksId == 'null' || worksId == "")? -1: worksId
  },
  loadMore: function(){
    console.log(this.data.findKey)
    console.log(this.data.voteWorksId)
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
        size: that.data.size,
        voteWorksId: that.getWorksId(that.data.voteWorksId)
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
  touchstart:function(e){
    this.lastY = e.touches[0].pageY
  },
  touchmove:function(e){
    if(this.lastY != undefined){
      let showSearchbar = true;
      let pageY = e.touches[0].pageY;
      if(pageY - this.lastY <0){
        showSearchbar = false
      }
      console.log("showSearchbar ", showSearchbar)
      this.setData({
        showSearchbar: showSearchbar
      })
    }


    console.log(e)
  },
  touchend:function(e){
    this.lastY = undefined
  },
  radioChange: function(e){
    console.log(e)
    if(this.data.selectedWorksId != e.currentTarget.dataset.id){
      this.setData({
        selectedWorksId : e.currentTarget.dataset.id
      })
    }else{
      this.setData({
        selectedWorksId : -1
      })
    }

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
                that.refreshData()
              }
            })

            return
          }
          msg = res.data.message
        }
        that.handleFail(msg)
      },
      fail: function(res){
        let msg = "网络出错,请稍后再试!"
        that.handleFail(msg)
      },
      complete: function(res){
        that.voting = false
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
        title:"还未选择作品",
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

  },
  onShareAppMessage: function () {
    let title = app.globalData.nickName+'邀请您给他加油助威。'
    let desc = '我正在参加活动名称,邀请您给他加油助威。'
    let url = '/pages/vote/vote?fromOpenId='+app.globalData.openId+'&activityId='+this.data.activityId+'&voteWorksId='+this.data.voteWorksId+'&share=1'

    if(this.data.voteWorksId == -1){
      if(this.data.userWorksId == -1){
        title = app.globalData.nickName+'邀请您参与投票。'
        desc = '我发现一个不错的作品，想请您也来投票表达一下态度。'
      }else{
        title = app.globalData.nickName+'邀请您给我加油助威。'
        desc = '我正在参加活动名称,邀请您给我加油助威,作品Id:'+this.data.userWorksId+'。'
        url = '/pages/vote/vote?fromOpenId='+app.globalData.openId+'&activityId='+this.data.activityId+'&voteWorksId='+this.data.userWorksId+'&share=1'
      }

    }

    return {
      title: title,
      desc: desc,
      path: url
    }
  }
})
