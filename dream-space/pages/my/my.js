// pages/my/my.js
var app = getApp();
Page({
  data: {
    windowHeight: 0,
    windowWidth: 0,
    convertTimes: 2,
    myInfo: {},
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
            myInfo: res.data.data,
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
  viewImg: function (e) {
    let url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
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
  },
  toAboutPage: function (e) {
    let that = this;
    if (app.globalData.openId == '') {
      app.unAuthLoginModal(that, false, true);
      return
    }
    wx.navigateTo({
      url: '../about/about'
    })
  },
  toLeadPage: function (e) {
    let that = this;
    if (app.globalData.openId == '') {
      app.unAuthLoginModal(that, false, true);
      return
    }
    wx.navigateTo({
      url: '../userLead/userLead'
    })
  }
})