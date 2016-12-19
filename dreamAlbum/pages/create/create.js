var app = getApp();
let pageData = {
  data:{
    submodules:[],
    index:0,
    elm_fnt: false,  // 元素前面的控制view是否显示（首页不需要添加照片元素的页不显示）
  },
  onLoad: function(option){
    // 读取传入和本地数据
    this.albumId = option.albumId;
    this.userId = wx.getStorageSync('userId');

    this.windowWidth = app.globalData.windowWidth;
    this.windowHeight = app.globalData.windowHeight;
    this.convertTimes = 750/this.windowWidth
    
    let that = this;
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 10000
    })
    
    wx.request({
      url: app.globalData.serverHost + "dream/album/common/startmakeuseralbum.json",
      data:{
        albumId: this.albumId,
        userId: this.userId
      },
      success:function(res){
        that.handleResult(res)
      },
      fail:function(res){
        that.requestfailed(res)
      }
    })
  },
  handleResult: function(res){
    let albumItemInfos = res.data.albumItemInfos;
    // let userAlbumItemInfos = res.data.userAlbumItemInfos;
    this.currentIndex=0;

    // 循环读取 albumItemInfos
    let submodules = [];
    for(let i=0;i<albumItemInfos.length;i++){
      let amodule = albumItemInfos[i]
      let submodule = {}
      submodule.bgsrc = amodule.editImgUrl;
      // submodule.elesrc = amodule.userOriginImgUrl
      // if(submodule.elesrc == undefined || submodule.elesrc == ""){
      submodule.elesrc = ''
      // }
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
  init:function(index){
    // init data
    let submodule = this.data.submodules[index]

    let elm_fnt = submodule.elecount>0?false:true
    //px=(750/屏幕宽度)rpx
    
    let shadowImgWidth = submodule.editAreaWidth / submodule.bgImgWidth * (this.windowWidth * 0.84)*this.convertTimes;
    let shadowImgHeight = submodule.editAreaHeight / submodule.bgImgHeight * (this.windowHeight*this.convertTimes-220);
    let shadowImgLeft = 0.08 * this.windowWidth * this.convertTimes +  submodule.editAreaLeft / submodule.bgImgWidth * (this.windowWidth*0.84)*this.convertTimes;
    let shadowImgTop = 0.08 * this.windowWidth * this.convertTimes + submodule.editAreaTop / submodule.bgImgHeight * (this.windowHeight*this.convertTimes-220);

    // 设置数据：
    this.setData({
      index: index,
      elm_fnt: elm_fnt,
      contentHeight: this.windowHeight*this.convertTimes-220+"rpx",
      bgWidth:(this.windowWidth*0.84)*this.convertTimes+"rpx",
      bgHeight: this.windowHeight*this.convertTimes-220+"rpx", 
      editAreaRelativeTop: shadowImgTop + "rpx",
      editAreaRelativeLeft: shadowImgLeft + "rpx",
      editAreaRelativeWidth: shadowImgWidth + "rpx",
      editAreaRelativeHeight: shadowImgHeight + "rpx"
    })
  },
  chooseImage: function(e){
    let that = this;
    let index = this.data.index;
    if(index==0){
      wx.showToast({
        title: '首页无上传图片!',
        icon: 'success',
        duration: 2000
      })
      return;
    }
    wx.chooseImage({
      sizeType:["original","compressed"],
      scourceType:["album","camera"],
      success: function(res){
        that.data.submodules[index].elesrc = res.tempFilePaths[0]       
        //每次选图以后choosed状态为true，将会走保存图片操作
        that.data.submodules[index].choosed = true
        that.setData({
          submodules: that.data.submodules
        })
      }
    })
  },
  next: function(e){
    let index = this.data.index;
    let length = this.data.submodules.length;
    let that = this
    if(!this.data.elm_fnt){
      this.save(index)
    }
    if(index <length-1){
      this.init(++index)
    }else{
      wx.showModal({
        title:"提示",
        content:"制作完成，点击确定预览",
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            app.globalData.finishCreateFlag=true;
            wx.redirectTo({
              url: '../viewswiper/viewswiper?userAlbumId='+that.data.userAlbumId
            })
          }
        }
      })
    }
  },
  save: function(index){
    var that = this;
    // 点击下一步时保存数据
    let submodule = this.data.submodules[index];
    if(submodule.choosed){
      wx.uploadFile({
        url: app.globalData.serverHost+"/dream/album/common/uploadalbumpage.json",
        filePath: submodule.elesrc,
        name: 'image',
        formData: {
          userAlbumId: that.data.userAlbumId + "",
          albumItemId: submodule.id + ""
        },
        success: function(res){
          //上传已选图片,清零choosed状态
          submodule.choosed=false
        },
        fail: function(res){
          that.requestfailed(res);
        }
      })
    }else{
      wx.request({
        url: app.globalData.serverHost+"/dream/album/common/uploademptypage.json",
        data: {
          'userAlbumId': this.data.userAlbumId,
          'albumItemId': submodule.id
        },
        method: 'GET',
        success: function(res){
        },
        fail:function(res){
          that.requestfailed(res)
        }
      })
    }
  },
  back: function(e){
    let index = this.data.index;
    if(index >0){
      this.init(--index)
    }
  },
  requestfailed:function(res){
    wx.showModal({
        title:"提示",
        content: "网络错误，请稍后再试！"
    })
    wx.hideToast()
  }
}
Page(pageData)