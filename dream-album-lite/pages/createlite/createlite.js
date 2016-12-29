var app = getApp();
let pageData = {
  data: {
    start:0,  // 用于模板列表分页请求
    size:10,
    choosed: 0,
    tempFilePaths:[],  // 用户选中的图片 共4(app.globalData.albumPageCount)张
    albumList:[],
    submodules:[],
    moduleWidth:0,  // 预览部分，每个背景图图片的宽高
    moduleHeight:0,
    templateWidth:0,  // 模板选择部分，每个图片的宽高
    templateHeight:0,
    content_hegiht: 0, // content 部分高度
    icon_top:0,   // 完成按钮的top和left值
    icon_left:0,
    created: false
  },
  onLoad: function (option) {
    // 读取传入和本地数据
    // this.data.tempFilePaths = option.tmpfilepaths.split(',')

    this.init()
  },
  initAlbumDetail:function(index){
    // 加载第一个模板的详细数据
    let that = this
    let albumItemList = that.data.albumList[index].albumItemList

    let submodules = []
    for (let i = 0; i < albumItemList.length; i++) {
      let amodule = albumItemList[i]
      let submodule = {}
      submodule.bgsrc = amodule.shadowImgUrl;
      submodule.editsrc = amodule.editImgUrl;
      submodule.elesrc = i< that.data.tempFilePaths.length ? that.data.tempFilePaths[i] : ""

      //可编辑图片区域设置
      let editImgInfos = JSON.parse(amodule.editImgInfos)
      //for editarea position
      submodule.editAreaLeft = editImgInfos.cssElmMoveX;
      submodule.editAreaTop = editImgInfos.cssElmMoveY;
      submodule.editAreaWidth = editImgInfos.cssElmWidth;
      submodule.editAreaHeight = editImgInfos.cssElmHeight;
      submodule.bgImgWidth = amodule.imgWidth;
      submodule.bgImgHeight = amodule.imgHeight;

      submodule.shadowImgWidth = submodule.editAreaWidth / submodule.bgImgWidth * that.data.moduleWidth
      submodule.shadowImgHeight = submodule.editAreaHeight /  submodule.bgImgHeight * that.data.moduleHeight
      submodule.shadowImgLeft = submodule.editAreaLeft / submodule.bgImgWidth * that.data.moduleWidth
      submodule.shadowImgTop = submodule.editAreaTop / submodule.bgImgHeight * that.data.moduleHeight

      submodule.rank = amodule.rank
      submodule.elecount = amodule.editCount
      submodule.id = amodule.id
      submodules.push(submodule)
    }
    // submodules = submodules.concat(submodules)

    this.setData({
      submodules: submodules
    })
  },
  init: function () {
    let that = this
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    })

    let templateHeight = (app.globalData.windowHeight -20)/5 - 20
    let templateWidth = (app.globalData.windowWidth  -80)/3.3
    this.setData({
      moduleWidth :(app.globalData.windowWidth-60)/2,
      moduleHeight :((app.globalData.windowHeight - 20)/5*4 -30)/2,
      templateWidth :templateWidth,
      templateHeight : templateHeight,
      templateIconSize: templateWidth * 0.8, // 宽度的0.8
      templateTextSize: templateHeight - (templateWidth * 0.8) ,
      templateFontSize: (templateHeight - (templateWidth * 0.9)) *0.7,
      content_hegiht : (app.globalData.windowHeight - 20)/5*4,
      item_width: app.globalData.windowWidth,
      icon_top: ((app.globalData.windowHeight - 20)/5*4 -80 +20)/2,
      icon_left:(app.globalData.windowWidth-80) /2,
      sy_top: 20,
      sy_left: 20
    })
    that.loadMoreTmplate(0)

  },
  requestFailed:function(res){
    wx.showModal({
      title:"提示",
      content: "网络错误，请稍后再试！"
    }),
    wx.hideToast()
  },
  loadMoreTmplate:function(e){

    let that = this
    if(this.data.nomore){
      return
    }
    wx.request({
      url: app.globalData.serverHost+'dream/album/common/listalbums.json',
      data: {
        size:that.data.size,
        start:that.data.start,
        appId: app.globalData.appId
      },
      method: 'GET',
      success: function(res){
        let alist = that.data.albumList.concat(res.data)
        // alist = alist.concat(res.data)
        that.setData({
          albumList:alist,
          start:that.data.start+res.data.length
        });
        if(res.data.length<that.data.size){
          that.data.nomore = true
        }
        that.initAlbumDetail(that.data.choosed)
        wx.hideToast()
      },
      fail: function(res){
        that.requestFailed(res)
      }
    })
  },
  chooseTemplate: function(e){
    this.setData({
      choosed:e.target.dataset.albumindex
    })
    this.initAlbumDetail(this.data.choosed)
  },
  uploadImage: function(index){
    // 上传图片， index：图片在 that.data.submodules 的下表
    let that = this
    wx.hideToast()

    // 一些必要的数据
    let albumId = that.data.albumList[that.data.choosed].id
    // 判断index = lenght：应该停止，跳转下一页

    if(index == that.data.submodules.length){
      app.globalData.finishCreateFlag = true;
      wx.showModal({
        title: "创建完成",
        // content: "立即预览相册",
        cancelText: "返回首页",
        confirmText: "预览相册",
        success: function(res){
          if(res.confirm){
            let userId = wx.getStorageSync("userId");
            wx.redirectTo({
              url: '../viewswiper/viewswiper?userId=' + userId + '&albumId=' + albumId+ '&userAlbumId=' + that.userAlbumId+ "&from=1"
            })
          }else {
            wx.navigateBack({
              delta: getCurrentPages().length
            });
          }
        },
        complete: function(){
          that.setData({
            created: false
          })
        }
      })

      return
    }
    // 显示，正在生成第index+1张模板照片
    wx.showToast({
      title: '正在上传第'+(index +1)+'张照片',
      icon: 'loading',
      duration: 10000
    })
    // 根据是否有elesrc判断使用的接口
      // 接口回调 fail 走失败路径，显示上传错误提示
      // 接口回调success 走成功路径，继续上传下一张
    let submodule = that.data.submodules[index]

    if(submodule.elesrc != ""){
      wx.uploadFile({
        url: app.globalData.serverHost + "/dream/album/common/uploaduserimg.json",
        filePath: submodule.elesrc,
        name: 'image',
        formData: {
          'userId': wx.getStorageSync('userId') + "",
          'albumItemId': submodule.id+"",
          'albumId': albumId+"",
          'appId': app.globalData.appId + ""
        },
        fail: function (res) {
          wx.hideToast()
          wx.showModal({
            title: "提示",
            content: "上传文件错误，请从新上传",
            showCancel: false
          })
        },
        success: function(res){
          let jsdata = JSON.parse(res.data);
          that.userAlbumId = jsdata.data;
          that.uploadImage(index+1);
        }
      })
    }else{
      wx.request({
        url: app.globalData.serverHost + "dream/album/common/uploadnotuserimg.json",
        data: {
          'userId': wx.getStorageSync('userId') + "",
          'albumItemId': submodule.id+"",
          'albumId': albumId+"",
          'appId': app.globalData.appId + ""
        },
        fail: function (res) {

          wx.hideToast()
          wx.showModal({
            title: "提示",
            content: "上传文件错误，请从新上传",
            showCancel: false
          })
        },
        success: function(res){
          let usrAlbId = res.data.data
          that.userAlbumId = usrAlbId
          that.uploadImage(index+1)
        }
      })
    }
  },
  createAlbum: function(e){
    let that = this;
    wx.chooseImage({
      count: app.globalData.albumPageCount,
      success: function (res) {
        if (res.tempFilePaths.length < app.globalData.albumPageCount) {
          wx.showModal({
            title: "提示",
            content: "该相册可以上传" + app.globalData.albumPageCount + "张照片，您选中" + res.tempFilePaths.length + "张 确认是否制作",
            success: function (rescfm) {
              if (rescfm.confirm) {
                that.setData({
                    tempFilePaths : res.tempFilePaths
                })
              }
            }
          })
        } else {
          that.setData({
                tempFilePaths : res.tempFilePaths
          })
          console.log(that.data.tempFilePaths)
        }
      }
    })
    // if(this.data.created){
    //   return;
    // }
    // this.setData({
    //   created: true
    // })
    // this.tag = []
    // this.timeout = true;// 是否走timeout自动跳转逻辑
    // let that = this;
    // wx.showToast({
    //   title: '正在上传照片...',
    //   icon: 'loading',
    //   duration: 10000
    // })
    // this.uploadImage(0)
  },
  chooseImage: function(e){
    let index = e.target.dataset.index
    let submodule = this.data.submodules[index]
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType:['album', 'camera'],
      success: function(res){
        // let tmppaths = res.tempFilePaths;
        submodule.elesrc = res.tempFilePaths[0]
        that.setData({
          submodules: that.data.submodules
        })
      }
    })
  }
}
Page(pageData)
