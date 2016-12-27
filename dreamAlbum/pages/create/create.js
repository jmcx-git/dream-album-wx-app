var app = getApp();
let pageData = {
  data: {
    submodules: [],
    index: 0,
    backTxt:"上一页",
    nextTxt: "下一页",
    nextTxtRight: 30
  },
  onLoad: function (option) {
    // 读取传入和本地数据
    this.albumId = option.albumId;
    this.userId = wx.getStorageSync('userId');

    this.windowWidth = app.globalData.windowWidth;
    this.windowHeight = app.globalData.windowHeight;
    this.convertTimes = 750 / this.windowWidth

    let that = this;
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 10000
    })

    wx.request({
      url: app.globalData.serverHost + "dream/album/common/startmakeuseralbum.json",
      data: {
        albumId: this.albumId,
        userId: this.userId
      },
      success: function (res) {
        that.handleResult(res)
      },
      fail: function (res) {
        that.requestfailed(res)
      }
    })
  },
  handleResult: function (res) {
    let albumItemInfos = res.data.albumItemInfos;
    this.currentIndex = 0;
    let submodules = []
    for (let i = 0; i < albumItemInfos.length; i++) {
      let amodule = albumItemInfos[i]
      let submodule = {}
      submodule.bgsrc = amodule.shadowImgUrl;
      submodule.editsrc = amodule.editImgUrl;
      submodule.elesrc = ''
      //可编辑图片区域设置
      let editImgInfos = JSON.parse(amodule.editImgInfos)
      //for editarea position
      submodule.editAreaLeft = editImgInfos.cssElmMoveX;
      submodule.editAreaTop = editImgInfos.cssElmMoveY;
      submodule.editAreaWidth = editImgInfos.cssElmWidth;
      submodule.editAreaHeight = editImgInfos.cssElmHeight;
      submodule.bgImgWidth = amodule.imgWidth;
      submodule.bgImgHeight = amodule.imgHeight;

      submodule.rank = amodule.rank
      submodule.elecount = amodule.editCount
      submodule.id = amodule.id
      submodules.push(submodule)
    }
    this.setData({
      submodules: submodules,
      userAlbumId: res.data.userAlbumInfo.id
    })
    this.init(this.currentIndex)
    wx.hideToast()
  },
  init: function (index) {
    // init data
    let submodule = this.data.submodules[index]

    let shadowImgWidth = submodule.editAreaWidth / submodule.bgImgWidth * 640;
    let shadowImgHeight = submodule.editAreaHeight / submodule.bgImgHeight * (this.windowHeight * this.convertTimes - 166);
    let shadowImgLeft = 55 + submodule.editAreaLeft / submodule.bgImgWidth * 640;
    let shadowImgTop = 55 + submodule.editAreaTop / submodule.bgImgHeight * (this.windowHeight * this.convertTimes - 166);

    // back，next 的文字描述
    if(index ==0){
      this.data.backTxt = "返回首页"
    }else{
      this.data.backTxt ="上一页"
    }
    if(index == this.data.submodules.length-1){
      this.data.nextTxt = "生成相册"
      this.data.nextTxtRight = 0
    }else{
      this.data.nextTxt = "下一页"
      this.data.nextTxtRight = 30
    }


    // 设置数据：
    this.setData({
      index: index,
      contentHeight: this.windowHeight * this.convertTimes - 166 + "rpx",
      bgWidth: "640rpx",
      bgHeight: this.windowHeight * this.convertTimes - 166 + "rpx",
      editAreaRelativeTop: shadowImgTop + "rpx",
      editAreaRelativeLeft: shadowImgLeft + "rpx",
      editAreaRelativeWidth: shadowImgWidth + "rpx",
      editAreaRelativeHeight: shadowImgHeight + "rpx",
      backTxt: this.data.backTxt,
      nextTxt: this.data.nextTxt,
      nextTxtRight: this.data.nextTxtRight
    })
  },
  picLoad: function(e){
    wx.hideToast();
  },
  chooseImage: function (e) {
    let that = this;
    let index = this.data.index;
    wx.chooseImage({
      count:1,
      sizeType: ["original", "compressed"],
      scourceType: ["album", "camera"],
      success: function (res) {
        that.data.submodules[index].elesrc = res.tempFilePaths[0]
        that.data.submodules[index].bgsrc = that.data.submodules[index].editsrc
        //每次选图以后choosed状态为true，将会走保存图片操作
        that.data.submodules[index].choosed = true
        that.setData({
          submodules: that.data.submodules
        })
        wx.showToast({
          title: "加载背景中...",
          icon: "loading",
          duration: 3000
        })
      }
    })
  },
  save: function (e) {
    let index = this.data.index;
    let length = this.data.submodules.length;
    let that = this;
    // 点击下一步时保存数据
    let submodule = this.data.submodules[index];

    let title = index == length - 1 ? '相册生成中' : '数据上传中';
    if (submodule.choosed) {
      wx.showToast({
        title: title,
        icon: 'loading',
        duration: 10000
      })
      wx.uploadFile({
        url: app.globalData.serverHost + "/dream/album/common/uploadalbumpage.json",
        filePath: submodule.elesrc,
        name: 'image',
        formData: {
          'userAlbumId': that.data.userAlbumId + "",
          'albumItemId': submodule.id + ""
        },
        success: function (res) {
          //上传已选图片,清零choosed状态
          submodule.choosed = false
          wx.hideToast()
          if (index < length - 1) {
            that.init(++index)
          } else {
            app.globalData.finishCreateFlag=true;
            wx.showModal({
              title: "创建完成",
              // content: "立即预览相册",
              cancelText: "返回首页",
              confirmText: "预览相册",
              success: function(res){
                if(res.confirm){
                  wx.redirectTo({
                    url: '../viewswiper/viewswiper?userAlbumId=' + that.data.userAlbumId
                  })
                }else {
                  wx.navigateBack({
                    delta: 2
                  });
                }
              }
            })
          }
        },
        fail: function (res) {
          that.requestfailed(res);
        }
      })
    } else {
      if (index == length - 1) {
        wx.showToast({
          title: title,
          icon: 'loading',
          duration: 10000
        })
      }
      wx.request({
        url: app.globalData.serverHost + "/dream/album/common/uploademptypage.json",
        data: {
          'userAlbumId': that.data.userAlbumId + "",
          'albumItemId': submodule.id + ""
        },
        method: 'GET',
        success: function (res) {
          if (index < length - 1) {
            that.init(++index)
          } else {
            wx.hideToast()
            app.globalData.finishCreateFlag=true;
            wx.showModal({
              title: "创建完成",
              // content: "立即预览相册",
              cancelText: "返回首页",
              confirmText: "预览相册",
              success: function(res){
                if(res.confirm){
                  wx.redirectTo({
                    url: '../viewswiper/viewswiper?userAlbumId=' + that.data.userAlbumId
                  })
                }else {
                  wx.navigateBack({
                    delta: 2
                  });
                }
              }
            })
          }
        },
        fail: function (res) {
          that.requestfailed(res)
        }
      })
    }
  },
  back: function (e) {
    let index = this.data.index;
    if (index > 0) {
      this.init(--index)
    }else{
      wx.navigateBack({
        delta: 1
      });
      // console.log(wx.getCurrentPages());
    }
  },
  requestfailed: function (res) {
    wx.showModal({
      title: "提示",
      content: "网络错误，请稍后再试！"
    })
    wx.hideToast()
  }
}
Page(pageData)
