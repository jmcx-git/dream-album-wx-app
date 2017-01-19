var app = getApp();
let icons = [
  "/image/detail_timing.png",
  "/image/detail_timing.png",
  "/image/detail_counting.png",
  "/image/detail_result.png"];
let pageData = {
    data:{
        id:0,
        cover: "",
        title:"",
        introduction:"",
        activityIntrParts:[],
        deadline:{},
        participates: 0,
        showicon: icons[0],
        stepDesc: '',
        stepTime: 0,
        stepTimeUnit: '',
        activityRule: '',
        activityTimeDesc: '',


        examples:[],

        prizeList: [],

        // 控制显示
        buttonstop: 560,
        isshowjoinin: false,
        windowHeight:600,
        joinmargintop: 500,

        // 其他数据
        step: 0,
        joined: false,

        // 分享数据
        voteWorksId:-1,
        userWorksId: -1,

        isShowWinnerList: false,// 控制是否显示中奖名单,根据step = 4 和userPrizes == null\undefined 确定
        winnericons:["/image/detailwinner1.png","/image/detailwinner2.png","/image/detailwinner3.png"],

        winnersinfolist:[],


        entries:[],
        start: 0,
        size: 10,
        noMoreList: false,
        findKey: "",
        inputShowed: false,
        inputVal: "",
        scrollHeight: 500,
        showSearchbar: true,
        selectedWorksId: -1,
    },
    convert2rpx: function(px){
      return px * this.convertrate
    },
    convert2px: function(rpx){
      return rpx / this.convertrate
    },
    onLoad:function(option){
      // if(option.fakeopenId != undefined){
      //   app.globalData.openId = "oRi3q0Fle8CvJWlZ3EWo-uuvvUh8"
      // }
      // 判断分享
      console.log("onload")
      if(option.share == 'yes'){
        app.globalData.indexRefreshStatus=true;
      }

      if(option.share ==1){
        // let url = '../index/index?redirectRefer=2&fromOpenId='+option.fromOpenId+"&activityId="+option.activityId+"&voteWorksId="+option.voteWorksId
        app.globalData.fromOpenId = option.fromOpenId
        app.globalData.redirectRefer = 2
        app.globalData.activityId = option.activityId
        app.globalData.voteWorksId = option.voteWorksId
        wx.switchTab({
          url: '../index/index'
        })


        // return
      }


      // option parms
      this.data.id = option.activityId;


      let that = this;
      wx.getSystemInfo({
       success: function(res){
         that.convertrate = 750/res.windowWidth;
         that.setData({
           windowHeight: res.windowHeight,
           buttonstop: res.windowHeight - that.convert2px(98),
           joinmargintop: res.windowHeight- that.convert2px(300),
           voteWorksId: that.getWorksId(option.voteWorksId)
         })
        }
      })

    // this.initData(this.data.id)
    },
    onShow: function(){
      console.log("onshow");
      this.initData(this.data.id)
    },
    getWorksId: function(worksId){
      return (worksId == undefined || worksId == 'undefined' || worksId == null || worksId == 'null' || worksId == "")? -1: worksId
    },
    initData: function(activityId){
      let that = this;
      wx.request({
        url:app.globalData.serverHost + "discovery/activity/info.json",
        data:{
          openId: app.globalData.openId,
          id: activityId
        },
        method: "GET",
        success: function(res) {
          if(res.statusCode == 200){
            if(res.data.status == 0){
              let dat = res.data.data;
              that.setData({
                cover: dat.cover,
                title: dat.title,
                stepDesc: dat.stepDesc,
                stepTimeUnit: dat.stepTimeUnit,
                stepTime: dat.stepTime,
                introduction: dat.introduction,
                activityTimeDesc: dat.activityTimeDesc,
                activityRule: dat.activityRule,
                activityIntrParts: dat.contentSections,
                showicon: icons[dat.step % icons.length],
                participates: dat.participates,

                examples:dat.examples,

                prizeList: dat.prizes,
                step: dat.step,
                joined: dat.joined > 0,
                userWorksId: dat.worksId,
                winnersinfolist: dat.userPrizes,
                isShowWinnerList: dat.userPrizes != null && dat.userPrizes != undefined && dat.step == 3
              })

              console.log("loadmore", that.data.step)
              if(that.data.step != 0){
                // 如果是投票中的话,显示列表, 如果是完成,查看结果
                that.refreshData()
              }
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
    },
    takein: function(e){
      this.setData({
        isshowjoinin: true
      })
    },
    cancel: function(e){
      this.setData({
        isshowjoinin: false
      })
    },
    govote: function(e){
        wx.navigateTo({
          url: '../vote/vote?vote=1&activityId='+this.data.id+'&voteWorksId='+this.data.voteWorksId+"&userWorksId="+this.data.userWorksId
        })
    },
    seevote: function(e){
        wx.navigateTo({
          url: '../vote/vote?vote=0&activityId='+this.data.id+'&voteWorksId='+this.data.voteWorksId+"&userWorksId="+this.data.userWorksId
        })
    },
    addphoto: function(e){
      let that = this
      wx.chooseImage({
        count:1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          if(res.tempFilePaths.length >0){
              let photopath = res.tempFilePaths[0]

              wx.navigateTo({
                url:'../addphoto/addphoto?id='+that.data.id+"&photopath="+photopath+"&voteWorksId="+that.data.voteWorksId+"&userWorksId="+that.data.userWorksId
              })
          }
        }
      })
    },
    selectalbum :function(e){
      console.log("选择已有照片",this.data.id)
      let that = this
      wx.navigateTo({
        url: '../joinin/joinin?id='+this.data.id+"&voteWorksId="+that.data.voteWorksId+"&userWorksId="+this.data.userWorksId
      })
    },
    onShareAppMessage: function () {
      console.log("v", this.data.voteWorksId, "u", this.data.userWorksId)
      let title = app.globalData.nickName+'邀请您加入活动。'
      let desc = '有福同享，快来参加活动名称，赢取大奖。'
      let url = '/pages/activitydetail/activitydetail?fromOpenId='+app.globalData.openId+'&activityId='+this.data.id+'&voteWorksId='+this.data.voteWorksId+'&share=1'
      if(this.data.joined){
        title = app.globalData.nickName+'邀请您给我加油助威。'
        desc = '我正在参加活动'+this.data.title+',邀请您给我加油助威,作品Id:'+this.data.userWorksId+'。'
      }
      if(this.data.voteWorksId == -1){
        url = '/pages/activitydetail/activitydetail?fromOpenId='+app.globalData.openId+'&activityId='+this.data.id+'&voteWorksId='+this.data.userWorksId+'&share=1'
      }
      console.log("share", url)
      return {
        title: title,
        desc: desc,
        path: url
      }
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
    refreshVoteList: function(e){
      this.setData({
        findKey: ""
      })
      this.refreshData()
    },
    refreshData: function(){
      this.data.entries = []
      this.data.noMoreList = false;
      this.data.start = 0;
      this.setData({
        selectedWorksId: -1
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
    loadMore: function(){
      console.log("loadmore1", this.data.findKey)
      console.log("loadmore2", this.data.voteWorksId)
      if(this.data.noMoreList){
        return
      }
      let that = this;
      let start = that.data.start
      wx.request({
        url: app.globalData.serverHost +"discovery/activity/works/list.json",
        data:{
          openId: app.globalData.openId,
          id: that.data.id,
          findKey: that.data.findKey,
          start: that.data.start,
          size: that.data.size,
          voteWorksId: that.getWorksId(that.data.voteWorksId)
        },
        success:function(res){
          console.log(res)
          let list = []
          if(start == 0){
            list = res.data.data.resultList
          }else{
            list = that.data.entries.concat(res.data.data.resultList);
          }
          if(res.statusCode == 200){
            if(res.data.status == 0){
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
    },handleScroll: function(e){
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
          id: that.data.id,
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

    }

}
Page(pageData)
