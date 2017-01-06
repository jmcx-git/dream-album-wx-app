var app = getApp();
let pageData = {
  data: {
    start: 0,  // 用于模板列表分页请求
    size: 10,
    choosed: 0, // 当前选中的模板
    tempFilePaths: [],  // 用户选中的图片
    albumList: [],  // 模板列表
    pageList: [], // 页面列表 每个模板中页面为多个

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
    hiddenGrid: false, // 是否显示预览(四宫格)图 true 显示四宫格,false显示创建预览页
    currentPage: 0, // 创建面板上, 当前处理的页面 起始为0
    photoCount: 0,   // 当前相册所有的照片的数量
    scrollLeft: 0,
    scrollLeftValues: [],
    pageAnimCur: {},
    pageAnimR:{},
    pageAnimL:{},
    pagescallable: true,
    picLoadCount: 0,
    picLoadFinished: false
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
    this.preview = 0;
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
    this.initpreview()
    this.setData({
      hiddenGrid: hiddenGrid == true? true: false,
      photoCount: photoCount,
      scrollLeft: this.data.scrollLeftValues[index] == undefined? 0: this.data.scrollLeftValues[index]
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
    let pageFullHeight = content_hegiht *0.95
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
      // templateTextSize: this.convertRpx(templateHeight - (templateWidth * 0.8)),
      // templateFontSize: this.convertRpx((templateHeight - (templateWidth * 0.9)) * 0.8),
      templateTextSize: this.convertRpx(templateWidth * 0.8 * 0.3),
      templateFontSize: this.convertRpx(templateWidth * 0.8 * 0.25),
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
        that.initAlbumDetail(that.data.choosed)
        // wx.hideToast()
      },
      fail: function (res) {
        that.requestFailed(res)
      }
    })
  },
  chooseTemplate: function (e) {
    this.data.scrollLeftValues[this.data.choosed] = this.data.scrollLeft
    this.setData({
      choosed: e.target.dataset.albumindex,
      picLoadFinished: false,
      picLoadCount: 0
    })
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    })
    this.initAlbumDetail(this.data.choosed)
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
    //goto editalbum
    this.data.albumList[this.data.choosed].id
    wx.navigateTo({
      url: '../editalbum/editalbum?albumId=' + this.data.albumList[this.data.choosed].id + '&tempFilePaths=' + tempFilePaths.join(",")
    })
  },
  nextPage: function(e){
    // this.gotoPage(this.data.currentPage +1)
  },
  backPage: function(e){
    // this.gotoPage(this.data.currentPage -1)
  },
  getPageList: function(){
    return this.data.albumList[this.data.choosed].albumItemList
  },
  refreshData: function(){
  },
  refreshPage: function(){

  },
  refreshPhoto: function(){
  },
  changepreview: function(e){
    // console.log(e)
    this.preview = (this.preview+1) %2
    this.initpreview()
  },
  initpreview: function(){
    // console.log(this.preview)
    let pagelist = this.getPageList();
    for(let i =0; i<pagelist.length; i++){
      let page = pagelist[i]
      switch (this.preview) {
        case 0:
          page.preview = page.editImgUrl
          break;
        case 1:
          page.preview = page.previewImgUrl
          break
        default:
      }
    }
    this.setData({
      pageList: pagelist
    })
  },
  loadPagePic: function(e){
    console.log(e)
    this.setData({
      picLoadCount: this.data.picLoadCount +1
    })

    if(this.data.picLoadCount > this.getPageList().length -2){
      this.setData({
        picLoadFinished: true
      })
      wx.hideToast()
    }
  }
}
Page(pageData)
