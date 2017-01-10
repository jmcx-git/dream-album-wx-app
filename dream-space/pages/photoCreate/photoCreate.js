var app=getApp()
Page({
  data:{
    imgUrls:[]
  },
  onLoad:function(options){
    let that=this;
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
        console.log("上传图片错误！");
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  sendMessage:function(e){
    wx.navigateBack({
      delta: 1 // 回退前 delta(默认为1) 页面
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