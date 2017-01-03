var app = getApp();
let pageData = {
  data: {
    start: 0,  // 用于模板列表分页请求
    size: 10,
    choosed: 0, // 当前选中的模板
    tempFilePaths: [],  // 用户选中的图片
    albumList: [],  // 模板列表
    pageList: [], // 页面列表 每个模板中页面为多个
    photoList: [], // 照片列表  每个页面中的照片为多个

    moduleWidth: 0,  // 四宫格部分，每个背景图图片的宽高
    moduleHeight: 0,
    templateWidth: 0,  // 模板选择部分，每个图片的宽高
    templateHeight: 0,
    pageFullHeight: 0, // 创建部分, 背景图片的高度
    pageFullWidth: 0,

    content_hegiht: 0, // content 部分高度
    content_width: 0,
    scrollViewWidth: 0,
    icon_top: 0,   // 完成按钮的top和left值
    icon_left: 0,
    created: false,
    hiddenGrid: false, // 是否显示预览(四宫格)图 true 显示四宫格,false显示创建预览页
    currentPage: 0, // 创建面板上, 当前处理的页面 起始为0
    photoCount: 0,   // 当前相册所有的照片的数量
    scrollLeft: 0,
    pageAnimCur: {},
    pageAnimR:{},
    pageAnimL:{},
    pagescallable: true
  },
  onLoad: function (option) {
    wx.setStorageSync('userId', 19)
    // 读取传入和本地数据
    this.anim = wx.createAnimation({
      transformOrigin:"0 0 0",
      duration: 0,
    })
    this.animP= wx.createAnimation({duration:0});
    this.init()
  },
  initAlbumDetail: function (index) {
    // 加载指定的模板的详细数据
    let album = this.data.albumList[index]
    let pageList = this.getPageList()
    let hiddenGrid = album.hiddenGrid
    let photoCount = 0;
    for(let i =0; i < pageList.length; i++){
      let page = pageList[i]
      photoCount += page.photoInfos.length;
    }

    let scrollViewWidth = this.data.content_width * pageList.length
    this.setData({
      pageList: pageList,
      photoList: this.getPhotoList(index),
      hiddenGrid: hiddenGrid == true? true: false,
      photoCount: photoCount,
      scrollViewWidth: scrollViewWidth
    })
  },
  init: function () {
    let that = this
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    })

    let templateHeight = (app.globalData.windowHeight - 20) / 5 - 20
    let templateWidth = (app.globalData.windowWidth - 80) / 3.3
    let content_hegiht = (app.globalData.windowHeight - 20) / 5 * 4
    this.setData({
      moduleWidth: (app.globalData.windowWidth - 60) / 2,
      moduleHeight: ((app.globalData.windowHeight - 20) / 5 * 4 - 30) / 2,
      templateWidth: templateWidth,
      templateHeight: templateHeight,
      templateIconSize: templateWidth * 0.8, // 宽度的0.8
      templateTextSize: templateHeight - (templateWidth * 0.8),
      templateFontSize: (templateHeight - (templateWidth * 0.9)) * 0.7,
      content_hegiht: content_hegiht,
      content_width: app.globalData.windowWidth,
      // scrollViewWidth: app.globalData.windowWidth *4,
      pageFullHeight: content_hegiht *0.8,
      pageFullWidth: app.globalData.windowWidth *0.8,

      item_width: app.globalData.windowWidth,
      icon_top: ((app.globalData.windowHeight - 20) / 5 * 4 - 80 + 20) / 2,
      icon_left: (app.globalData.windowWidth - 80) / 2,
      sy_top: 20,
      sy_left: 20
    })

    that.loadMoreTmplate(0)

  },
  requestFailed: function (res) {
    wx.showModal({
      title: "提示",
      content: "网络错误，请稍后再试！"
    }),
      wx.hideToast()
  },
  loadMoreTmplate: function (e) {

    let that = this
    if (this.data.nomore) {
      return
    }
    wx.request({
      url: app.globalData.serverHost + 'dream/album/common/listalbums.json',
      // url: 'http://10.1.1.135:8080/DynamicWebTest/hehe.txt',
      data: {
        size: that.data.size,
        start: that.data.start,
        appId: app.globalData.appId
      },
      method: 'GET',
      success: function (res) {

        let alist = that.data.albumList.concat(res.data)
        // alist = alist.concat(res.data)
        that.setData({
          albumList: alist,
          start: that.data.start + res.data.length
        });
        if (res.data.length < that.data.size) {
          that.data.nomore = true
        }
        that.initAlbumDetail(that.data.choosed)
        wx.hideToast()
      },
      fail: function (res) {
        that.requestFailed(res)
      }
    })
  },
  chooseTemplate: function (e) {
    this.setData({
      choosed: e.target.dataset.albumindex
    })
    this.initAlbumDetail(this.data.choosed)
  },
  uploadImage: function (index) {
    // 上传图片， index：图片在 that.data.submodules 的下表
    let that = this
    wx.hideToast()

    // 一些必要的数据
    let albumId = that.data.albumList[that.data.choosed].id

    // 判断index = length：应该停止，跳转下一页
    if (index == this.tmpPhotoList.length) {
      app.globalData.finishCreateFlag = true;
      wx.showModal({
        title: "创建完成",
        cancelText: "返回首页",
        confirmText: "预览相册",
        success: function (res) {
          if (res.confirm) {
            let userId = wx.getStorageSync("userId");
            wx.redirectTo({
              url: '../viewswiper/viewswiper?userId=' + userId + '&albumId=' + albumId + '&userAlbumId=' + that.userAlbumId + "&from=1"
            })
          } else {
            wx.navigateBack({
              delta: getCurrentPages().length
            });
          }
        },
        complete: function () {
          that.setData({
            created: false
          })
        }
      })

      return
    }
    // 显示，正在生成第index+1张模板照片
    wx.showToast({
      title: '正在上传第' + (index + 1) + '张照片',
      icon: 'loading',
      duration: 10000
    })
    // 根据是否有elesrc判断使用的接口
    // 接口回调 fail 走失败路径，显示上传错误提示
    // 接口回调success 走成功路径，继续上传下一张

    let photo = this.tmpPhotoList[index]

    if (photo.elesrc != "" && photo.elesrc != undefined) {

      wx.uploadFile({
        url: app.globalData.serverHost + "/dream/album/lite/common/uploaduserimg.json",
        filePath: photo.elesrc,
        name: 'image',
        formData: {
          'userId': wx.getStorageSync('userId') + "",
          'albumItemId': photo.albumItemId + "",
          'albumId': albumId + "",
          'index':(photo.rank)+"",
          'appId': app.globalData.appId + "",
          'cssElmMoveX': Math.round(photo.cssShowX/photo.rateWidth)+"",
          'cssElmMoveY': Math.round(photo.cssShowY/photo.rateHeight)+"",
          'cssElmWidth': Math.round(photo.cssShowWidth/photo.rateWidth)+"",
          'cssElmHeight': Math.round(photo.cssShowHeight/photo.rateHeight)+"",
          'cssElmRotate': Math.round(photo.cssElmRotate)+"",
          'isComplete': (index == this.tmpPhotoList.length-1 ? 1: 0)+""
        },
        fail: function (res) {
          wx.hideToast()
          wx.showModal({
            title: "提示1",
            content: "上传文件错误，请从新上传",
            showCancel: false
          })
        },
        success: function (res) {
          let jsdata = JSON.parse(res.data);
          if (jsdata.status != 0) {
            wx.hideToast()
            wx.showModal({
              title: "提示2",
              content: "上传文件错误，请从新上传",
              showCancel: false
            })
            that.setData({
              created: false
            })
            return;
          }
          that.userAlbumId = jsdata.data;
          that.uploadImage(index + 1);
        }
      })
    } else {
      wx.request({
        url: app.globalData.serverHost + "dream/album/lite/common/uploadnotuserimg.json",
        data: {
          'userId': wx.getStorageSync('userId') + "",
          'albumItemId': photo.albumItemId + "",
          'albumId': albumId + "",
          'index':photo.rank,
          'appId': app.globalData.appId + "",
          'isComplete': (index == this.tmpPhotoList.length-1 ? 1: 0)+""
        },
        fail: function (res) {
          wx.hideToast()
          wx.showModal({
            title: "提示3",
            content: "上传文件错误，请从新上传",
            showCancel: false
          })
        },
        success: function (res) {

          if (res.data.status != 0) {
            wx.hideToast()
            wx.showModal({
              title: "提示4",
              content: "上传文件错误，请从新上传",
              showCancel: false
            })
            that.setData({
              created: false
            })
            return;
          }
          let usrAlbId = res.data.data
          that.userAlbumId = usrAlbId
          that.uploadImage(index + 1)
        }
      })
    }
  },
  createAlbum: function(e){
    // this.setData({
    //   scrollLeft: this.data.scrollLeft+10
    // })
    // 照片样式调整完成后上传
    wx.showToast({
      title: '正在上传照片...',
      icon: 'loading',
      duration: 10000
    })
    // 将所有photolist 提取出来
    this.tmpPhotoList = []
    let pagelist = this.getPageList()

    for(let i=0; i<pagelist.length; i++){
      let tmpplist = pagelist[i]
      this.tmpPhotoList = this.tmpPhotoList.concat(tmpplist.photoInfos)
    }

    // uploadimg
    this.uploadImage(0)
  },
  chooseImageList: function(e){
    let that = this;
    wx.chooseImage({
      count: that.data.photoCount,
      success: function (res) {
        if (res.tempFilePaths.length < that.data.photoCount) {
          wx.showModal({
            title: "提示",
            content: "该相册可以上传" + that.data.photoCount + "张照片，您选中" + res.tempFilePaths.length + "张 确认是否制作",
            success: function (rescfm) {
              if (rescfm.confirm) {
                that.initCreatePanel(res.tempFilePaths)
              }
            }
          })
        } else {
          that.initCreatePanel(res.tempFilePaths)
        }
      }
    })
  },
  initCreatePanel: function(tempFilePaths){
    // 选择图片之后,进入化创建面板
    let hiddenGrid = true;
    this.setData({
      hiddenGrid: hiddenGrid
    })
    this.data.albumList[this.data.choosed].hiddenGrid = hiddenGrid
    // 设置每个photo对应的选中的照片
    let that = this
    let idx = 0
    for(let i=0; i< that.data.pageList.length && idx < tempFilePaths.length; i++){
      let page = that.getPageList()[i]
      for(let j =0 ;j< page.photoInfos.length && idx < tempFilePaths.length; j++, idx++){
        page.photoInfos[j].elesrc = tempFilePaths[idx]
      }
    }
    for(let i =0; i< this.getPageList().length; i++){
        this.initPageData(i)
    }
    this.setData({
      pageList : this.getPageList()
    })

  },
  initPageData: function(index){

    // 0<=index <length
    let page = this.getPageList()[index]
    // page.currentPage = index
    let photoList = this.getPhotoList(index)

    // 根据page wh 和 photo wh 计算 显示到屏幕上的width height, css x,y,rotate
    let pageOriHeight = page.imgHeight
    let pageOriWidth = page.imgWidth
    let rateWidth = this.data.pageFullWidth / pageOriWidth
    let rateHeight = this.data.pageFullHeight / pageOriHeight
    // console.log("pageOriHeight",pageOriHeight, "pageOriWidth",pageOriWidth, "rateWidth",rateWidth,"rateHeight",rateHeight,"pageFullWidth",this.data.pageFullWidth, "pageFullHeight", this.data.pageFullHeight)
    for(let i = 0; i<photoList.length; i++){
      let photo = photoList[i]
      photo.rateWidth = rateWidth
      photo.rateHeight = rateHeight
      photo.cssShowWidth = photo.cssElmWidth * rateWidth
      photo.cssShowHeight = photo.cssElmHeight * rateHeight
      photo.cssShowX = photo.cssElmMoveX * rateWidth
      photo.cssShowY = photo.cssElmMoveY * rateHeight
      this.anim.translate(photo.cssShowX, photo.cssShowY).scale(photo.cssShowWidth/100,photo.cssShowHeight/100).rotate(0).step()
      let transformData = this.anim.export()
      photo.transformShadow = transformData;  // 前面阴影部分的动画
      photo.transformImg = transformData;   // 后端图片部分的动画
    }

    // this.setData({
    //   currentPage: index,
    //   photoList: photoList
    // })

    // index <0: 返回到不该返回的位置?

    // index >=length 制作
  },
  nextPage: function(e){
    // this.gotoPage(this.data.currentPage +1)
  },
  backPage: function(e){
    // this.gotoPage(this.data.currentPage -1)
  },
  chooseImage: function (e) {

    let index = e.target.dataset.index
    let idx = e.target.dataset.idx // page idx

    let photoList = this.getPhotoList(idx)
    let photo = photoList[index]
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // let tmppaths = res.tempFilePaths;
        photo.elesrc = res.tempFilePaths[0]
        that.setData({
          pageList: that.getPageList()
        })
      }
    })
  },
  touchstart: function(e){

    this.touchindex = e.target.dataset.index
    this.touchidx = e.target.dataset.idx // page idx

    this.touches = e.touches
    this.setData({
      pagescallable: false
    })
    this.tmpx = 0;
    this.tmpy = 0;
    this.scalex = 1;
    this.scaley = 1;
  },
  touchmove: function(e){
    let that = this
    let touches = e.touches
    let photo = this.getPhotoList(this.touchidx)[this.touchindex]
    if(touches.length <=1){
      // move
      this.tmpx = touches[0].pageX - this.touches[0].pageX
      this.tmpy = touches[0].pageY - this.touches[0].pageY

      this.anim.translate(this.tmpx+photo.cssShowX, this.tmpy+photo.cssShowY).scale(photo.cssShowWidth/100,photo.cssShowHeight/100).step();
      photo.transformImg = this.anim.export();
      this.setData({
        pageList: that.getPageList()
      })
    }else{
      this.scalex = (touches[0].pageX - touches[1].pageX)/ (this.touches[0].pageX - this.touches[1].pageX) * 0.5
      this.scaley = (touches[0].pageY - touches[1].pageY)/ (this.touches[0].pageY - this.touches[1].pageY) * 0.5
      this.tmpShowWidth = photo.cssShowWidth *(0.5 + this.scalex * 0.5)
      this.tmpShowHeight = photo.cssShowHeight *(0.5 + this.scaley * 0.5)
      this.anim.translate(photo.cssShowX, photo.cssShowY).scale(this.tmpShowWidth/100, this.tmpShowWidth/100)
    }
  },
  touchend: function(e){
    let photo = this.getPhotoList(this.touchidx)[this.touchindex]
    if(e.touches.length <=1){
      photo.cssShowX = this.tmpx+photo.cssShowX
      photo.cssShowY = this.tmpy+photo.cssShowY
    }else{
      photo.cssShowWidth = this.tmpShowWidth
      photo.cssShowHeight = this.tmpShowWidth
    }
    this.setData({
      pagescallable: true
    })
  },
  getPageList: function(){
    return this.data.albumList[this.data.choosed].albumItemList
  },
  getPhotoList: function(currentPage){
    let pageList = this.data.albumList[this.data.choosed].albumItemList
    return pageList[currentPage].photoInfos
  },
  setPhotoList: function(currentPage, photos){
    let pageList = this.data.albumList[this.data.choosed].albumItemList
    pageList[currentPage].photoInfos = photos
    this.data.albumList[this.data.choosed].albumItemList = pageList
  },
  refreshData: function(){
  },
  refreshPage: function(){

  },
  refreshPhoto: function(){
  },
  scrollStart: function(e){
    this.scrollPage = e.touches[0]
    this.tmpScrollLeft = this.data.scrollLeft
  },
  scrollMove: function(e){

    let p0 = e.touches[0]
    let tmpLeft = this.scrollPage.pageX - p0.pageX
    let scrollLeft = this.tmpScrollLeft + tmpLeft
    if(scrollLeft < 0){
      scrollLeft = 0
    }else if(scrollLeft > this.data.scrollViewWidth - this.data.content_width){
      scrollLeft = this.data.scrollViewWidth - this.data.content_width
    }
    this.setData({
      scrollLeft: scrollLeft
    })
  },
  scrollEnd: function(e){

  },
  scrollPage: function(e){
    console.log(e)
    let scrollLeft = e.detail.scrollLeft
    let currentPage = Math.floor(scrollLeft/this.data.content_width)
    let rltMovx = scrollLeft - currentPage * this.data.content_width;
    let anc = {}
    anc.tranx = 100- rltMovx /this.data.content_width * 100
    anc.scale = 0.7+ 0.3*(rltMovx/this.data.content_width)

    this.animP.translate(-anc.tranx, 0).scale(anc.scale).step();
    this.setData({
      currentPage: currentPage,
      pageAnimR: this.animP.export()
    })

  }
}
Page(pageData)
