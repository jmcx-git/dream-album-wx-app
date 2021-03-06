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
    isHidden2: true,
    longclick:false
  },
  onLoad: function (options) {
    new app.WeToast();
    //nothing
    let that = this;
    let redirectRefer = app.globalData.redirectRefer;
    let fromOpenId = app.globalData.fromOpenId;
    let spaceId = app.globalData.spaceId;
    let owner = app.globalData.owner;
    let activityId = app.globalData.activityId;
    let voteWorksId = app.globalData.voteWorksId;
    let openId = app.globalData.openId;

    if (redirectRefer == '' || redirectRefer == null || redirectRefer == 'null' || redirectRefer == undefined) {
      that.onloadData();
    } else {
      if (redirectRefer == 1) {
        if (openId == '') {
          app.authLogin(that, true)
          let openIdNow = app.globalData.openId;
          if (openIdNow == '') {
            //说明拒绝授权，什么都不做
            console.log('分享后,拒绝授权,什么也不做')
          } else {
            that.shareLogic();
          }
        } else {
          that.shareLogic();
        }
      } else if (redirectRefer == 2) {
        //voteWorksId
        if (openId == '') {
          app.authLogin(that, true)
          let openIdNow = app.globalData.openId;
          if (openIdNow == '') {
            //说明拒绝授权，什么都不做
            console.log('分享后,拒绝授权,什么也不做')
          } else {
            that.clearGlobalShareData()
            wx.navigateTo({
              url: '../activitydetail/activitydetail?fromOpenId=' + fromOpenId + '&activityId=' + activityId + '&voteWorksId=' + voteWorksId + "&share=yes"
            })
          }
        } else {
          that.clearGlobalShareData()
          wx.navigateTo({
            url: '../activitydetail/activitydetail?fromOpenId=' + fromOpenId + '&activityId=' + activityId + '&voteWorksId=' + voteWorksId + "&share=yes"
          })
        }
      } else {
        console.log("redirectRefer即不为空,也不是1和2")
      }
    }
  },
  onShow: function () {
    let that = this;
    //强制刷新
    if (app.globalData.indexRefreshStatus) {
      app.globalData.indexRefreshStatus = false;
      that.reInit();
      that.onloadData();
    }
  },
  onHide: function () {
    let that = this;
    if (that.data.isOpen) {
      that.bindViewTap();
    }
  },
  shareLogic: function () {
    let that = this;
    let fromOpenId = app.globalData.fromOpenId;
    let spaceId = app.globalData.spaceId;
    let owner = app.globalData.owner;
    let openId = app.globalData.openId;
    if (owner == 1) {
      wx.request({
        url: app.globalData.serverHost + 'joined.json',
        data: {
          spaceId: spaceId,
          openId: openId
        },
        method: 'GET',
        success: function (res) {
          if (res.statusCode == 200 && res.data.status == 0) {
            if (res.data.data) {
              //已加入
              that.clearGlobalShareData()
              wx.navigateTo({
                url: '../spacetimeline/spacetimeline?spaceId=' + spaceId + "&version=" + app.globalData.version + "&share=yes"
              })
            } else {
              //未加入
              that.clearGlobalShareData()
              wx.navigateTo({
                url: '../confirmJoinSpace/confirmJoinSpace?spaceId=' + spaceId + "&openId=" + openId + "&fromOpenId=" + fromOpenId
              })
            }
          } else {
            app.showWeLittleToast(that, '服务器请求异常', 'error');
          }
        },
        fail: function () {
          app.showWeLittleToast(that, '服务器请求异常', 'error');
        }
      })
    } else if (owner == 0) {
      console.log("owner为0 什么也不做")
      that.onloadData();
    } else {
      console.log("参数异常:owner即不为1也不为0");
      that.onloadData();
    }
  },
  onloadData: function () {
    app.globalData.indexRefreshStatus = false;
    let that = this;
    let animation1 = wx.createAnimation({
      timingFunction: 'ease',
    })
    let animation2 = wx.createAnimation({
      timingFunction: 'ease',
    })
    that.data.animation1 = animation1;
    that.data.animation2 = animation2;
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
    if (!wx.getStorageSync('openId') || !wx.getStorageSync('nickName') | !wx.getStorageSync('avatarUrl')) {
      app.authLogin(that, false)
    } else {
      that.getData();
    }
  },
  getData: function () {
    let that = this;
    var url = app.globalData.serverHost + 'list.json';
    let start = this.data.start;
    let size = this.data.size;
    wx.request({
      url: url,
      data: {
        'openId': app.globalData.openId,
        'version': app.globalData.version,
        'start': start,
        'size': size
      },
      method: 'GET',
      success: function (res) {
        //渲染我的数据
        console.log(res);
        if (res.statusCode == 200) {
          if (res.data.data == null || res.data.data.totalCount == 0) {
            console.log("没有数据!")
            that.setData({
              nopics: true,
              more: false
            })
          } else {
            let newStart = start + size;
            let newItems = [];
            if (start == 0) {
              newItems = res.data.data.resultList;
            } else {
              newItems = that.data.items.concat(res.data.data.resultList);
            }
            that.setData({
              items: newItems,
              loadStatus: true,
              start: newStart,
              more: res.data.data.more
            })
          }
        }
      },
      fail: function () {
        app.showWeLittleToast(that, '服务器请求异常', 'error');
      }
    })
  },
  reInit: function () {
    let that = this;
    that.setData({
      nopics: false,
      start: 0,
      more: true,
      isProcess: false,//线程锁
      isOpen: false,//判断进展
      animationData1: {},
      animationData2: {},
      isHidden1: true,
      isHidden2: true,
    })
  },
  addSpace: function (e) {
    let that = this;
    let way = e.currentTarget.dataset.way;
    if (app.globalData.openId == '') {
      app.unAuthLoginModal(that, false);
      return
    }
    wx.navigateTo({
      url: '../addspace/addspace?way=' + way
    })
  },
  toSpace: function (e) {
    let that=this;
    if(that.data.longclick){
      return;
    }
    console.log("进入");
    let index = e.currentTarget.id;
    let spaceId = this.data.items[index].id;
    wx.navigateTo({
      url: '../spacetimeline/spacetimeline?spaceId=' + spaceId + "&version=" + app.globalData.version
    })
  },
  bindViewTap: function () {
    let that = this;
    if (!that.data.isProcess) {
      that.data.isProcess = true
      let animation1 = that.data.animation1;
      let animation2 = that.data.animation2;
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
        that.setData({
          isHidden1: false,
          isHidden2: false,
        })
        setTimeout(function () {
          animation1.translate(-20, -70).step()
          animation2.translate(-70, -0).step()
          that.setData({
            animationData1: animation1.export(),
            animationData2: animation2.export(),
            isOpen: true,
            isProcess: false
          })
        }, 60)
      }
    }
  },
  onPullDownRefresh: function () {
    let that = this;
    if (app.globalData.openId == '') {
      app.unAuthLoginModal(that, false);
      return
    }
    that.reInit();
    that.getData();
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    let that = this;
    if (that.data.more) {
      if (app.globalData.openId == '') {
        return
      }
      that.getData();
    }
  },
  clearGlobalShareData: function () {
    app.globalData.redirectRefer = '';
    app.globalData.fromOpenId = '';
    app.globalData.spaceId = '';
    app.globalData.owner = '';
    app.globalData.activityId = '';
    app.globalData.voteWorksId = '';
  },
  onShareAppMessage: function () {
    let openId = app.globalData.openId;
    let nickName = app.globalData.nickName;
    let productName = app.globalData.productName;
    return {
      title: nickName + '邀请您使用' + productName,
      desc: '用它，您可以记录，分享您的珍贵时刻。',
      path: '/pages/index/index?fromOpenId=' + openId
    }
  },
  delSpaceInfo:function(e){
    let that=this;
    that.setData({
      longclick:true
    })
    var content = e.currentTarget.dataset.owner == 0 ? "退出":"删除";
    wx.showActionSheet({
      itemList:[content],
      success:function(res){
        if(res.tapIndex==0){
             wx.showModal({
              title:'提示',
              content:'确定要' + content + '当前空间?',
              showCancel:true,
              success:function(ron){
                if(ron.confirm){
                  wx.request({
                    url: app.globalData.serverHost+'leave.json',
                    data: {
                      openId:app.globalData.openId,
                      spaceId:e.currentTarget.dataset.spaceid,
                      version:app.globalData.version
                    },
                    method: 'GET',
                    success: function(ros){
                      (that.data.items).splice(e.currentTarget.dataset.index,1);
                      that.setData({
                          items:that.data.items,
                          longclick:false
                      })
                      wx.showToast({
                          title:'操作成功',
                          icon:'success',
                          duration:1000,
                          mask:true
                      })
                    },
                    fail: function(rps) {
                      app.errorToast("操作失败！");
                    }
                  })
                }else{
                  that.setData({
                    longclick:false
                  })
                }
              }
            })
        }else{
          that.setData({
            longclick:false
          })
        }
      }
    })
  }
})
