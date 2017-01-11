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
    addWay: 1,
    page: 0,
    btnDisabled: true
  },
  onLoad: function (options) {
    let that = this;
    let way = options.way;
    let page = getCurrentPages().length;
    wx.getSystemInfo({
      success: function (res) {
        let convertTimes = 750 / res.windowWidth;
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          convertTimes: convertTimes,
          page: page,
          addWay: way
        })
      }
    })
  },
  formSubmit: function (e) {
    let that = this;
    let para = e.detail.value;
    let url = app.globalData.serverHost + "add.json";
    let data = {
      'openId': app.globalData.openId,
      'name': para.nickname,
      //出生日期可为空 yyyy-MM-dd yyyymmdd两种格式
      'born': para.birthday,
      //0 其它 1:male 2 female
      'gender': para.gender == "" ? '0' : para.gender,
      //0:亲子空间 1恋爱空间
      'type': para.type,
      'version': app.globalData.varsion
    }
    if (that.data.avatarImg != '') {
      wx.uploadFile({
        url: url,
        filePath: that.data.avatarImg,
        name: 'image',
        formData: data,
        success: function (res) {
          let data=JSON.parse(res.data);
          console.log(data);
          if (res.statusCode == 200 && data.status == 0) {
            wx.showToast({
              icon: 'success',
              title: '添加成功'
            })
            wx.navigateBack({
              delta: that.data.page
            })
          } else {
            app.uploadFileFailedToast()
          }
        },
        fail: function (res) {
          console.log(res);
          app.failedToast()
        }
      })
    } else {
      wx.request({
        url: url,
        data: data,
        method: 'GET',
        success: function (res) {
          if (res.statusCode == 200 && res.data.status == 0) {
            wx.showToast({
              icon: 'success',
              title: '添加成功'
            })
            wx.navigateBack({
              delta: that.data.page
            })
          } else {
            app.failedToast()
          }
        },
        fail: function (res) {
          console.log(res)
          app.failedToast()
        }
      })
    }
  },
  inviteSubmit: function (e) {
    let that = this;
    let para = e.detail.value;
    let url = app.globalData.serverHost + "join.json";
    wx.request({
      url: url,
      data: {
        'openId': app.globalData.openId,
        'nsecertame': para.secert,
        'version': app.globalData.varsion
      },
      method: 'GET',
      success: function (res) {
        if (res.statusCode == 200 && res.data.status == 0) {
          wx.showToast({
            icon: 'success',
            title: '验证成功'
          })
          wx.navigateBack({
            delta: that.data.page
          })
        } else {
          app.failedToast()
        }
      },
      fail: function (res) {
        console.log(res)
        app.failedToast()
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
        that.setData({
          avatarImg: res.tempFilePaths[0]
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