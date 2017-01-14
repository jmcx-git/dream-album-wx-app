//app.js
App({
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
    indexRefreshStatus: false
  },
  serverFailedToast() {
    wx.showToast({
      title: '远程应用服务器忙，请下拉刷新重试。',
      icon: 'success',
      duration: 2000
    });
  },
  failedToast() {
    wx.showToast({
      title: '请求异常!请稍后再试~',
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
  unAuthLoginToast() {
    wx.showToast({
      title: '未授权,请先授权'
    })
  },
  refuseLoginToast() {
    wx.showToast({
      title: '已拒绝授权'
    })
  }
})
