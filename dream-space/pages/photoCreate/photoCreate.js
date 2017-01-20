var app=getApp()
Page({
  data:{
    imgUrls:[],
    spaceId:0,
    version:0,
    uploadFileCount:0,
    photoDesc:'为今天的记录说点什么呢?',
    photoContent:'',
    init:false,
    feedId:0
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
    var count=9-that.data.imgUrls.length;
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res){
        for(var i=0;i<res.tempFilePaths.length;i++){
            var obj=new Object();
            obj.imgPath=(res.tempFilePaths)[i];
            that.data.imgUrls.push(obj);
        }
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
      title:'准备上传',
      icon:'loading',
      duration:10000,
      mask:true
    })
    setTimeout(function(){
      that.sendContent();
    },200)
  },
  sendContent:function(){
    let that=this;
    var content=that.data.photoContent;
    wx.request({
      url: app.globalData.serverHost+'feed/multi/add.json',
      data: {
        content:content,
        openId:app.globalData.openId,
        spaceId:that.data.spaceId,
        version:that.data.version
      },
      method: 'GET',
      success: function(res){
        wx.hideToast();
        that.setData({
          feedId:res.data.data
        })
        setTimeout(function(){
          that.uploadFileRank(0);
        },200)
      },
      fail: function(ron) {
        console.log("提交简介失败");
        console.log(ron);
        app.failedToast();
      }
    })
  },
  uploadFileRank:function(index){
    let that=this;
    wx.showToast({
      title:'上传第'+(index+1)+'张图片',
      icon:'loading',
      duration:10000,
      mask:true
    })
    let data={
        openId:app.globalData.openId,
        spaceId:that.data.spaceId,
        version:that.data.version,
        feedId:that.data.feedId,
        index:index,
        count:that.data.imgUrls.length,
        type:0
      };
    wx.uploadFile({
      url: app.globalData.serverHost+'feed/multi/add.json',
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
          setTimeout(function(){
            wx.hideToast();
            that.uploadFileRank(that.data.uploadFileCount);
          },200)
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
    let that=this;
    var urls=[];
    for(var i=0;i<that.data.imgUrls.length;i++){
      urls.push(((that.data.imgUrls)[i]).imgPath);
    }
    // urls.push(e.currentTarget.dataset.src);
    wx.previewImage({
      urls: urls,
      current:e.currentTarget.dataset.src
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