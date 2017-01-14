// pages/addphoto/addphoto.js
var app = getApp();
Page({
  data:{
    id:0,
    solgan: "",
    desc: "",
    localphoto: "",
    isuploading: false,
    voteWorksId:"",
    userWorksId:""
  },
  onLoad:function(options){
    console.log(options)
    this.setData({
      id:options.id,
      localphoto: options.photopath,
      voteWorksId:options.voteWorksId,
      userWorksId:options.userWorksId
    })
    // 页面初始化 options为页面跳转所带来的参数
  },
  getsolgan: function(e){
    this.data.solgan = e.detail.value;
    console.log(this.data.solgan)
  },
  getdesc: function(e){
    this.data.desc = e.detail.value;
    console.log(this.data.desc)
  },
  submit: function(e){
    console.log(e)
    if(this.data.isuploading){
      return
    }
    let that = this
    // if(that.data.solgan.length <1 || that.data.desc.length <1){
    //   wx.showToast({
    //     icon:'loading',
    //     title:"您有口号或描述未填写!"
    //   })
    //   return
    // }
    wx.uploadFile({
      url:app.globalData.serverHost+"discovery/activity/apply.json",
      filePath: that.data.localphoto,
      name:"image",
      formData:{
        'openId':app.globalData.openId,
        'id': that.data.id,
        'solgan': that.data.solgan,
        'desc': that.data.desc
      },
      success: function(res){
        console.log(res)
        if(res.statusCode == 200){
          let rdata = JSON.parse(res.data)
          if(rdata.status ==0 || (rdata.status == -1 && rdata.message == "您已参与")){
            wx.redirectTo({
              url: '../vote/vote?activityId='+that.data.id+"&voteWorksId="+that.data.voteWorksId+"&userWorksId="+that.data.userWorksId
            })
            return;
          }
        }
        let msg = "上传出错,请稍后再试!"
        that.handleFail(msg)
      },
      fail: function(e){
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
  }
})
