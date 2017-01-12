var app=getApp()
Page({
  data:{
    imgUrls:[],
    spaceId:0,
    version:0,
    uploadFileCount:0
  },
  onLoad:function(options){
    let that=this;
    this.setData({
      spaceId:options.spaceId,
      version:options.version
    })
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
        console.log(res);
        for(var i=0;i<res.tempFilePaths.length;i++){
            var obj=new Object();
            obj.imgPath=(res.tempFilePaths)[i];
            obj.desc='';
            that.data.imgUrls.push(obj);
        }
        that.setData({
          imgUrls:that.data.imgUrls
        })
      },
      fail: function() {
        console.log("没有选择图片！");
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  sendMessage:function(e){
    setTimeout(function(){
      let that=this;
      for(var i=0;i<that.data.imgUrls.length;i++){
        that.uploadFile((that.data.imgUrls)[i]);
      }
    },500)
  },
  uploadFile:function(uploadData){
    console.log(uploadData);
    let that=this;
    wx.uploadFile({
      url: app.globalData.serverHost+'feed/add.json',
      filePath:uploadData.imgPath,
      name:'file',
      formData:{
        'openId':wx.getStorageSync("openId")+'',
        'spaceId':that.data.spaceId,
        'version':that.data.version,
        'type':0,
        'content':uploadData.desc
      },
      success: function(res){
        if(that.data.uploadFileCount==that.data.imgUrls.length-1){
            that.setData({
              uploadFileCount:0
            })
            console.log("上传图片成功!");
            wx.navigateBack({
              delta: 1 // 回退前 delta(默认为1) 页面
            })
        }else{
          that.data.uploadFileCount+=1;
        }
      },
      fail: function(ron) {
        console.log("上传图片失败!");
        console.log(ron);
      }
    })
  },
  gainDesc:function(e){
    let that=this;
    (that.data.imgUrls)[e.currentTarget.dataset.index].desc=e.detail.value;
    this.setData({
      imgUrls:that.data.imgUrls
    })
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    console.log("页面卸载");
    app.globalData.createFinishFlag=true;
  }
})