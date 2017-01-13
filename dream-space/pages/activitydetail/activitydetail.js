var app = getApp();
let pageData = {
    data:{
        id:0,
        title:"",
        intr:"",
        content:"",
        prize: "",
        buttonstop: 560,
        isshowjoinin: false,
        windowHeight:600,
        joinmargintop: 500,
        activityIntrParts:[],
        deadline:{},
        participate:{},
        examples:{}
    },
    convert2rpx: function(px){
      return px * this.convertrate
    },
    convert2px: function(rpx){
      return rpx / this.convertrate
    },
    onLoad:function(option){
      // option parms
      this.data.id = option.id;

      let that = this;
      wx.getSystemInfo({
       success: function(res){
         that.convertrate = 750/res.windowWidth;
         that.setData({
           windowHeight: res.windowHeight,
           buttonstop: res.windowHeight - that.convert2px(98),
           joinmargintop: res.windowHeight- that.convert2px(300)
         })
        }
      })
      wx.getSystemInfo({
       success: function(res){
          that.setData({
            windowHeight: res.windowHeight
          })
        }
      })
      let activityDetail = {id:option.id,title:"标题1",intr:"本文档将带你一步步创建完成一个微信小程序，并可以在手机上体验该小程序的实际效果。",
      deadline:{pfx:"距离结束",keyword:7,sfx:"天"},participate:{pfx:"",keyword:1089,sfx:"人参加"},
      content:"实现下划线方法有两种，\n 一种是html标签实现、一种是css text-decoration实现下划线样式，大家可以灵活运用。网页中默认情况下文字字体是没有下划线样式，]\n如果需要就通过以上两种方法实现；同时，如果文字被超链接锚文本，其默认有下划线样式，如果去掉超链接下划线呢？如何css实现链接无下划线？", prize: "活动的奖品",prizeList:[{title:"NO.1 免费参加特权",imgsrc:"https://raw.githubusercontent.com/yanchunlei/res/master/ps/ps_0.png"},{title:"NO.2 抵用券",imgsrc:"https://raw.githubusercontent.com/yanchunlei/res/master/ps/ps_0.png"}],
      examples:[{
        imgsrc:"https://raw.githubusercontent.com/yanchunlei/res/master/ps/ps_0.png",txt:"第一次照镜子"
      },{
        imgsrc:"https://raw.githubusercontent.com/yanchunlei/res/master/ps/ps_0.png",txt:"第一次吃柠檬"
      },{
        imgsrc:"https://raw.githubusercontent.com/yanchunlei/res/master/ps/ps_0.png",txt:"第一次见到雨"
      }]}
      this.setData({
          id: activityDetail.id,
          title: activityDetail.title,
          intr: activityDetail.intr,
          content: activityDetail.content,
          prize: activityDetail.prize,
          activityIntrParts:activityDetail.content.split('\n'),
          prizeList:activityDetail.prizeList,
          participate: activityDetail.participate,
          deadline: activityDetail.deadline,
          examples: activityDetail.examples
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
          console.log(res)
          if(res.statusCode == 200){

          }else{
            let msg = "服务器错误,请稍后再试!"
            that.handleFail(msg)
          }
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
          url: '../vote/vote?activityId='+this.data.id
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
                url:'../addphoto/addphoto?id='+that.data.id+"&photopath="+photopath
              })
          }
        }
      })
    },
    selectalbum :function(e){
      console.log("选择已有照片",this.data.id)
      wx.navigateTo({
        url: '../joinin/joinin?id='+this.data.id
      })
    }
}
Page(pageData)
