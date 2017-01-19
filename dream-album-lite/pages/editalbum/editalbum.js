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
    icon_top: 0,   // 完成按钮的top和left值
    icon_left: 0,
    created: false,
    hiddenGrid: true, // 是否显示预览(四宫格)图 true 显示四宫格,false显示创建预览页
    currentPage: 0, // 创建面板上, 当前处理的页面 起始为0
    photoCount: 0,   // 当前相册所有的照片的数量
    scrollLeft: 0,
    scrollLeftValues: [],
    pageAnimCur: {},
    pageAnimR:{},
    pageAnimL:{},
    pagescallable: true,
    albumId: 0,
    hiddenmusic: true
  },
  convertRpx: function(px){
    return this.convertTimes * px
  },
  convertPx: function(rpx){
    return rpx /this.convertTimes
  },
  onLoad: function (option) {
    this.convertTimes = 750 / app.globalData.windowWidth;
    // 读取传入和本地数据
    this.anim = wx.createAnimation({
      transformOrigin:"0 0 0",
      duration: 0,
    })
    this.animPhoto = wx.createAnimation({
      transformOrigin: "0 0 0",
      duration: 500,
    })
    this.animP= wx.createAnimation({duration:0});
    this.setData({
      tempFilePaths: option.tempFilePaths.split(","),
      albumId: option.albumId,
      needInitPhoto: true
    })
    this.init()
    // this.initCreatePanel(this.data.tempFilePaths);
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

    this.setData({
      pageList: pageList,
      // photoList: this.getPhotoList(index),
      hiddenGrid: true,
      photoCount: photoCount,
      scrollLeft: this.data.scrollLeftValues[index] == undefined? 0: this.data.scrollLeftValues[index],
      hiddenmusic: album.music == ""
    })
  },
  init: function () {
    let that = this
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    })

    let templateHeight = (app.globalData.windowHeight - 20) / 5 - 30
    let templateWidth = (app.globalData.windowWidth - 40) / 4.2
    if(templateHeight < templateWidth){
      templateHeight += 14
    }

    let content_hegiht = (app.globalData.windowHeight - 20) * 0.82
    let pageFullHeight = content_hegiht *0.90
    let pageFullWidth = pageFullHeight / 920 * 574
    if(pageFullWidth > app.globalData.windowWidth *0.8){
      pageFullWidth = app.globalData.windowWidth *0.8
      pageFullHeight = pageFullWidth / 574 * 920
    }
    this.setData({
      moduleWidth: this.convertRpx((app.globalData.windowWidth - 100) / 2),
      moduleHeight: this.convertRpx(((app.globalData.windowHeight - 20) / 5 * 4 - 30) / 2),
      templateWidth: this.convertRpx(templateWidth),
      templateHeight: this.convertRpx(templateHeight),
      templateIconSize: this.convertRpx(templateWidth * 0.8), // 宽度的0.8
      templateTextSize: this.convertRpx(templateWidth * 0.8 * 0.3),
      templateFontSize: this.convertRpx(templateWidth * 0.8 * 0.2),
      content_hegiht: this.convertRpx(content_hegiht),
      content_width: this.convertRpx(app.globalData.windowWidth),
      pageFullHeight: this.convertRpx(pageFullHeight),
      pageFullWidth: this.convertRpx(pageFullWidth),

      item_width: this.convertRpx(app.globalData.windowWidth),
      icon_top: this.convertRpx(((app.globalData.windowHeight - 20) / 5 * 4 - 80 + 20) / 2),
      icon_left: this.convertRpx((app.globalData.windowWidth - 70) / 2),
      sy_top: this.convertRpx(10),
      sy_left: this.convertRpx(45)
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
        that.data.scrollLeftValues [alist.length-1] = 0
        if (res.data.length < that.data.size) {
          that.data.nomore = true
        }
        for(var i = 0; i < alist.length; i++){
          if(alist[i].id == that.data.albumId){
            that.setData({
              choosed: i
            })
          }
        }
        that.initAlbumDetail(that.data.choosed)
        wx.hideToast()
        if(that.data.needInitPhoto){
          that.setData({
            needInitPhoto: false
          })
          that.initCreatePanel(that.data.tempFilePaths)
        }

      },
      fail: function (res) {
        that.requestFailed(res)
      }
    })
  },
  chooseTemplate: function (e) {
    this.data.scrollLeftValues[this.data.choosed] = this.data.scrollLeft
    let newchoosed = e.target.dataset.albumindex
    let album = this.data.albumList[newchoosed]
    this.setData({
      choosed: newchoosed

    })
    this.initAlbumDetail(this.data.choosed)
    if(this.data.albumList[this.data.choosed].initPhoto != true){
      this.initCreatePanel(this.data.tempFilePaths)
    }

  },
  uploadImage: function (index) {
    try{
      // 上传图片， index：图片在 that.data.submodules 的下表
      let that = this
      wx.hideToast()

      // 一些必要的数据
      let albumId = that.data.albumList[that.data.choosed].id

      // 判断index = length：应该停止，跳转下一页
      if (index == this.tmpPhotoList.length) {
        app.globalData.finishCreateFlag = true;
        // that.iscreating = false
        wx.showModal({
          title: "创建完成",
          cancelText: "返回首页",
          confirmText: "预览相册",
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../viewswiper/viewswiper?userAlbumId=' + that.userAlbumId + "&from=1"
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
            'openId': app.globalData.openId,
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
            console.log(res)
            that.iscreating = false
            wx.hideToast()
            wx.showModal({
              title: "提示",
              content: "上传文件错误，请从新上传",
              showCancel: false
            })
          },
          success: function (res) {
            try{
            console.log(res)
            if(res.statusCode == 200){
              let jsdata = JSON.parse(res.data);
              if (jsdata.status != 0) {
                that.iscreating = false
                wx.hideToast()
                wx.showModal({
                  title: "提示",
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
            }else{
              that.iscreating = false
              wx.hideToast()
              wx.showModal({
                title: "提示",
                content: "上传文件错误，请从新上传",
                showCancel: false
              })
              that.setData({
                created: false
              })
            }
          }catch(e){
            that.iscreating = false
          }

          }
        })
      } else {
        wx.request({
          url: app.globalData.serverHost + "dream/album/lite/common/uploadnotuserimg.json",
          data: {
            'openId': app.globalData.openId,
            'albumItemId': photo.albumItemId + "",
            'albumId': albumId + "",
            'index':photo.rank,
            'appId': app.globalData.appId + "",
            'isComplete': (index == this.tmpPhotoList.length-1 ? 1: 0)+""
          },
          fail: function (res) {
            that.iscreating = false
            wx.hideToast()
            wx.showModal({
              title: "提示",
              content: "上传文件错误，请从新上传",
              showCancel: false
            })
          },
          success: function (res) {
            try{
            console.log(res)
            if (res.data.status != 0) {
              that.iscreating = false
              wx.hideToast()
              wx.showModal({
                title: "提示",
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
          }catch(e){
            that.iscreating = false
          }
        }
        })
      }
    }catch(e){
      that.iscreating = false
    }

  },
  createAlbum: function(e){
    console.log("creating", this.iscreating )
    if(this.iscreating == true){
      return
    }
    this.iscreating = true;
    try{
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
    }catch(er){
      this.iscreating = false
    }

  },
  initCreatePanel: function(tempFilePaths){
    // 选择图片之后,进入化创建面板
    let hiddenGrid = true;
    this.setData({
      hiddenGrid: hiddenGrid
    })

    this.data.albumList[this.data.choosed].hiddenGrid = hiddenGrid

    this.data.albumList[this.data.choosed].initPhoto = true
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
      pageList : this.getPageList(),
      scrollLeft: this.data.scrollLeftValues[this.data.choosed] == undefined? 0: this.data.scrollLeftValues[this.data.choosed]
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
    let rateWidth = this.convertPx(this.data.pageFullWidth) / pageOriWidth
    let rateHeight = this.convertPx(this.data.pageFullHeight) / pageOriHeight

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
      let borders = {}
      borders.left = photo.cssShowX
      borders.top = photo.cssShowY
      borders.right = photo.cssShowX +photo.cssShowWidth
      borders.bottom = photo.cssShowY + photo.cssShowHeight
      photo.borders = borders
    }


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

    this.threshold = 30;
    this.animEx = {};
  },
  touchmove: function(e){
    let pageWidth = this.convertPx(this.data.pageFullWidth)
    let pageHeight = this.convertPx(this.data.pageFullHeight)
    let that = this
    let touches = e.touches
    let photo = this.getPhotoList(this.touchidx)[this.touchindex]
    this.tmpx = photo.cssShowX
    this.tmpy = photo.cssShowY
    this.tmpShowWidth = photo.cssShowWidth
    this.tmpShowHeight = photo.cssShowHeight

    let borders = photo.borders;
    let photoW = photo.cssShowWidth
    let photoH = photo.cssShowHeight
    let photoX = photo.cssShowX
    let photoY = photo.cssShowY
    if(touches.length <=1){
      // move
      this.tmpx = touches[0].pageX - this.touches[0].pageX +photo.cssShowX
      this.tmpy = touches[0].pageY - this.touches[0].pageY +photo.cssShowY

      // 判断移动后的边界, 确保不会移出框
      let photoLeft = this.tmpx
      let photoTop = this.tmpy
      let photoRight = this.tmpx + photoW
      let photoBottom = this.tmpy + photoH

      if(photoLeft > borders.left){
        if(photoLeft > borders.left +this.threshold){
          this.tmpx = borders.left +this.threshold
        }
        this.finalx = borders.left
      }else{
        this.finalx = this.tmpx
      }

      if(photoTop > borders.top){
        if(photoTop > borders.top +this.threshold){
          this.tmpy = borders.top +this.threshold
        }
        this.finaly = borders.top
      }else{
        this.finaly = this.tmpy
      }

      if(this.finalx == this.tmpx && photoRight < borders.right){
        if(photoRight < borders.right-this.threshold){
          this.tmpx = borders.right - photoW -this.threshold
        }
        this.finalx = borders.right - photoW
      }

      if(this.finaly == this.tmpy &&photoBottom <borders.bottom){
        if(photoBottom < borders.bottom -this.threshold){
          this.tmpy = borders.bottom - photoH-this.threshold
        }
        this.finaly = borders.bottom - photoH
      }

    }else{
      this.scalex = (touches[0].pageX - touches[1].pageX)/ (this.touches[0].pageX - this.touches[1].pageX) * 0.5
      this.scaley = (touches[0].pageY - touches[1].pageY)/ (this.touches[0].pageY - this.touches[1].pageY) * 0.5
      this.tmpShowWidth = photo.cssShowWidth *(0.5 + this.scalex * 0.5)
      this.tmpShowHeight = photo.cssShowHeight *(0.5 + this.scaley * 0.5)

      // 确保缩放比例大于1
      if(this.tmpShowWidth < photo.cssShowWidth){
        this.tmpShowWidth = photo.cssShowWidth
      }
      if(this.tmpShowHeight < photo.cssShowHeight){
        this.tmpShowHeight = photo.cssShowHeight
      }
    }

    this.anim.translate(this.tmpx,this.tmpy).
      scale(this.tmpShowWidth/100, this.tmpShowHeight/100).step();
    photo.transformImg = this.anim.export();
    this.setData({
      pageList: that.getPageList()
    })
  },
  touchend: function(e){
    let photo = this.getPhotoList(this.touchidx)[this.touchindex]
    if(e.touches.length <=1){
      photo.cssShowX = this.finalx
      photo.cssShowY = this.finaly
    }else{
      photo.cssShowWidth = this.tmpShowWidth
      photo.cssShowHeight = this.tmpShowWidth
    }
    if(this.tmpx != this.finalx || this.tmpy != this.finaly){
      this.anim.translate(this.finalx, this.finaly).scale(this.tmpShowWidth/100, this.tmpShowHeight /100).step();
      photo.transformImg = this.anim.export();
    }

    this.setData({
      pagescallable: true,
      pageList: this.getPageList()
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

    this.setData({
      scrollLeft: scrollLeft
    })
  },
  scrollEnd: function(e){

  },
  scrollPage: function(e){

    let scrollLeft = e.detail.scrollLeft
    this.data.scrollLeft = scrollLeft
    let currentPage = Math.floor(scrollLeft/this.convertPx(this.data.content_width))
    this.setData({
      currentPage: currentPage
    })

  },
  scrolltoupper: function(e){

  }
}
Page(pageData)
