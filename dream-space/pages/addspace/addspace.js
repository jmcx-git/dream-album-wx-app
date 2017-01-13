var app = getApp();
var util = require('../../utils/util.js')
Page({
  data: {
    windowHeight: 0,
    windowWidth: 0,
    convertTimes: 2,
    date: '2017-01-01',
    avatarImg: '',
    typeIndex: 0,
    typeArray: ['亲子空间', '恋爱空间'],
    inputPrefixName: '宝宝昵称',
    inputPrefixBorn: '宝宝生日',
    inputPrefixSex: '宝宝性别',
    addWay: 1,
    page: 0,
    btnDisabled: true
  },
  onLoad: function (options) {
    let that = this;
    let way = options.way;
    let nowDate = util.formatDate(new Date())
    let page = getCurrentPages().length;
    wx.getSystemInfo({
      success: function (res) {
        let convertTimes = 750 / res.windowWidth;
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          convertTimes: convertTimes,
          addWay: way,
          page: page,
          date: nowDate
        })
      }
    })
  },
  formSubmit: function (e) {
    let that = this;
    let para = e.detail.value;
    let url = app.globalData.serverHost + "add.json";
    let nowDate = that.data.date;
    let data = {
      'openId': app.globalData.openId,
      'name': that.data.avatarImg != '' ? encodeURI(para.name) : para.name,
      //出生日期可为空 yyyy-MM-dd yyyymmdd两种格式
      'born': para.birthday == "" ? nowDate : para.birthday,
      //0 其它 1:male 2 female
      'gender': para.gender,
      //0:亲子空间 1恋爱空间
      'type': para.type,
      'info': that.data.avatarImg != '' ? encodeURI(para.info) : para.info,
      'version': app.globalData.version
    }
    if (that.data.avatarImg != '') {
      wx.uploadFile({
        url: url,
        filePath: that.data.avatarImg,
        name: 'image',
        formData: data,
        success: function (res) {
          let data = JSON.parse(res.data);
          console.log(data);
          if (res.statusCode == 200 && data.status == 0) {
            wx.showToast({
              icon: 'success',
              title: '添加成功'
            })
            app.globalData.indexRefreshStatus = true;
            wx.navigateBack({
              delta: that.data.page
            })
          } else {
            app.errorToast(data.message);
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
          console.log(res);
          if (res.statusCode == 200 && res.data.status == 0) {
            wx.showToast({
              icon: 'success',
              title: '添加成功'
            })
            app.globalData.indexRefreshStatus = true;
            wx.navigateBack({
              delta: that.data.page
            })
          } else {
            app.errorToast(res.data.message);
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
        'secert': para.secert,
        'version': app.globalData.version
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200) {
          if (res.data.status == 0) {
            wx.showToast({
              icon: 'success',
              title: '验证成功'
            })
            app.globalData.indexRefreshStatus = true;
            wx.navigateBack({
              delta: that.data.page
            })
          } else if (res.data.status == -2) {
            wx.showToast({
              title: '无效的验证码'
            })
          } else {
            app.failedToast()
          }
        } else {
          app.errorToast(res.data.message)
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
    let that = this;
    let index = e.detail.value;
    if (index == 0) {
      that.setData({
        typeIndex: index,
        inputPrefixName: '宝宝昵称',
        inputPrefixBorn: '宝宝生日',
        inputPrefixSex: '宝宝性别',
      })
    } else if (index == 1) {
      that.setData({
        typeIndex: index,
        inputPrefixName: '恋人昵称',
        inputPrefixBorn: '纪念日',
        inputPrefixSex: '恋人性别',
      })
    } else {
      that.setData({
        typeIndex: index
      })
    }
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  }
})