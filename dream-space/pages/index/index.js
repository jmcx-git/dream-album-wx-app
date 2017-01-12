var app = getApp();
Page({
  data: {
    windowHeight: 0,
    windowWidth: 0,
    convertTimes: 2,
    items: [],
    loadStatus: false,
    nopics: false,
    start: 0,
    size: 10,
    more: true,
    isProcess: false,//线程锁
    isOpen: false,//判断进展
    animationData1: {},
    animationData2: {},
    isHidden1: true,
    isHidden2: true
  },
  onLoad: function (options) {
    //nothing
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
    if (!wx.getStorageSync('openId')) {
      that.confirmGetData()
    } else {
      that.getData();
    }
  },
  onShow: function () {
    let that = this;
    //强制刷新
    if (app.globalData.indexRefreshStatus) {
      app.globalData.indexRefreshStatus = false;
      that.reInit();
      if (!wx.getStorageSync('openId')) {
        that.confirmGetData()
      } else {
        that.getData();
      }
    }
  },
  onHide: function () {
    let that = this;
    if (that.data.isOpen) {
      that.bindViewTap();
    }
  },
  confirmGetData: function () {
    var that = this
    wx.login({
      success: function (wxLoginRes) {
        //获取code
        wx.request({
          url: app.globalData.serverHost + 'user/session.json',
          data: {
            code: wxLoginRes.code,
            appId: app.globalData.appId
          },
          method: 'GET',
          success: function (sessionResp) {
            //缓存第三方key
            var openId = sessionResp.data
            if (openId == "") {
              console.log("Get user openId failed. resp:" + sessionResp + ", code:" + wxLoginRes.code + ", appId:" + app.globalData.appId
              );
              app.failedToast();
              return
            }
            wx.setStorageSync('openId', openId);
            wx.getUserInfo({
              success: function (wxUserInfoResp) {
                wx.request({
                  url: app.globalData.serverHost + 'user/info.json',
                  data: {
                    openId: openId,
                    encryptedData: wxUserInfoResp.encryptedData,
                    iv: wxUserInfoResp.iv,
                    appId: app.globalData.appId
                  },
                  method: 'GET',
                  success: function (serverUserInfoResp) {
                    if (serverUserInfoResp.statusCode == 200 && serverUserInfoResp.data.status == 0) {
                      wx.setStorageSync('nickName', serverUserInfoResp.data.data.nickName);
                      wx.setStorageSync('avatarUrl', serverUserInfoResp.data.data.avatarUrl);
                      wx.setStorageSync('openId', openId);
                      app.globalData.openId = openId;
                      app.globalData.nickName = serverUserInfoResp.data.data.nickName;
                      app.globalData.avatarUrl = serverUserInfoResp.data.data.avatarUrl;
                      that.getData();
                    } else {
                      app.failedToast();
                    }
                  }
                })
              },
              fail: function () {
                //拒绝获取信息
                console.log("拒绝获取个人信息")
                that.getData();
              }
            })
          },
          fail: function (trd) {
            console.log("缓存第三方key出错！", trd);
            app.failedToast();
          }
        })
      },
      fail: function (ee) {
        console.log("登录出错了！", ee);
        app.failedToast();
      }
    })
  },
  getData: function () {
    let that = this;
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 5000
    })
    setTimeout(function () {
      wx.hideToast();
    }, 5000)
    that.requestData();
  },
  requestData: function () {
    let that = this;
    var url = app.globalData.serverHost + 'list.json';
    wx.request({
      url: url,
      data: {
        'openId': app.globalData.openId,
        'version': app.globalData.version,
        'start': that.data.start,
        'size': that.data.size
      },
      method: 'GET',
      success: function (res) {
        //渲染我的数据
        console.log(res);
        if (res.statusCode == 200) {
          if (res.data.data == null || res.data.data.totalCount == 0) {
            console.log("没有数据!")
            that.setData({
              nopics: true
            })
          } else {
            let newStart = that.data.start + that.data.size;
            let newItems = that.data.items.concat(res.data.data.resultList)
            that.setData({
              items: newItems,
              loadStatus: true,
              start: newStart,
              more: res.data.data.more
            })
          }
          wx.hideToast();
        }
      },
      fail: function () {
        app.failedToast()
      }
    })
  },
  reInit: function () {
    let that = this;
    that.setData({
      items: [],
      loadStatus: false,
      nopics: false,
      start: 0,
      size: 10,
      more: true,
      isProcess: false,//线程锁
      isOpen: false,//判断进展
      animationData1: {},
      animationData2: {},
      isHidden1: true,
      isHidden2: true
    })
  },
  onPullDownRefresh: function () {
    let that = this;
    that.reInit();
    that.getData();
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    let that = this;
    if (that.data.more) {
      that.getData();
    }
  },
  addSpace: function (e) {
    let way = e.currentTarget.dataset.way;
    wx.navigateTo({
      url: '../addspace/addspace?way=' + way
    })
  },
  toSpace: function (e) {
    let index = e.currentTarget.id;
    let spaceId = this.data.items[index].id;
    wx.navigateTo({
      url: '../spacetimeline/spacetimeline?spaceId=' + spaceId + "&version=" + app.globalData.version
    })
  },
  bindViewTap: function () {
    let that = this;
    // if (that.data.isProcess) {//上一个操作还没结束
    //   wx.showToast({
    //     title: '您手速太快了，我反应不过来',
    //     icon: 'loading',
    //     duration: 400
    //   })
    //   return;
    // }
    that.data.isProcess = true //进展中
    let animation1 = wx.createAnimation({
      timingFunction: 'ease',
    })
    let animation2 = wx.createAnimation({
      timingFunction: 'ease',
    })
    if (that.data.isOpen) {
      animation1.translate(0, 0).step()
      animation2.translate(0, 0).step()
      that.setData({
        animationData1: animation1.export(),
        animationData2: animation2.export(),
      })
      setTimeout(function () {
        that.setData({
          isHidden1: true,
          isHidden2: true,
          isOpen: false,
          isProcess: false
        })
      }, 400)
    } else {
      animation1.translate(0, -70).step()
      animation2.translate(-70, 0).step()
      that.setData({
        isHidden1: false,
        isHidden2: false
      })
      setTimeout(function () {
        that.setData({
          animationData1: animation1.export(),
          animationData2: animation2.export(),
          isOpen: true,
          isProcess: false
        })
      }, 10)
    }
  },
  onShareAppMessage: function () {
    return {
      title: '分享一个微空间',
      desc: '加入我的私有空间一起愉快的玩耍吧',
      path: '/pages/index/index'
    }
  }
})