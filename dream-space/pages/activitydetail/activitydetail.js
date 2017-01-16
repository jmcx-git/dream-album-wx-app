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

        isShowWinnerList: false,// 控制是否显示中奖名单,根据step = 4 和userPrizes == null\undefined 确定
        winnericons:["/image/detailwinner1.png","/image/detailwinner2.png","/image/detailwinner3.png"],

        winnersinfolist:[]
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
           voteWorksId: option.voteWorksId
         })
        }
      })

    this.initData(this.data.id)

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
                deadline:{pfx:"距离结束",keyword:dat.stepTime, sfx: dat.stepTimeUnit},
                participates: dat.participates,

                examples:dat.examples,

                prizeList: dat.prizes,
                step: dat.step,
                joined: dat.joined > 0,
                userWorksId: dat.worksId,
                winnersinfolist: dat.userPrizes,
                isShowWinnerList: dat.userPrizes != null && dat.userPrizes != undefined && dat.step == 3
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
          url: '../vote/vote?vote=1&activityId='+this.data.id+'&voteWorksId'+this.data.voteWorksId+"&userWorksId="+this.data.userWorksId
        })
    },
    seevote: function(e){
        wx.navigateTo({
          url: '../vote/vote?vote=0&activityId='+this.data.id+'&voteWorksId'+this.data.voteWorksId+"&userWorksId="+this.data.userWorksId
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
              let voteWorksId = (that.data.voteWorksId == -1 || that.data.voteWorksId ==""|| that.data.voteWorksId == undefined)? -1 : that.data.voteWorksId
              wx.navigateTo({
                url:'../addphoto/addphoto?id='+that.data.id+"&photopath="+photopath+"&voteWorksId="+voteWorksId+"&userWorksId="+that.data.userWorksId
              })
          }
        }
      })
    },
    selectalbum :function(e){
      console.log("选择已有照片",this.data.id)
      let that = this
      let voteWorksId = (that.data.voteWorksId == -1 || that.data.voteWorksId ==""|| that.data.voteWorksId == undefined)? -1: that.data.voteWorksId
      wx.navigateTo({
        url: '../joinin/joinin?id='+this.data.id+"&voteWorksId="+voteWorksId+"&userWorksId="+this.data.userWorksId
      })
    },
    onShareAppMessage: function () {
      let title = app.globalData.nickName+'邀请您加入活动。'
      let desc = '有福同享，快来参加活动名称，赢取大奖。'
      let url = '/pages/activitydetail/activitydetail?fromOpenId='+app.globalData.openId+'&activityId='+this.data.id+'&voteWorksId='+this.data.voteWorksId+'&share=1'
      if(this.data.joined){
        title = app.globalData.nickName+'邀请您给我加油助威。'
        desc = '我正在参加活动'+this.data.title+',邀请您给我加油助威,作品Id:'+this.data.userWorksId+'。'
      }
      if(this.data.voteWorksId == "" || this.data.voteWorksId == undefined){
        url = '/pages/activitydetail/activitydetail?fromOpenId='+app.globalData.openId+'&activityId='+this.data.id+'&voteWorksId='+this.data.userWorksId+'&share=1'
      }
      return {
        title: title,
        desc: desc,
        path: url
      }
    }

}
Page(pageData)
