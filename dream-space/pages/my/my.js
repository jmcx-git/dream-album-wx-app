// pages/my/my.js
var app = getApp();
Page({
  data: {
    windowHeight: 0,
    windowWidth: 0,
    convertTimes: 2,
    avatarUrl: '',
    nickName: '',
    newmsg: false
  },
  onLoad: function (options) {
    new app.WeToast();
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        let convertTimes = 750 / res.windowWidth;
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          convertTimes: convertTimes
        })
      }
    })
  },
  onShow: function () {
    let that = this;
    that.getData();
  },
  getData: function () {
    let that = this;
    wx.request({
      url: app.globalData.serverHost + 'my/info.json',
      data: {
        'openId': app.globalData.openId,
        'version': app.globalData.version
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200 && res.data.status == 0) {
          that.setData({
            avatarUrl: res.data.data.avatarUrl,
            nickName: res.data.data.nickname,
            newmsg: res.data.data.notices == 1 ? true : false
          })
        } else {
          app.showWeLittleToast(that, '服务器请求异常', 'error');
        }
      },
      fail: function () {
        app.showWeLittleToast(that, '服务器请求异常', 'error');
      }
    })
  },
  toNoticePage: function (e) {
    let that = this;
    if (app.globalData.openId == '') {
      app.unAuthLoginModal(that, false, true);
      return
    }
    that.setData({
      newmsg: false
    })
    wx.navigateTo({
      url: '../notice/notice'
    })
  }
})