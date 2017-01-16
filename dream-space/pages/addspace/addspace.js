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
    genderValue: 1,
    typeArray: ['亲子空间', '恋爱空间'],
    defaultAvatar: '../../image/familydefault.png',
    inputPlaceholder: '我就叫宝宝',
    inputPrefixBorn: '宝宝生日',
    inputPrefixSex: '宝宝性别',
    btnPrefix: '开启亲子空间',
    addWay: 1,
    page: 0
  },
  onLoad: function (options) {
    new app.WeToast();
    let that = this;
    let way = options.way;
    if (way == 1) {
      wx.setNavigationBarTitle({
        title: '创建空间'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '加入空间'
      })
    }
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
    if (para.name.trim() == '') {
      app.showWeLittleToast(that,'还没起昵称呢 ^.^')
      return
    }
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
            // wx.navigateBack({
            //   delta: that.data.page
            // })
            wx.redirectTo({
              url: '../spacetimeline/spacetimeline?spaceId=' + data.data + "&version=" + app.globalData.version
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
            // wx.navigateBack({
            //   delta: that.data.page
            // })
            wx.redirectTo({
              url: '../spacetimeline/spacetimeline?spaceId=' + res.data.data + "&version=" + app.globalData.version
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
    if (para.secert.trim() == '') {
      app.showWeLittleToast(that,'验证码不能为空')
      return
    }
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
            // wx.navigateBack({
            //   delta: that.data.page
            // })
            wx.redirectTo({
              url: '../spacetimeline/spacetimeline?spaceId=' + res.data.data + "&version=" + app.globalData.version
            })
          } else if (res.data.status == -2) {
            app.showWeLittleToast(that,'无效的验证码')
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
        inputPlaceholder: '我就叫宝宝',
        defaultAvatar: '../../image/familydefault.png',
        inputPrefixBorn: '宝宝生日',
        inputPrefixSex: '宝宝性别',
        btnPrefix: '开启亲子空间',
      })
    } else if (index == 1) {
      that.setData({
        typeIndex: index,
        inputPlaceholder: '就是耐你',
        defaultAvatar: '../../image/lovedefault.png',
        inputPrefixBorn: '恋爱时间',
        inputPrefixSex: '恋人性别',
        btnPrefix: '开启恋爱空间',
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
  },
  changeGender: function (e) {
    this.setData({
      genderValue: e.currentTarget.id
    })
  }
})