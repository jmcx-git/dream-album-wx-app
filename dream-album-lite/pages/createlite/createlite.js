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
    icon_left:0
  },
  onLoad: function (option) {
    // 读取传入和本地数据
    this.data.tempFilePaths = option.tmpfilepaths.split(',')

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
        start:that.data.start
      },
      method: 'GET',
      success: function(res){

        let alist = that.data.albumList.concat(res.data)
        alist = alist.concat(res.data)
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
  redirectToView: function(i, userAlbumId){
    this.tag = this.tag? this.tag+i: i;
    let length = this.data.submodules.length

    let needRedirect = (length-1)*length/2 == this.tag

    if(needRedirect){
      wx.hideToast()
      wx.redirectTo({
        url: '../viewswiper/viewswiper?userAlbumId=' + userAlbumId
      })
    }
  },
  createAlbum: function(e){
    let that = this;
    wx.showToast({
      title: '正在上传照片...',
      icon: 'loading',
      duration: 10000
    })
    let albumId = that.data.albumList[that.data.choosed].id
    let uploadfailed = false
    for(let i =0;i< that.data.submodules.length && !uploadfailed;i++){
      let submodule = that.data.submodules[i]

      if(submodule.elesrc != ""){
        wx.uploadFile({
          url: app.globalData.serverHost + "/dream/album/common/uploaduserimg.json",
          filePath: submodule.elesrc,
          name: 'image',
          formData: {
            'userId': "3",//wx.getStorageSync('userId'),
            'albumItemId': submodule.id+"",
            'albumId': albumId+""
          },
          fail: function (res) {
            uploadfailed = true
          },
          success: function(res){

            let jsdata = JSON.parse(res.data)
            that.redirectToView(i, jsdata.data)
          }
        })
      }else{
        wx.request({
          url: app.globalData.serverHost + "dream/album/common/uploadnotuserimg.json",
          data: {
            'userId': "3",//wx.getStorageSync('userId'),
            'albumItemId': submodule.id+"",
            'albumId': albumId+""
          },
          fail: function (res) {
            uploadfailed = true
          },
          success: function(res){
            
            let usrAlbId = res.data.data
            that.redirectToView(i, usrAlbId)
          }
        })
      }
    }
    if (uploadfailed){
      wx.hideToast()
      wx.showModal({
        title: "提示",
        content: "上传文件错误，请从新上传",
        showCancel: false
      })
    }
  }
}
Page(pageData)
