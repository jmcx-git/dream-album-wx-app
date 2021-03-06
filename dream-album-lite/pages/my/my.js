var app = getApp();
Page({
  data: {
    winHeight: 0,
    winWidth: 0,
    convertTimes: 2,
    items: [],
    avatarUrl: '',
    nopichidden: 'none',
    viewtap: false,
    authorizeTitle: "请确认授权以下信息",
    authorizeContent: ". 获得你的公开信息(昵称、头像等)",
    picLoadFinish: false,
    picLoadCount: 0,
    indicatorDots: false,
    autoplay: false,
    a: 3000,
    duration: 500,
    marginLeft: 110,
    userAlbumClass: 'imageTopPic',
    isDelShakeModel: false,
    showDelBtn: false
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          convertTimes: 750 / res.windowWidth
        });
      }
    });
    
    if (!this.allDataExists()) {
      that.confirmGetData()
    } else {
      that.getData();
    }
  },
  allDataExists: function(){
    return wx.getStorageSync('openId') && wx.getStorageSync('nickName') && wx.getStorageSync('avatarUrl')
  },
  onPullDownRefresh: function () {
    this.refreshData();
    wx.stopPullDownRefresh();
  },
  viewTemplateList: function (e) {
    wx.navigateTo({
      url: "../createlite/createlite"
    })
  },
  refreshData: function () {
    this.setData({
      items: [],
      nopichidden: 'none',
      viewtap: false,
      picLoadFinish: false,
      picLoadCount: 0,
      userAlbumClass: 'imageTopPic',
      isDelShakeModel: false,
      showDelBtn: false
    })
    this.getData();
  },
  previewImage: function (e) {
    let that = this;
    //控制longtap后不会直接跳转预览页
    if (!that.data.viewtap || that.data.isDelShakeModel) {
      return;
    }
    wx.navigateTo({
      url: '../viewswiper/viewswiper?userAlbumId=' + e.currentTarget.dataset.useralbumid
    })
  },
  delLongTapHandle: function () {
    let that = this;
    if (!that.data.isDelShakeModel) {
      that.setData({
        userAlbumClass: 'imageTopPic shake_animation',
        isDelShakeModel: true,
        showDelBtn: true
      })
    }
  },
  cancleDelHandle: function(){
    let that = this;
    if (that.data.isDelShakeModel) {
      that.setData({
        userAlbumClass: 'imageTopPic',
        isDelShakeModel: false,
        showDelBtn: false
      })
    }
  },
  delAlbumHandle: function (e) {
    let that = this;
    let index = e.currentTarget.id;
    let item = that.data.items[index];
    that.setData({
      isDelShakeModel: false,
      userAlbumClass: 'imageTopPic',
      showDelBtn: false
    })
    let useConfirmDel = false;
    let deleteInfo="";
    wx.showModal({
      title: '删除提示',
      content: '是否删除' + item.title + '?',
      success: function (res) {
        if (res.confirm) {
          useConfirmDel=true;
          wx.request({
            url: app.globalData.serverHost + 'album/delete.json',
            data: {
              openId: app.globalData.openId + '',
              userAlbumId: item.userAlbumId + ''
            },
            method: 'GET',
            success: function (res) {
              if (res.statusCode == 200 && res.data.status == 0) {
                if (res.data.data) {
                  setTimeout(function(){
                    wx.showToast({
                      title: "删除成功!",
                      icon: "success",
                      duration: 1500
                    })},500);
                  let thatItems =  that.data.items;
                  thatItems.splice(index,1);
                  that.setData({
                    items: thatItems
                  });
                  //that.refreshData();
                } else {                  
                  setTimeout(function(){
                    wx.showToast({
                      title: "删除失败,请稍后重试!",
                      icon: "success",
                      duration: 1500
                    })},500);
                }
              } else {         
                setTimeout(function(){
                  wx.showToast({
                    title: "删除失败,请稍后重试!",
                    icon: "success",
                    duration: 1500
                  })},500);
              }
            },
            fail: function () {       
              setTimeout(function(){
                wx.showToast({
                  title: "远程服务器忙，请稍后重试！",
                  icon: "success",
                  duration: 1500
                })},500);
            }
          })
        }
      }
    })
  },
  confirmGetData: function () {
    var that = this
    wx.login({
      success: function (wxLoginRes) {
        //获取code
        wx.request({
          url: app.globalData.serverHost + 'album/user/getSession.json',
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
              app.weixinServerFailedToast();
              return
            }
            wx.setStorageSync('openId', openId);
            wx.getUserInfo({
              success: function (wxUserInfoResp) {
                wx.request({
                  url: app.globalData.serverHost + 'album/user/getUserInfo.json',
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
                      app.serverFailedToast();
                    }
                  }
                })
              },
              fail: function () {
                app.weixinServerFailedToast();
              }
            })
          },
          fail: function (trd) {
            console.log("缓存第三方key出错！");
            console.log(trd);
          }
        })
      },
      fail: function (ee) {
        console.log("登录出错了！");
        console.log(ee);
      }
    })
  },
  getData: function () {
    let that = this;
    let nickName = wx.getStorageSync("nickName");
    let avatarUrl = wx.getStorageSync("avatarUrl");

    if (typeof nickName === "undefined" || typeof avatarUrl === "undefined" || (nickName == "" && avatarUrl == "")
      || nickName == "undefined" || avatarUrl == "undefined") {
      that.confirmGetData();
      return;
    }
    that.setData({
      nickName: nickName,
      avatarUrl: avatarUrl
    })
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    })
    that.consoleImage();
    let url = app.globalData.serverHost + 'album/getMyAlbum.json';
    wx.request({
      url: url,
      data: {
        openId: app.globalData.openId,
        appId: app.globalData.appId
      },
      method: 'GET',
      success: function (res) {
        //渲染我的数据
        if (res.statusCode == 200) {
          if (res.data.length == 0) {
            that.setData({
              nopichidden: 'block'
            })
            wx.hideToast();
          } else {
            that.setData({
              items: res.data,
              nopichidden: 'none',
              viewtap: true,
              marginLeft: res.data.length == 1 ? 160 : 110
            })
          }
        }
      },
      fail: function () {
        app.serverFailedToast()
      }
    })
  },
  picLoad: function (e) {
    let that = this;
    that.setData({
      picLoadCount: that.data.picLoadCount + 1
    })
    if (that.data.picLoadCount == that.data.items.length ||
      that.data.picLoadCount >= 3) {
      wx.hideToast();
      console.log("Pic load");
      that.setData({
        picLoadFinish: true
      })
    }
  },
  consoleImage: function () {
    let that = this;
    setTimeout(function () {
      that.setData({
        picLoadFinish: true
      })
      wx.hideToast();
    }, 3000)
  },
  onShow: function () {
    if (app.globalData.finishCreateFlag) {
      this.refreshData();
      app.globalData.finishCreateFlag = false;
    }
  },
  onHide: function () {
    let that = this;
    //shake态下模拟失焦 取消shake
    if (that.data.isDelShakeModel) {
      that.setData({
        isDelShakeModel: false,
        userAlbumClass: 'imageTopPic',
        showDelBtn: false
      })
    }
  },
  toEdit: function (e) {
    let that = this
    //shake态下模拟失焦 取消shake
    if (that.data.isDelShakeModel) {
      that.setData({
        isDelShakeModel: false,
        userAlbumClass: 'imageTopPic',
        showDelBtn: false
      })
    }
    let index = e.currentTarget.id;
    let item = this.data.items[index]
    item.isEditTitle = true;
    item.focus = true;
    this.setData({
      items: that.data.items
    })
  },
  editTitle: function (e) {
    let title = e.detail.value;
    let that = this
    let index = e.currentTarget.id;
    let item = this.data.items[index];
    let orititle = item.title;
    item.isEditTitle = false;
    item.focus = false;
    item.title = title;
    that.setData({
      items: that.data.items
    })
    if (title != orititle) {
      wx.showModal({
        title: '修改提示',
        content: '确认修改相册的标题为:' + title + '?',
        success: function (res) {
          let itemx = that.data.items[index];
          if (!res.confirm) {
            itemx.title = orititle;

            that.setData({
              items: that.data.items
            })
          } else {
            let url = app.globalData.serverHost + 'album/modifyuseralbuminfotitle.json';
            wx.request({
              url: url,
              data: {
                openId: app.globalData.openId + '',
                userAlbumId: itemx.userAlbumId + '',
                title: title,
                appId: app.globalData.appId
              },
              method: 'GET',
              success: function (res) {
                console.log(res)
              },
              fail: function (res) {
                console.log(res)
              }
            })
          }
        }
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: '分享一个相册制作工具',
      desc: '我发现一个一分钟即可制作精美相册的工具，邀您来使用。',
      path: '/pages/my/my'
    }
  }
})
