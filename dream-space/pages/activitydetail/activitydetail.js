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
        voteWorksId:"",

        isShowWinnerList: false,// 控制是否显示中奖名单,根据step = 4 和userPrizes == null\undefined 确定
        winnersinfolist:[{
          content:"奖励1",
          userinfos:[{
            src:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKialMMeUV7CloHKMPly30ssUIQTCic1gE4icDxibiauVykzhKf862dwbRNcdVTIAGMfrw5EHs9VrIG2CA/0",
            name:"呵呵哒",
          },
          {
            src:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKialMMeUV7CloHKMPly30ssUIQTCic1gE4icDxibiauVykzhKf862dwbRNcdVTIAGMfrw5EHs9VrIG2CA/0",
            name:"呵呵哒",
          },
          {
            src:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKialMMeUV7CloHKMPly30ssUIQTCic1gE4icDxibiauVykzhKf862dwbRNcdVTIAGMfrw5EHs9VrIG2CA/0",
            name:"呵呵哒",
          },
          {
            src:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKialMMeUV7CloHKMPly30ssUIQTCic1gE4icDxibiauVykzhKf862dwbRNcdVTIAGMfrw5EHs9VrIG2CA/0",
            name:"呵呵哒",
          },
          {
            src:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKialMMeUV7CloHKMPly30ssUIQTCic1gE4icDxibiauVykzhKf862dwbRNcdVTIAGMfrw5EHs9VrIG2CA/0",
            name:"呵呵哒",
          },
          {
            src:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKialMMeUV7CloHKMPly30ssUIQTCic1gE4icDxibiauVykzhKf862dwbRNcdVTIAGMfrw5EHs9VrIG2CA/0",
            name:"呵呵哒",
          },
          {
            src:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKialMMeUV7CloHKMPly30ssUIQTCic1gE4icDxibiauVykzhKf862dwbRNcdVTIAGMfrw5EHs9VrIG2CA/0",
            name:"呵呵哒",
          }]
      },{content:"奖励2",
      userinfos:[{
        src:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKialMMeUV7CloHKMPly30ssUIQTCic1gE4icDxibiauVykzhKf862dwbRNcdVTIAGMfrw5EHs9VrIG2CA/0",
        name:"呵呵哒",
      },
      {
        src:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKialMMeUV7CloHKMPly30ssUIQTCic1gE4icDxibiauVykzhKf862dwbRNcdVTIAGMfrw5EHs9VrIG2CA/0",
        name:"呵呵哒",
      }]}]
    },
    convert2rpx: function(px){
      return px * this.convertrate
    },
    convert2px: function(rpx){
      return rpx / this.convertrate
    },
    onLoad:function(option){
      // 判断分享
      app.globalData.indexRefreshStatus=true;

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
          console.log("actiitydetail", res)
          if(res.statusCode == 200){
            if(res.data.status == 0){
              let dat = res.data.data;
              let activityIntrParts = [].concat(dat.contentSections);
              activityIntrParts.push(dat.activityRule)
              activityIntrParts.push(dat.activityTimeDesc)
              that.setData({
                cover: dat.cover,
                title: dat.title,
                introduction: dat.introduction,
                activityIntrParts:activityIntrParts,
                showicon: icons[dat.step % icons.length],
                deadline:{pfx:"距离结束",keyword:dat.stepTime, sfx: dat.stepTimeUnit},
                participates: 0,

                examples:dat.examples,

                prizeList: dat.prizes,
                step: dat.step,
                joined: dat.joined > 0,
                userWorksId: dat.worksId
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
          url: '../vote/vote?activityId='+this.data.id+'&voteWorksId'+this.data.voteWorksId+"&userWorksId="+this.data.userWorksId
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
      wx.navigateTo({
        url: '../joinin/joinin?id='+this.data.id+"&voteWorksId="+this.data.voteWorksId+"&userWorksId="+this.data.userWorksId
      })
    },
    contactus: function(e){
      console.log("联系我们")
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
      console.log(url)

      return {
        title: title,
        desc: desc,
        path: url
      }
    }

}
Page(pageData)
