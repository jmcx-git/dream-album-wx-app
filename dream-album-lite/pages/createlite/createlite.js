var app = getApp();
let pageData = {
  // cst:{
  //   interval_content_item: 20,
  //   interval_content_row: 20,
  //   interval_content_column: 20,
  //   interval_item_row:20,
  //   interval_item_column:20,
  //   content_weight:4,
  //   item_weight:1
  // },
  data: {
    start:0,  // 用于模板列表分页请求
    size:10,
    choosed: 1,
    tempFilePaths:[],  // 用户选中的图片 共4(app.globalData.albumPageCount)张
    albumList:[],
    submodules:[],
    moduleWidth:0,  // 预览部分，每个背景图图片的宽高
    moduleHeight:0,
    templateWidth:0,  // 模板选择部分，每个图片的宽高
    templateHeight:0,
    content_hegiht: 0 // content 部分高度
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

    this.setData({
      moduleWidth :(app.globalData.windowWidth-60)/2,
      moduleHeight :((app.globalData.windowHeight - 20)/5*4 -40)/2,
      templateWidth :(app.globalData.windowWidth  -80)/3.3,
      templateHeight :(app.globalData.windowHeight -20)/5 - 20,
      content_hegiht : (app.globalData.windowHeight - 20)/5*4,
      item_width: app.globalData.windowWidth
    })

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
  requestFailed:function(res){
    wx.showModal({
      title:"提示",
      content: "网络错误，请稍后再试！"
    }),
    wx.hideToast()
  },
  loadMoreTmplate:function(e){
    let alist = this.data.albumList
    alist = alist.concat(this.data.albumList)
    this.setData({
      albumList:alist,
    });
  }
}
Page(pageData)
