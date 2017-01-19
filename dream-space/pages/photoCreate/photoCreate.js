var app=getApp()
Page({
  data:{
    imgUrls:[],
    spaceId:0,
    version:0,
    uploadFileCount:0,
    photoDesc:'为今天的记录说点什么呢?',
    photoContent:'',
    init:false
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
        for(var i=0;i<res.tempFilePaths.length;i++){
            var obj=new Object();
            obj.imgPath=(res.tempFilePaths)[i];
            that.data.imgUrls.push(obj);
        }
        that.setData({
          imgUrls:that.data.imgUrls,
          init:true
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
  chooseImage:function(e){
    let that=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res){
        ((that.data.imgUrls)[e.currentTarget.dataset.index]).imgPath=(res.tempFilePaths)[0];
        that.setData({
            imgUrls:that.data.imgUrls
        })
      }
    })
  },
  chooseImageAdd:function(e){
    let that=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res){
        var obj=new Object();
        obj.imgPath=(res.tempFilePaths)[0];
        that.data.imgUrls.push(obj);
        that.setData({
            imgUrls:that.data.imgUrls
        })
      }
    })
  },
  delImage:function(e){
    let that=this;
    that.data.imgUrls.splice(e.currentTarget.dataset.index,1);
    that.setData({
      imgUrls:that.data.imgUrls
    })
  },
  sendMessage:function(e){
    let that=this;
    if(that.data.imgUrls.length==0){
    wx.showToast({
        title:'至少选择一张图片',
        icon:'warn',
        duration:1000,
        mask:true
     })
     return;
    }
    wx.showToast({
      title:'保存中',
      icon:'loading',
      duration:10000,
      mask:true
    })
    // var content=encodeURI(that.data.photoContent);
    // setTimeout(function(){
    //   for(var i=0;i<that.data.imgUrls.length;i++){
    //     that.uploadFile((that.data.imgUrls)[i]);
    //   }
    // },200)
    setTimeout(function(){
      that.uploadFileRank(0);
    },200)
  },
  uploadFileRank:function(index){
    let that=this;
    var content=encodeURI(that.data.photoContent);
    let data={
        openId:app.globalData.openId,
        spaceId:that.data.spaceId,
        version:that.data.version,
        type:0,
        content:content
      };
    wx.uploadFile({
      url: app.globalData.serverHost+'feed/add.json',
      filePath:((that.data.imgUrls)[index]).imgPath,
      name:'file',
      formData:data,
      success: function(res){
        if(that.data.uploadFileCount==that.data.imgUrls.length-1){
            that.setData({
              uploadFileCount:0
            })
            wx.hideToast();
            app.globalData.createFinishFlag=true;
            wx.navigateBack({
              delta: 1 // 回退前 delta(默认为1) 页面
            })
        }else{
          that.data.uploadFileCount+=1;
          that.uploadFileRank(that.data.uploadFileCount);
        }
      },
      fail: function(ron) {
        console.log("上传图片失败!");
        console.log(ron);
        app.uploadFileFailedToast();
      }
    })
  },
  uploadFile:function(uploadData){
    let that=this;
    var content=encodeURI(that.data.photoContent);
    let data={
        openId:app.globalData.openId,
        spaceId:that.data.spaceId,
        version:that.data.version,
        type:0,
        content:content
      };
    wx.uploadFile({
      url: app.globalData.serverHost+'feed/add.json',
      filePath:uploadData.imgPath,
      name:'file',
      formData:data,
      success: function(res){
        if(that.data.uploadFileCount==that.data.imgUrls.length-1){
            that.setData({
              uploadFileCount:0
            })
            wx.hideToast();
            app.globalData.createFinishFlag=true;
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
        app.uploadFileFailedToast();
      }
    })
  },
  gainDesc:function(e){
    let that=this;
    that.setData({
      photoContent:e.detail.value
    })
  },
  previewImage:function(e){
    var urls=[];
    urls.push(e.currentTarget.dataset.src);
    wx.previewImage({
      urls: urls
    })
  },
  showControl:function(e){
    let that=this;
    wx.showActionSheet({
        itemList:['预览','更换','删除'],
        success:function(res){
          if(res.tapIndex==0){
            that.previewImage(e);
          }else if(res.tapIndex==1){
            that.chooseImage(e);
          }else if(res.tapIndex==2){
            that.delImage(e);
          }
        }
      })
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    this.setData({
      init:false,
      imgUrls:[],
      photoContent:''
    })
    // app.globalData.createFinishFlag=true;
  }
})