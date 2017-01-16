//app.js
let {WeToast} = require('src/wetoast.js')
App({
  //注册自定义toast
  WeToast,
  onLaunch: function () {
    let openId = wx.getStorageSync("openId");
    if (typeof openId !== 'undefined' && openId != '') {
      this.globalData.openId = openId;
    }
    let nickName = wx.getStorageSync("nickName");
    if (typeof nickName !== 'undefined' && nickName != '') {
      this.globalData.nickName = nickName;
    }
    let avatarUrl = wx.getStorageSync("avatarUrl");
    if (typeof avatarUrl !== 'undefined' && avatarUrl != '') {
      this.globalData.avatarUrl = avatarUrl;
    }
  },
  globalData: {
    // serverHost: "http://10.1.0.131:8080/dream-family/space/",
    serverHost: "https://developer.mokous.com/space/",
    // serverHost: "https://api.mokous.com/space/",
    appId: "wx0ddc8673b8df3827",
    version: '1.0.0',
    nickName: "",
    avatarUrl: "",
    openId: "",
    createFinishFlag: false,
    modifySpaceInfoFlag: false,
    indexRefreshStatus: false,
    productName: '时光小窝',
    fromOpenId: '',
    spaceId: '',
    redirectRefer: '',
    owner: ''
  },
  authLogin: function (that, needRedirect = false) {
    let self = this;
    wx.login({
      success: function (wxLoginRes) {
        //获取code
        wx.request({
          url: self.globalData.serverHost + 'user/session.json',
          data: {
            code: wxLoginRes.code,
            appId: self.globalData.appId
          },
          method: 'GET',
          success: function (sessionResp) {
            //缓存第三方key
            var openId = sessionResp.data
            if (openId == "") {
              console.log("Get user openId failed. resp:" + sessionResp + ", code:" + wxLoginRes.code + ", appId:" + self.globalData.appId
              );
              self.showWeLittleToast(that, '服务器请求异常', 'error');
              return
            }
            wx.setStorageSync('openId', openId);
            wx.getUserInfo({
              success: function (wxUserInfoResp) {
                wx.request({
                  url: self.globalData.serverHost + 'user/info.json',
                  data: {
                    openId: openId,
                    encryptedData: wxUserInfoResp.encryptedData,
                    iv: wxUserInfoResp.iv,
                    appId: self.globalData.appId
                  },
                  method: 'GET',
                  success: function (serverUserInfoResp) {
                    if (serverUserInfoResp.statusCode == 200 && serverUserInfoResp.data.status == 0) {
                      wx.setStorageSync('nickName', serverUserInfoResp.data.data.nickName);
                      wx.setStorageSync('avatarUrl', serverUserInfoResp.data.data.avatarUrl);
                      wx.setStorageSync('openId', openId);
                      self.globalData.openId = openId;
                      self.globalData.nickName = serverUserInfoResp.data.data.nickName;
                      self.globalData.avatarUrl = serverUserInfoResp.data.data.avatarUrl;
                      if (!needRedirect) {
                        that.getData();
                      }
                    } else {
                      self.showWeLittleToast(that, '服务器请求异常', 'error');
                    }
                  }
                })
              },
              fail: function (res) {
                //拒绝获取信息
                console.log(res);
                //self.refuseLoginToast();
                wx.request({
                  url: self.globalData.serverHost + 'noauthorize/info.json',
                  data: {
                    openId: openId,
                    appId: self.globalData.appId
                  },
                  method: 'GET',
                  success: function (noAuthUserInfoResp) {
                    console.log(noAuthUserInfoResp)
                    if (noAuthUserInfoResp.statusCode == 200 && noAuthUserInfoResp.data.status == 0) {
                      wx.setStorageSync('nickName', noAuthUserInfoResp.data.data.nickName);
                      wx.setStorageSync('avatarUrl', noAuthUserInfoResp.data.data.avatarUrl);
                      wx.setStorageSync('openId', openId);
                      self.globalData.openId = openId;
                      self.globalData.nickName = noAuthUserInfoResp.data.data.nickName;
                      self.globalData.avatarUrl = noAuthUserInfoResp.data.data.avatarUrl;
                      if (!needRedirect) {
                        that.getData();
                      }
                    } else {
                      self.showWeLittleToast(that, '服务器请求异常', 'error');
                    }
                  }
                })
              }
            })
          },
          fail: function (trd) {
            console.log("缓存第三方key出错！", trd);
            self.showWeLittleToast(that, '服务器请求异常', 'error');
          }
        })
      },
      fail: function (ee) {
        console.log("登录出错了！", ee);
        self.showWeLittleToast(that, '登录异常', 'error');
      }
    })
  },
  showWeLittleToast: function (that, content, icon) {
    that.wetoast.toast({
      img: icon == 'error' ? '../../image/erroricon.png' : icon,
      title: content,
      bodyClassName: 'my_toast_body'
    })
  },
  failedToast() {
    wx.showToast({
      title: '请求出现异常,请稍后!',
      icon: 'success',
      duration: 2000
    });
  },
  errorToast(errMsg) {
    wx.showToast({
      title: errMsg,
      icon: 'success',
      duration: 2000
    });
  },
  uploadFileFailedToast() {
    wx.showModal({
      title: "提示",
      content: '上传文件网络异常，请稍后重试。',
      icon: 'success',
      showCancel: false
    });
  },
  unAuthLoginModal(that, needRedirect = false, indexRefresh = false) {
    let self = this;
    wx.showModal({
      title: '用户授权',
      content: '小程序需要先授权才能正常使用,是否允许' + self.globalData.productName + '获得授权信息?',
      showCancel: true,
      cancelText: '拒绝',
      confirmText: '确认',
      success: function (res) {
        if (res.confirm) {
          self.authLogin(that, needRedirect);
          self.globalData.indexRefreshStatus = indexRefresh;
        } else {
          self.refuseLoginToast();
        }
      }
    })
  },
  refuseLoginToast: function () {
    wx.showToast({
      title: '已拒绝授权'
    })
  }
})
