var app = getApp();
Page({
  data: {
    windowHeight: 0,
    windowWidth: 0,
    convertTimes: 2,
    date: '2017-01-01',
    avatarImg: '',
    typeIndex: 0,
    typeArray: ['亲子空间', '恋爱空间'],
    btnDisabled: true,
    spaceId:0,
    version:0,
    gender:1,
    spaceInfo:{},
    secert:'',
    spaceIcon:''
  },
  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        let convertTimes = 750 / res.windowWidth;
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          convertTimes: convertTimes,
        })
      }
    })
    that.setData({
      spaceId:options.spaceId,
      version:options.version,
      secert:options.secert
    })
    wx.request({
      url: app.globalData.serverHost+"info.json",
      data: {
        openId:app.globalData.openId,
        spaceId:options.spaceId,
        version:options.version
      },
      method: 'GET',
      success: function(res){
         if(res.data.data.icon==null || res.data.data.icon==''){
          res.data.data.icon=(res.data.data.type==0)?'../../image/familydefault.png':'../../image/lovedefault.png';
        }
        that.setData({
          spaceInfo:res.data.data,
          spaceIcon:res.data.data.icon,
          date:res.data.data.bornDate==null?that.data.date:(res.data.data.bornDate).split(" ")[0],
          typeIndex:res.data.data.type
        })
      },
      fail: function(ron) {
        console.log("获取空间信息出错!");
        console.log(ron);
        app.failedToast();
      }
    })
  },
  formSubmit: function (e) {
    let that = this;
    let para = e.detail.value;
    let url = app.globalData.serverHost + "info/edit.json";
    let data = {
      'openId': app.globalData.openId,
      'spaceId':that.data.spaceId,
      'name': para.nickname,
      //出生日期可为空 yyyy-MM-dd yyyymmdd两种格式
      'born': (para.birthday==null || para.birthday=='')?that.data.date:para.birthday,
      //0 其它 1:male 2 female
      // 'gender': para.gender == "" ? '0' : para.gender,
      //0:亲子空间 1恋爱空间
      // 'type': para.type,
      'version': that.data.version,
      'info':para.info
    }
      wx.request({
        url: url,
        data: data,
        method: 'GET',
        success: function (res) {
          if (res.statusCode == 200 && res.data.status == 0) {
            app.globalData.modifySpaceInfoFlag=true;
            app.globalData.indexRefreshStatus = true;
            wx.navigateBack({
              delta: 1
            })
          } else {
            app.failedToast();
          }
        },
        fail: function (res) {
          console.log(res);
          app.failedToast();
        }
      })
  },
  checkData: function (e) {
    if (e.detail.value.trim() != '') {
      this.setData({
        btnDisabled: false
      })
    } else {
      this.setData({
        btnDisabled: true
      })
    }
  },
  choosenImage: function (e) {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.uploadFile({
          url: app.globalData.serverHost+'icon/edit.json',
          filePath:res.tempFilePaths[0],
          name:'image',
          formData: {
            openId:app.globalData.openId,
            spaceId:that.data.spaceId,
            version:that.data.version
          },
          success: function(rps){
            that.setData({
              spaceIcon: res.tempFilePaths[0]
            })
            app.globalData.modifySpaceInfoFlag=true;
          },
          fail: function(ron) {
            console.log("上传失败!");
            console.log(ron);
            app.uploadFileFailedToast();
          }
        })
      }
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  }
})